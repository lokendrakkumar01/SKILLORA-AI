import { Router, Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import Roadmap from '../models/Roadmap';
import LessonProgress from '../models/LessonProgress';
import User from '../models/User';
import * as gamification from '../services/gamificationService';

const router = Router();

// GET /api/lessons/:stepId?roadmapId=xxx
router.get('/:stepId', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { roadmapId } = req.query;
    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: req.user!.id });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });

    let foundStep: any = null;
    for (const phase of roadmap.phases) {
      for (const mod of phase.modules) {
        for (const step of mod.steps) {
          if (String(step._id) === req.params.stepId) {
            foundStep = step;
            break;
          }
        }
      }
    }

    if (!foundStep) return res.status(404).json({ error: 'Lesson not found' });

    // Get existing progress
    const progress = await LessonProgress.findOne({
      userId: req.user!.id,
      roadmapId,
      stepId: req.params.stepId,
    });

    res.json({ step: foundStep, progress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// POST /api/lessons/:stepId/complete
router.post('/:stepId/complete', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { roadmapId, timeSpentMinutes = 20 } = req.body;
    if (!roadmapId) return res.status(400).json({ error: 'roadmapId required' });

    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: req.user!.id });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });

    // Check not already completed
    const existing = await LessonProgress.findOne({
      userId: req.user!.id,
      roadmapId,
      stepId: req.params.stepId,
      status: 'completed',
    });

    let xpEarned = 0;
    if (!existing) {
      // Mark complete
      await LessonProgress.findOneAndUpdate(
        { userId: req.user!.id, roadmapId, stepId: req.params.stepId },
        { status: 'completed', completedAt: new Date(), timeSpentMinutes },
        { upsert: true, new: true }
      );

      // Find step and award its XP
      let stepXp = 50;
      for (const phase of roadmap.phases) {
        for (const mod of phase.modules) {
          for (const step of mod.steps) {
            if (String(step._id) === req.params.stepId) {
              step.status = 'completed';
              stepXp = step.xpReward || 50;
            }
          }
        }
      }

      // Unlock next step
      let found = false;
      for (const phase of roadmap.phases) {
        for (const mod of phase.modules) {
          for (let i = 0; i < mod.steps.length; i++) {
            if (found && mod.steps[i].status === 'locked') {
              mod.steps[i].status = 'available';
              found = false;
            }
            if (String(mod.steps[i]._id) === req.params.stepId) found = true;
          }
        }
      }

      // Recalculate completion
      let total = 0; let done = 0;
      for (const phase of roadmap.phases) {
        for (const mod of phase.modules) {
          for (const step of mod.steps) {
            total++;
            if (step.status === 'completed') done++;
          }
        }
      }
      roadmap.completionPercentage = total > 0 ? Math.round((done / total) * 100) : 0;
      roadmap.markModified('phases');
      await roadmap.save();

      // Award XP and update stats
      xpEarned = stepXp;
      await gamification.awardXP(req.user!.id, xpEarned);
      await User.findByIdAndUpdate(req.user!.id, { $inc: { totalLessonsCompleted: 1 } });
      const streak = await gamification.updateStreak(req.user!.id);
      const newAchievements = await gamification.checkAndAwardAchievements(req.user!.id);

      return res.json({ message: 'Lesson completed!', xpEarned, streak, newAchievements });
    }

    res.json({ message: 'Already completed', xpEarned: 0 });
  } catch (err) {
    console.error('Complete lesson error:', err);
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

export default router;

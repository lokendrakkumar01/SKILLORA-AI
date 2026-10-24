import { Router, Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import Roadmap from '../models/Roadmap';
import QuizAttempt from '../models/QuizAttempt';
import User from '../models/User';
import * as gamification from '../services/gamificationService';

const router = Router();

// POST /api/quizzes/:stepId/submit
router.post('/:stepId/submit', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { roadmapId, answers } = req.body;
    if (!roadmapId || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'roadmapId and answers required' });
    }

    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: req.user!.id });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });

    // Find step
    let step: any = null;
    for (const phase of roadmap.phases) {
      for (const mod of phase.modules) {
        for (const s of mod.steps) {
          if (String(s._id) === req.params.stepId) { step = s; break; }
        }
      }
    }
    if (!step) return res.status(404).json({ error: 'Step not found' });

    const questions = step.quizQuestions || [];
    if (questions.length === 0) return res.status(400).json({ error: 'No quiz questions found' });

    // Calculate score
    let correct = 0;
    const results = questions.map((q: any, i: number) => {
      const isCorrect = answers[i] === q.correct;
      if (isCorrect) correct++;
      return {
        question: q.question,
        userAnswer: answers[i],
        correctAnswer: q.correct,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= 70;

    // Count existing attempts
    const attemptCount = await QuizAttempt.countDocuments({
      userId: req.user!.id,
      roadmapId,
      stepId: req.params.stepId,
    });

    // Only award XP on first pass
    let xpEarned = 0;
    if (passed && attemptCount === 0) {
      xpEarned = 100;
      await gamification.awardXP(req.user!.id, xpEarned);
      await User.findByIdAndUpdate(req.user!.id, { $inc: { totalQuizzesTaken: 1 } });
    } else if (attemptCount === 0) {
      await User.findByIdAndUpdate(req.user!.id, { $inc: { totalQuizzesTaken: 1 } });
    }

    await QuizAttempt.create({
      userId: req.user!.id,
      roadmapId,
      stepId: req.params.stepId,
      answers,
      score,
      totalQuestions: questions.length,
      passed,
      xpEarned,
      attemptNumber: attemptCount + 1,
    });

    const newAchievements = await gamification.checkAndAwardAchievements(req.user!.id);

    res.json({ score, passed, correct, total: questions.length, results, xpEarned, newAchievements });
  } catch (err) {
    console.error('Quiz submit error:', err);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

export default router;

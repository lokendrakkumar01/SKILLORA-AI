import { Router, Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Roadmap from '../models/Roadmap';
import LessonProgress from '../models/LessonProgress';
import QuizAttempt from '../models/QuizAttempt';
import Achievement from '../models/Achievement';
import StudyActivity from '../models/StudyActivity';

const router = Router();

// GET /api/progress/overview
router.get('/overview', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const [user, roadmaps, lessonsDone, quizAttempts, achievements] = await Promise.all([
      User.findById(userId).select('xp streak name level totalLessonsCompleted'),
      Roadmap.find({ userId }).select('title status completionPercentage goal level'),
      LessonProgress.countDocuments({ userId, status: 'completed' }),
      QuizAttempt.find({ userId }).select('score passed'),
      Achievement.find({ userId }).sort('-earnedAt').limit(5),
    ]);

    const totalQuizzes = quizAttempts.length;
    const passedQuizzes = quizAttempts.filter((q) => q.passed).length;
    const avgScore = totalQuizzes > 0
      ? Math.round(quizAttempts.reduce((a, q) => a + q.score, 0) / totalQuizzes)
      : 0;

    // Weekly activity
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyActivity = await StudyActivity.find({
      userId,
      date: { $gte: weekAgo.toISOString().split('T')[0] },
    }).sort('date');

    res.json({
      xp: user?.xp || 0,
      streak: user?.streak || 0,
      level: user?.level || 'beginner',
      totalLessons: lessonsDone,
      activeRoadmaps: roadmaps.filter((r) => r.status === 'active').length,
      completedRoadmaps: roadmaps.filter((r) => r.status === 'completed').length,
      roadmaps,
      quizAccuracy: avgScore,
      totalQuizzes,
      achievements,
      weeklyActivity,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// GET /api/progress/activity
router.get('/activity', auth, async (req: AuthRequest, res: Response) => {
  try {
    const days = 30;
    const start = new Date();
    start.setDate(start.getDate() - days);
    const activity = await StudyActivity.find({
      userId: req.user!.id,
      date: { $gte: start.toISOString().split('T')[0] },
    }).sort('date');
    res.json({ activity });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

export default router;

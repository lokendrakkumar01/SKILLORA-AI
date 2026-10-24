import { Router, Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import User from '../models/User';
import Achievement from '../models/Achievement';

const router = Router();

// GET /api/profile
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    const achievements = await Achievement.find({ userId: req.user!.id }).sort('-earnedAt');
    res.json({ user, achievements });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PATCH /api/profile
router.patch('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const allowed = ['name', 'bio', 'avatar', 'level', 'preferences'];
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// GET /api/achievements
router.get('/achievements', auth, async (req: AuthRequest, res: Response) => {
  try {
    const achievements = await Achievement.find({ userId: req.user!.id }).sort('-earnedAt');
    res.json({ achievements });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

export default router;

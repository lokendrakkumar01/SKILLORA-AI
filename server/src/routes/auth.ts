import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { auth, AuthRequest, generateToken } from '../middleware/auth';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ error: 'Email already registered' });

      const user = await User.create({ name, email, password });
      const token = generateToken(String(user._id), user.email);

      res.status(201).json({ token, user });
    } catch (err: any) {
      console.error('Register error:', err);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Invalid email or password' });

      const valid = await user.comparePassword(password);
      if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

      const token = generateToken(String(user._id), user.email);
      res.json({ token, user });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// POST /api/auth/logout
router.post('/logout', (_, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

export default router;

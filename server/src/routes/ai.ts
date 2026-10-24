import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { auth, AuthRequest } from '../middleware/auth';
import * as aiService from '../services/aiService';

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: { error: 'Too many AI requests. Please wait before trying again.' },
});

// POST /api/ai/chat
router.post('/chat', auth, aiLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { message, context = {}, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await aiService.chatWithTutor(message, context, history);
    res.json({ response, isAI: !!process.env.AI_API_KEY });
  } catch (err) {
    res.status(500).json({ error: 'AI tutor unavailable. Please try again.' });
  }
});

// POST /api/ai/explain
router.post('/explain', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { question, userAnswer, correctAnswer } = req.body;
    const explanation = await aiService.generateQuizExplanation(question, userAnswer, correctAnswer);
    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ error: 'Could not generate explanation' });
  }
});

export default router;

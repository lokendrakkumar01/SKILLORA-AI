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
    const { message, context = {}, history = [] } = req.body ?? {};
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Enter a question for the AI tutor.' });
    }
    if (message.length > 4_000) {
      return res.status(400).json({ error: 'Please keep questions under 4,000 characters.' });
    }
    if (!aiService.isConfigured()) {
      return res.status(503).json({ error: 'The AI tutor is not configured. Add GEMINI_API_KEY to the server environment.' });
    }

    const safeHistory = Array.isArray(history)
      ? history.filter((item: any) =>
          item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string'
        ).slice(-12)
      : [];
    const safeContext = context && typeof context === 'object' ? {
      goal: typeof context.goal === 'string' ? context.goal.slice(0, 300) : undefined,
      lesson: typeof context.lesson === 'string' ? context.lesson.slice(0, 300) : undefined,
      level: typeof context.level === 'string' ? context.level.slice(0, 80) : undefined,
      content: typeof context.content === 'string' ? context.content.slice(0, 5_000) : undefined,
      examples: typeof context.examples === 'string' ? context.examples.slice(0, 2_000) : undefined,
      exercises: typeof context.exercises === 'string' ? context.exercises.slice(0, 2_000) : undefined,
    } : {};

    const response = await aiService.chatWithTutor(message, safeContext, safeHistory);
    if (!response) {
      return res.status(502).json({ error: 'The AI tutor could not generate a reply. Please try again in a moment.' });
    }
    res.json({ response, isAI: true });
  } catch (err) {
    console.error('AI tutor route error:', err);
    res.status(500).json({ error: 'The AI tutor is temporarily unavailable. Please try again.' });
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

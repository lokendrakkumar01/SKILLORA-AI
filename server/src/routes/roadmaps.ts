import { Router, Response } from 'express';
import { auth, AuthRequest } from '../middleware/auth';
import Roadmap from '../models/Roadmap';
import * as aiService from '../services/aiService';

const router = Router();

// POST /api/roadmaps — Generate + save roadmap
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { goal, level, dailyMinutes, targetDays, preferredFormat, desiredOutcome } = req.body;

    if (!goal) return res.status(400).json({ error: 'Learning goal is required' });

    // Try AI generation
    let aiData = await aiService.generateRoadmap(
      goal, level || 'beginner',
      dailyMinutes || 60, targetDays || 30,
      preferredFormat || 'mixed', desiredOutcome || ''
    );

    // Fallback if AI unavailable
    if (!aiData) {
      aiData = getFallbackRoadmap(goal, level || 'beginner');
    }

    // Set first step as available
    if (aiData.phases?.[0]?.modules?.[0]?.steps?.[0]) {
      aiData.phases[0].modules[0].steps[0].status = 'available';
    }

    const roadmap = await Roadmap.create({
      userId: req.user!.id,
      title: aiData.title || `${goal} — Learning Path`,
      description: aiData.description || '',
      goal,
      level: level || 'beginner',
      estimatedDays: targetDays || 30,
      dailyMinutes: dailyMinutes || 60,
      preferredFormat: preferredFormat || 'mixed',
      desiredOutcome: desiredOutcome || '',
      phases: aiData.phases || [],
      tags: aiData.tags || [],
    });

    res.status(201).json({ roadmap });
  } catch (err: any) {
    console.error('Create roadmap error:', err);
    res.status(500).json({ error: 'Failed to create roadmap' });
  }
});

// GET /api/roadmaps
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user!.id })
      .select('title goal level status completionPercentage estimatedDays createdAt tags')
      .sort('-createdAt');
    res.json({ roadmaps });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
});

// GET /api/roadmaps/:id
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const roadmap = await Roadmap.findOne({ _id: req.params.id, userId: req.user!.id });
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
    res.json({ roadmap });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
});

// PATCH /api/roadmaps/:id
router.patch('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const roadmap = await Roadmap.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      { $set: req.body },
      { new: true }
    );
    if (!roadmap) return res.status(404).json({ error: 'Roadmap not found' });
    res.json({ roadmap });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update roadmap' });
  }
});

function getFallbackRoadmap(goal: string, level: string) {
  return {
    title: `${goal} — Complete Learning Path`,
    description: `A structured ${level} roadmap for ${goal}`,
    tags: [goal.split(' ')[0], level],
    phases: [
      {
        title: 'Foundation',
        description: 'Build core fundamentals',
        order: 1,
        modules: [
          {
            title: 'Getting Started',
            description: 'Introduction and setup',
            order: 1,
            estimatedHours: 3,
            steps: [
              {
                title: `Introduction to ${goal}`,
                description: 'Learn the basics and set up your environment',
                content: `Welcome to your ${goal} journey! In this lesson, we'll cover the fundamental concepts you need to get started.\n\nThis is an automatically generated lesson. As you progress, the AI tutor will help you dive deeper into each topic with personalized explanations and examples.\n\nKey concepts we'll cover:\n• Core principles and terminology\n• Setting up your learning environment\n• Understanding the big picture`,
                examples: `Example 1: A simple "Hello World" to verify your setup\nExample 2: Understanding the basic workflow`,
                exercises: `1. Set up your environment following the guide\n2. Complete the introductory exercise\n3. Explore the provided resources`,
                estimatedMinutes: 25,
                order: 1,
                status: 'available',
                xpReward: 50,
                quizQuestions: [
                  {
                    question: `What is the primary goal when starting to learn ${goal}?`,
                    options: ['Memorize everything', 'Build a strong foundation', 'Skip basics', 'Only watch videos'],
                    correct: 1,
                    explanation: 'Building a strong foundation is essential for long-term success in any learning journey.',
                  },
                ],
              },
              {
                title: 'Core Concepts',
                description: 'Master the essential building blocks',
                content: `Now that you have the basics, let's dive into the core concepts of ${goal}.\n\nThis lesson explores the fundamental building blocks that everything else is built upon. Understanding these well will make advanced topics much easier.`,
                examples: 'Practical code examples and real-world scenarios will be covered here.',
                exercises: 'Apply what you learned with hands-on exercises.',
                estimatedMinutes: 30,
                order: 2,
                status: 'locked',
                xpReward: 75,
                quizQuestions: [
                  {
                    question: 'Which approach is best for learning new concepts?',
                    options: ['Passive reading only', 'Active practice and application', 'Avoiding mistakes', 'Speed-running material'],
                    correct: 1,
                    explanation: 'Active practice and application solidifies understanding far better than passive learning.',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Intermediate Skills',
        description: 'Level up your abilities',
        order: 2,
        modules: [
          {
            title: 'Practical Application',
            description: 'Apply skills to real projects',
            order: 1,
            estimatedHours: 5,
            steps: [
              {
                title: 'First Project',
                description: 'Build your first real project',
                content: `Time to apply what you've learned! Building a real project is the best way to consolidate your knowledge of ${goal}.\n\nIn this lesson, we'll guide you through creating your first meaningful project from start to finish.`,
                examples: 'Step-by-step project walkthrough with explanations.',
                exercises: 'Complete the project following the guidelines.',
                estimatedMinutes: 45,
                order: 1,
                status: 'locked',
                xpReward: 100,
                quizQuestions: [
                  {
                    question: 'What is the best way to learn programming?',
                    options: ['Only reading books', 'Building real projects', 'Watching videos passively', 'Memorizing syntax'],
                    correct: 1,
                    explanation: 'Building real projects gives you hands-on experience and reveals practical challenges.',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

export default router;

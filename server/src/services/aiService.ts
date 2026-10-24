import fetch from 'node-fetch';

const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_MODEL = process.env.AI_MODEL || 'gpt-3.5-turbo';
const AI_BASE_URL = 'https://api.openai.com/v1/chat/completions';

async function callAI(messages: any[], maxTokens = 2000): Promise<string | null> {
  if (!AI_API_KEY) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(AI_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({ model: AI_MODEL, messages, max_tokens: maxTokens, temperature: 0.7 }),
      signal: controller.signal as any,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.error('AI API error:', res.status, await res.text());
      return null;
    }
    const data: any = await res.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('AI call failed:', err);
    return null;
  }
}

export async function generateRoadmap(
  goal: string,
  level: string,
  dailyMinutes: number,
  targetDays: number,
  format: string,
  outcome: string
): Promise<any | null> {
  const prompt = `Generate a complete learning roadmap as valid JSON for this learner:
Goal: ${goal}
Level: ${level}
Daily time: ${dailyMinutes} minutes
Target: ${targetDays} days
Preferred format: ${format}
Desired outcome: ${outcome}

Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "title": "string",
  "description": "string",
  "tags": ["string"],
  "phases": [
    {
      "title": "string",
      "description": "string",
      "order": 1,
      "modules": [
        {
          "title": "string",
          "description": "string",
          "order": 1,
          "estimatedHours": 2,
          "steps": [
            {
              "title": "string",
              "description": "string",
              "content": "Detailed lesson content here (2-3 paragraphs)",
              "examples": "Practical examples here",
              "exercises": "Practice exercises here",
              "estimatedMinutes": 20,
              "order": 1,
              "quizQuestions": [
                {
                  "question": "string",
                  "options": ["A", "B", "C", "D"],
                  "correct": 0,
                  "explanation": "string"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

Make it practical, progressive, and appropriate for the level and timeline. Include 2-4 phases, 2-3 modules per phase, 2-3 steps per module.`;

  const raw = await callAI(
    [{ role: 'user', content: prompt }],
    3000
  );
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.error('Failed to parse AI roadmap JSON');
    return null;
  }
}

export async function chatWithTutor(
  message: string,
  context: { goal?: string; lesson?: string; level?: string },
  history: { role: string; content: string }[] = []
): Promise<string> {
  const systemPrompt = `You are SKILLORA AI Tutor, an expert, encouraging learning assistant. 
Current context: Learning goal: "${context.goal || 'general learning'}", Lesson: "${context.lesson || 'general'}", Level: "${context.level || 'beginner'}".
Be concise, clear, and helpful. Adapt explanations to the learner's level. Use examples. Be encouraging.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6),
    { role: 'user', content: message },
  ];

  const response = await callAI(messages, 600);
  return response || "I'm having trouble connecting right now. Try rephrasing your question, or check out the lesson content for guidance. I'll be back online shortly!";
}

export async function generateQuizExplanation(
  question: string,
  userAnswer: string,
  correctAnswer: string
): Promise<string> {
  const prompt = `A learner answered a quiz question incorrectly.
Question: ${question}
Their answer: ${userAnswer}
Correct answer: ${correctAnswer}
Give a brief, helpful explanation (2-3 sentences) of why the correct answer is right.`;

  const response = await callAI([{ role: 'user', content: prompt }], 200);
  return response || `The correct answer is "${correctAnswer}". Review the lesson content for more details on this topic.`;
}

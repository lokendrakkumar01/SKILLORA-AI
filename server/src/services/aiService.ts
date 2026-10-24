import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI | null {
  if (!GEMINI_API_KEY) return null;
  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

async function callGemini(prompt: string): Promise<string | null> {
  const ai = getGenAI();
  if (!ai) {
    console.warn('GEMINI_API_KEY not set — AI features unavailable');
    return null;
  }
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text() || null;
  } catch (err) {
    console.error('Gemini AI call failed:', err);
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

  const raw = await callGemini(prompt);
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
  const recentHistory = history.slice(-6).map(h => `${h.role === 'user' ? 'Student' : 'Tutor'}: ${h.content}`).join('\n');

  const prompt = `You are SKILLORA AI Tutor, an expert, encouraging learning assistant.
Current context: Learning goal: "${context.goal || 'general learning'}", Lesson: "${context.lesson || 'general'}", Level: "${context.level || 'beginner'}".
Be concise, clear, and helpful. Adapt explanations to the learner's level. Use examples. Be encouraging.

${recentHistory ? `Conversation history:\n${recentHistory}\n` : ''}
Student: ${message}
Tutor:`;

  const response = await callGemini(prompt);
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

  const response = await callGemini(prompt);
  return response || `The correct answer is "${correctAnswer}". Review the lesson content for more details on this topic.`;
}

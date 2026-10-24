import { GoogleGenAI } from '@google/genai';

const DEFAULT_MODEL = 'gemini-3.8-flash';
const MAX_HISTORY_ITEMS = 12;
const MAX_HISTORY_CHARS = 2_000;

let cachedClient: { apiKey: string; client: GoogleGenAI } | null = null;

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  if (!cachedClient || cachedClient.apiKey !== apiKey) {
    cachedClient = { apiKey, client: new GoogleGenAI({ apiKey }) };
  }
  return cachedClient.client;
}

function getModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export function isConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export type PracticeQuestion = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

/** Generate a validated, exactly ten-question multiple choice practice quiz. */
export async function generatePracticeQuiz(topic: string, level: string): Promise<PracticeQuestion[]> {
  const client = getClient();
  if (!client) throw new Error('AI_NOT_CONFIGURED');

  const prompt = `Create exactly 10 original multiple-choice learning quiz questions.
Topic: ${topic}
Learner level: ${level}
Return ONLY JSON in this shape: {"questions":[{"question":"...","options":["...","...","...","..."],"correct":0,"explanation":"..."}]}
Every question must have exactly four distinct plausible options. correct must be the zero-based index of the single correct option. Explanations should briefly teach why it is correct. Keep questions relevant, clear, and appropriate to the stated level.`;
  const preferredModel = getModel();
  const models = [...new Set([preferredModel, DEFAULT_MODEL, 'gemini-3.6-flash'])];
  let lastError: unknown;

  for (let index = 0; index < models.length; index++) {
    try {
      const response = await client.models.generateContent({
        model: models[index],
        contents: prompt,
        config: { responseMimeType: 'application/json', maxOutputTokens: 4_000 },
      });
      const raw = response.text?.trim();
      if (!raw) throw new Error('AI returned an empty quiz. Please try again.');
      const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      const parsed = JSON.parse(cleaned);
      const questions = Array.isArray(parsed) ? parsed : parsed?.questions;
      if (!Array.isArray(questions) || questions.length !== 10) {
        throw new Error('AI did not return exactly 10 questions. Please generate the quiz again.');
      }
      return questions.map((item: any, questionIndex: number) => {
        if (!item || typeof item.question !== 'string' || !item.question.trim() ||
            !Array.isArray(item.options) || item.options.length !== 4 ||
            item.options.some((option: unknown) => typeof option !== 'string' || !option.trim()) ||
            new Set(item.options.map((option: string) => option.trim().toLowerCase())).size !== 4 ||
            !Number.isInteger(item.correct) || item.correct < 0 || item.correct > 3 ||
            typeof item.explanation !== 'string' || !item.explanation.trim()) {
          throw new Error(`AI returned an invalid question ${questionIndex + 1}. Please generate the quiz again.`);
        }
        return { question: item.question.trim(), options: item.options.map((option: string) => option.trim()), correct: item.correct, explanation: item.explanation.trim() };
      });
    } catch (error) {
      const providerError = error as { status?: number; code?: number | string; message?: string };
      const details = providerError.message || '';
      const unavailable = providerError.status === 404 || providerError.code === 404 ||
        /model.{0,40}(not found|not available|unsupported|does not exist)|unsupported.{0,30}model/i.test(details);
      if (unavailable && index < models.length - 1) continue;
      lastError = error;
      break;
    }
  }
  throw lastError || new Error('AI could not generate the quiz. Please try again.');
}

async function generateText(
  prompt: string,
  config?: { systemInstruction?: string; responseMimeType?: string; maxOutputTokens?: number }
): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const response = await client.models.generateContent({
      model: getModel(),
      contents: prompt,
      config,
    });
    return response.text?.trim() || null;
  } catch (error) {
    console.error('Gemini request failed:', error instanceof Error ? error.message : 'Unknown provider error');
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

Return only JSON with this structure:
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
              "content": "Detailed lesson content in 2-3 paragraphs",
              "examples": "Practical examples",
              "exercises": "Practice exercises",
              "estimatedMinutes": 20,
              "order": 1,
              "quizQuestions": [
                { "question": "string", "options": ["A", "B", "C", "D"], "correct": 0, "explanation": "string" }
              ]
            }
          ]
        }
      ]
    }
  ]
}

Make the curriculum practical, progressive, and appropriate for the learner's level and timeline. Include 2-4 phases, 2-3 modules per phase, and 2-3 lessons per module.`;

  const raw = await generateText(prompt, { responseMimeType: 'application/json', maxOutputTokens: 8_000 });
  if (!raw) return null;

  try {
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.error('Gemini returned invalid roadmap JSON');
    return null;
  }
}

type TutorContext = {
  goal?: string;
  lesson?: string;
  level?: string;
  content?: string;
  examples?: string;
  exercises?: string;
};

type TutorHistoryItem = { role: string; content: string };

function normalizeHistory(history: TutorHistoryItem[]) {
  const normalized: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  for (const item of history.slice(-MAX_HISTORY_ITEMS)) {
    const text = typeof item?.content === 'string' ? item.content.trim().slice(0, MAX_HISTORY_CHARS) : '';
    if (!text || (item.role !== 'user' && item.role !== 'assistant' && item.role !== 'model')) continue;

    const role = item.role === 'user' ? 'user' : 'model';
    const previous = normalized[normalized.length - 1];
    if (previous?.role === role) {
      previous.parts[0].text = `${previous.parts[0].text}\n${text}`;
    } else {
      normalized.push({ role, parts: [{ text }] });
    }
  }

  if (normalized[0]?.role === 'model') normalized.shift();
  return normalized;
}

export async function chatWithTutor(
  message: string,
  context: TutorContext = {},
  history: TutorHistoryItem[] = []
): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  const systemInstruction = `You are SKILLORA AI Tutor, a patient and encouraging learning assistant. Give accurate, clear explanations at the learner's level. Reply in the same language the learner uses, including Hindi or Hinglish when appropriate. Use examples from their lesson when useful. Prefer concise answers, but explain enough for the learner to understand. Ask a short follow-up question when that would help them practice.

Learning goal: ${context.goal || 'General learning'}
Current lesson: ${context.lesson || 'General'}
Learner level: ${context.level || 'beginner'}

Lesson content (reference material):
${context.content || 'No lesson content supplied.'}

Lesson examples:
${context.examples || 'None supplied.'}

Lesson exercises:
${context.exercises || 'None supplied.'}`;

  const preferredModel = getModel();
  const models = [...new Set([preferredModel, DEFAULT_MODEL, 'gemini-3.6-flash'])];
  for (let index = 0; index < models.length; index++) {
    try {
      const chat = client.chats.create({
        model: models[index],
        config: { systemInstruction, maxOutputTokens: 1_000 },
        history: normalizeHistory(history),
      });
      const response = await chat.sendMessage({ message: message.trim() });
      if (response.text?.trim()) return response.text.trim();
      return null;
    } catch (error) {
      const providerError = error as { status?: number; code?: number | string; message?: string };
      const details = providerError.message || '';
      const modelUnavailable = providerError.status === 404 || providerError.code === 404 ||
        /model.{0,40}(not found|not available|unsupported|does not exist)|unsupported.{0,30}model/i.test(details);
      if (modelUnavailable && index < models.length - 1) {
        console.warn(`Gemini model ${models[index]} unavailable; trying fallback model.`);
        continue;
      }
      console.error('Gemini tutor request failed:', providerError.status || providerError.code || 'unknown status', details.slice(0, 500));
      throw error;
    }
  }
  return null;
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

  const response = await generateText(prompt, { maxOutputTokens: 300 });
  return response || `The correct answer is "${correctAnswer}". Review the lesson content for more details on this topic.`;
}

import { apiClient } from './client';

export const roadmapsApi = {
  create: (data: any) => apiClient.post('/roadmaps', data),
  list: () => apiClient.get('/roadmaps'),
  get: (id: string) => apiClient.get(`/roadmaps/${id}`),
  update: (id: string, data: any) => apiClient.patch(`/roadmaps/${id}`, data),
};

export const lessonsApi = {
  get: (stepId: string, roadmapId: string) => apiClient.get(`/lessons/${stepId}?roadmapId=${roadmapId}`),
  complete: (stepId: string, data: { roadmapId: string; timeSpentMinutes?: number }) =>
    apiClient.post(`/lessons/${stepId}/complete`, data),
};

export const quizzesApi = {
  list: () => apiClient.get('/quizzes'),
  submit: (stepId: string, data: { roadmapId: string; answers: number[] }) =>
    apiClient.post(`/quizzes/${stepId}/submit`, data),
};

export const progressApi = {
  overview: () => apiClient.get('/progress/overview'),
  activity: () => apiClient.get('/progress/activity'),
  leaderboard: (page = 1) => apiClient.get(`/progress/leaderboard?page=${page}`),
};

export const aiApi = {
  chat: (message: string, context?: any, history?: any[]) =>
    apiClient.post('/ai/chat', { message, context, history }, { timeout: 60000 }),
  generateQuiz: (topic: string, level: string) =>
    apiClient.post('/ai/quiz', { topic, level }, { timeout: 90000 }),
};

export const profileApi = {
  get: () => apiClient.get('/profile'),
  update: (data: any) => apiClient.patch('/profile', data),
};

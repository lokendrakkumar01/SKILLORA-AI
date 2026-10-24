import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, CheckCircle2, BookOpen, Clock, Zap, Send,
  Brain, MessageCircle, ChevronRight, HelpCircle, X
} from 'lucide-react';
import { lessonsApi, aiApi } from '../api/roadmaps';
import { ProtectedLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface ChatMsg { role: 'user' | 'assistant'; content: string; error?: boolean; retryContent?: string }
interface RoadmapContext { goal?: string; level?: string }

export default function LessonPage() {
  const { roadmapId, stepId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<any>(null);
  const [roadmapContext, setRoadmapContext] = useState<RoadmapContext>({});
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mobileChatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roadmapId || !stepId) return;
    lessonsApi.get(stepId, roadmapId)
      .then((res) => {
        setStep(res.data.step);
        setRoadmapContext(res.data.roadmapContext || {});
      })
      .catch(() => { toast.error('Failed to load lesson'); navigate(-1); })
      .finally(() => setLoading(false));
  }, [roadmapId, stepId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    mobileChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleComplete = async () => {
    if (!roadmapId || !stepId) return;
    setCompleting(true);
    try {
      const res = await lessonsApi.complete(stepId, { roadmapId });
      toast.success(`✅ Lesson complete! +${res.data.xpEarned} XP`);
      if (res.data.newAchievements?.length) {
        res.data.newAchievements.forEach((a: string) => toast.success(`🏆 Achievement: ${a}!`));
      }
      navigate(`/roadmap/${roadmapId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to complete');
    } finally {
      setCompleting(false);
    }
  };

  const sendChat = async (retryMessage?: string, retryAtIndex?: number) => {
    const msg = (retryMessage ?? chatInput).trim();
    if (!msg || chatLoading || !step) return;
    const history = chatHistory.filter((item, index) => {
      if (item.error || chatHistory[index + 1]?.error) return false;
      if (typeof retryAtIndex === 'number' && (index === retryAtIndex || index === retryAtIndex - 1)) return false;
      return true;
    });
    setChatInput('');
    const newHistory: ChatMsg[] = [...history, { role: 'user', content: msg }];
    setChatHistory(newHistory);
    setChatLoading(true);
    try {
      const res = await aiApi.chat(msg, {
        ...roadmapContext,
        lesson: step?.title,
        content: step?.content,
        examples: step?.examples,
        exercises: step?.exercises,
      }, history);
      if (typeof res.data.response !== 'string' || !res.data.response.trim()) {
        throw new Error('The AI tutor returned an empty reply. Please try again.');
      }
      setChatHistory([...newHistory, { role: 'assistant', content: res.data.response }]);
    } catch (error: any) {
      const message = error.response?.data?.error || 'The AI tutor could not reply. Check your connection and try again.';
      setChatInput(msg);
      setChatHistory([...newHistory, { role: 'assistant', content: message, error: true, retryContent: msg }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return (
    <ProtectedLayout title="Lesson">
      <div className="flex items-center justify-center h-96"><LoadingSpinner size="lg" /></div>
    </ProtectedLayout>
  );

  if (!step) return null;

  const hasQuiz = step.quizQuestions?.length > 0;

  return (
    <ProtectedLayout title={step.title}>
      <div className="max-w-6xl mx-auto flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Breadcrumb */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={() => navigate(`/roadmap/${roadmapId}`)} className="hover:text-violet-400 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Roadmap
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300">{step.title}</span>
          </motion.div>

          {/* Title card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#111118] to-[#0D0D18]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">{step.title}</h1>
                <p className="text-sm text-slate-400 mt-2">{step.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="dark" icon={<Clock className="w-3 h-3" />}>{step.estimatedMinutes}m</Badge>
                <Badge variant="violet" icon={<Zap className="w-3 h-3" />}>+{step.xpReward || 50} XP</Badge>
              </div>
            </div>
          </motion.div>

          {/* Lesson content */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl border border-white/[0.06] bg-[#0D0D18]">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <h2 className="text-base font-bold text-white">Lesson Content</h2>
            </div>
            <div className="prose-custom whitespace-pre-wrap text-sm">
              {step.content || 'Lesson content will be loaded here. Use the AI tutor for explanations!'}
            </div>
          </motion.div>

          {/* Examples */}
          {step.examples && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="p-6 rounded-2xl border border-blue-500/15 bg-blue-500/5">
              <h3 className="text-sm font-bold text-blue-300 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Examples
              </h3>
              <div className="text-sm text-slate-300 whitespace-pre-wrap">{step.examples}</div>
            </motion.div>
          )}

          {/* Exercises */}
          {step.exercises && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-emerald-500/15 bg-emerald-500/5">
              <h3 className="text-sm font-bold text-emerald-300 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Practice Exercises
              </h3>
              <div className="text-sm text-slate-300 whitespace-pre-wrap">{step.exercises}</div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row items-center gap-4">
            {hasQuiz && (
              <Button variant="secondary" size="lg"
                onClick={() => navigate(`/quiz/${roadmapId}/${stepId}`)}
                icon={<HelpCircle className="w-4 h-4" />}>
                Take Quiz ({step.quizQuestions.length} questions)
              </Button>
            )}
            {step.status !== 'completed' ? (
              <Button variant="primary" size="lg" loading={completing} onClick={handleComplete}
                className="animate-pulse-glow"
                icon={<CheckCircle2 className="w-4 h-4" />}>
                Complete Lesson & Earn XP
              </Button>
            ) : (
              <Badge variant="green" size="md">✅ Lesson Completed</Badge>
            )}
          </motion.div>

          <div className="flex justify-between pt-4 border-t border-white/[0.06]">
            <Button variant="ghost" onClick={() => navigate(`/roadmap/${roadmapId}`)} icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Roadmap
            </Button>
          </div>
        </div>

        {/* AI Tutor Panel — Desktop */}
        <div className="hidden xl:block w-80 shrink-0">
          <div className="sticky top-6 rounded-2xl border border-white/[0.06] bg-[#0D0D18] overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-white">AI Tutor</span>
              <Badge variant="violet" size="sm" className="ml-auto">Lesson-aware</Badge>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {chatHistory.length === 0 && (
                <div className="text-center py-6">
                  <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Ask anything about this lesson!</p>
                  <div className="mt-3 space-y-1.5">
                    {['Explain this simply', 'Give me an example', 'Practice question'].map((q) => (
                      <button key={q} onClick={() => { setChatInput(q); }}
                        className="w-full text-xs px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-all text-left">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-2'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0 mt-1">
                      <Brain className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-violet-500/20 border border-violet-500/30 text-slate-200 rounded-tr-sm'
                      : msg.error
                        ? 'bg-rose-500/[0.08] border border-rose-400/20 text-rose-200 rounded-tl-sm'
                        : 'bg-[#1A1A2E] border border-white/[0.06] text-slate-300 rounded-tl-sm'
                  }`}>
                    {msg.content}
                    {msg.error && (
                      <button type="button" onClick={() => sendChat(msg.retryContent, chatHistory.indexOf(msg))}
                        className="mt-2 flex items-center gap-1.5 font-semibold text-rose-200 underline underline-offset-2 hover:text-white">
                        <ArrowRight className="h-3 w-3" /> Try again
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                  <div className="shimmer rounded-2xl rounded-tl-sm px-4 py-3 w-32 h-8 bg-[#1A1A2E]" />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-white/[0.06]">
              <div className="flex gap-2">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                  maxLength={4000}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendChat())}
                  placeholder="Ask about this lesson..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#111118] border border-white/[0.08] text-slate-200 text-xs outline-none focus:border-violet-500" />
                <button aria-label="Send question to AI tutor" onClick={() => sendChat()} disabled={chatLoading || !chatInput.trim()}
                  className="w-9 h-9 shrink-0 rounded-xl bg-violet-600 flex items-center justify-center text-white hover:bg-violet-500 disabled:opacity-40 transition-all">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tutor FAB */}
        <button onClick={() => setTutorOpen(!tutorOpen)}
          className="xl:hidden fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-5 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-950/30 z-40 hover:scale-105 transition-transform">
          {tutorOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </button>

        {/* Mobile Tutor Sheet */}
        {tutorOpen && (
          <div className="xl:hidden fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 bg-[#0D0D18] border border-white/[0.08] rounded-t-3xl p-4 shadow-2xl" style={{ maxHeight: '60vh' }}>
            <div className="overflow-y-auto space-y-3 mb-3" style={{ maxHeight: 'calc(60vh - 92px)' }}>
              {chatHistory.length === 0 && (
                <div className="px-1 py-2">
                  <p className="text-xs leading-relaxed text-slate-400">Ask about this lesson. The tutor can use the lesson text, examples, and exercises to tailor its answer.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['Explain this simply', 'Give me an example', 'Practice question'].map((question) => (
                      <button key={question} type="button" onClick={() => setChatInput(question)}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-slate-300 hover:border-violet-400/30 hover:text-violet-200">
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-2'}`}>
                  {msg.role === 'assistant' && <Brain className="w-5 h-5 text-violet-400 shrink-0 mt-1" />}
                  <div className={`rounded-2xl px-3 py-2 max-w-[85%] text-xs leading-relaxed ${msg.role === 'user' ? 'bg-violet-500/20 text-slate-200' : msg.error ? 'bg-rose-500/[0.08] border border-rose-400/20 text-rose-200' : 'bg-[#1A1A2E] text-slate-300'}`}>
                    {msg.content}
                    {msg.error && (
                      <button type="button" onClick={() => sendChat(msg.retryContent, chatHistory.indexOf(msg))}
                        className="mt-2 flex items-center gap-1.5 font-semibold text-rose-200 underline underline-offset-2 hover:text-white">
                        <ArrowRight className="h-3 w-3" /> Try again
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && <div className="shimmer h-8 w-36 rounded-2xl" aria-label="AI tutor is thinking" />}
              <div ref={mobileChatEndRef} />
            </div>
            <div className="flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                maxLength={4000}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendChat())}
                placeholder="Ask the AI tutor..."
                className="flex-1 px-3 py-2.5 rounded-xl bg-[#111118] border border-white/[0.08] text-slate-200 text-sm outline-none focus:border-violet-500" />
              <button aria-label="Send question to AI tutor" onClick={() => sendChat()} disabled={chatLoading || !chatInput.trim()}
                className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}

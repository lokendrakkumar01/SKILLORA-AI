import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Trophy, RotateCcw, Brain, Zap } from 'lucide-react';
import { roadmapsApi, quizzesApi } from '../api/roadmaps';
import { ProtectedLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const { roadmapId, stepId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    if (!roadmapId || !stepId) return;
    roadmapsApi.get(roadmapId).then((res) => {
      const rm = res.data.roadmap;
      for (const p of rm.phases) {
        for (const m of p.modules) {
          for (const s of m.steps) {
            if (String(s._id) === stepId && s.quizQuestions?.length) {
              setQuestions(s.quizQuestions);
              setAnswers(new Array(s.quizQuestions.length).fill(null));
            }
          }
        }
      }
    }).catch(() => navigate(-1))
      .finally(() => setLoading(false));
  }, [roadmapId, stepId]);

  const selectAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
  };

  const confirmAnswer = () => {
    if (selected === null) return;
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    setAnswered(true);
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    try {
      const res = await quizzesApi.submit(stepId!, { roadmapId: roadmapId!, answers: answers as number[] });
      setResult(res.data);
      setShowResult(true);
      if (res.data.xpEarned > 0) toast.success(`🎉 +${res.data.xpEarned} XP earned!`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <ProtectedLayout title="Quiz">
      <div className="flex items-center justify-center h-96"><LoadingSpinner size="lg" /></div>
    </ProtectedLayout>
  );

  if (!questions.length) return (
    <ProtectedLayout title="Quiz">
      <div className="max-w-2xl mx-auto text-center py-20">
        <Brain className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No quiz available</h2>
        <p className="text-slate-400 text-sm mb-6">This lesson doesn't have quiz questions yet.</p>
        <Button variant="primary" onClick={() => navigate(`/lesson/${roadmapId}/${stepId}`)}>
          Back to Lesson
        </Button>
      </div>
    </ProtectedLayout>
  );

  // Result screen
  if (showResult && result) {
    const passed = result.passed;
    return (
      <ProtectedLayout title="Quiz Results">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-2xl border border-white/[0.06] bg-[#0D0D18] text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${passed ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
              {passed ? <Trophy className="w-10 h-10 text-emerald-400" /> : <RotateCcw className="w-10 h-10 text-amber-400" />}
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-2">
              {passed ? '🎉 Quiz Passed!' : '📚 Keep Practicing!'}
            </h2>
            <p className="text-slate-400 mb-6">
              {passed ? 'Excellent work! You nailed it.' : 'Review the lesson and try again.'}
            </p>

            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="text-center">
                <div className={`text-4xl font-black ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>{result.score}%</div>
                <div className="text-xs text-slate-400 mt-1">Score</div>
              </div>
              <div className="w-px h-12 bg-white/[0.06]" />
              <div className="text-center">
                <div className="text-4xl font-black text-white">{result.correct}/{result.total}</div>
                <div className="text-xs text-slate-400 mt-1">Correct</div>
              </div>
              {result.xpEarned > 0 && (
                <>
                  <div className="w-px h-12 bg-white/[0.06]" />
                  <div className="text-center">
                    <div className="text-4xl font-black text-amber-400">+{result.xpEarned}</div>
                    <div className="text-xs text-slate-400 mt-1">XP Earned</div>
                  </div>
                </>
              )}
            </div>

            {/* Detailed results */}
            <div className="space-y-3 mb-8 text-left">
              {result.results?.map((r: any, i: number) => (
                <div key={i} className={`p-4 rounded-xl border ${r.isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                  <div className="flex items-start gap-2 mb-2">
                    {r.isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />}
                    <p className="text-sm text-white font-medium">{r.question}</p>
                  </div>
                  {r.explanation && <p className="text-xs text-slate-400 ml-6">{r.explanation}</p>}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!passed && (
                <Button variant="secondary" onClick={() => { setShowResult(false); setCurrent(0); setSelected(null); setAnswered(false); setAnswers(new Array(questions.length).fill(null)); }}
                  icon={<RotateCcw className="w-4 h-4" />}>
                  Retry Quiz
                </Button>
              )}
              <Button variant="primary" onClick={() => navigate(`/lesson/${roadmapId}/${stepId}`)}
                icon={<ArrowRight className="w-4 h-4" />}>
                Back to Lesson
              </Button>
            </div>
          </motion.div>
        </div>
      </ProtectedLayout>
    );
  }

  // Quiz flow
  const q = questions[current];
  const isCorrect = answered && selected === q.correct;
  const isWrong = answered && selected !== q.correct;

  return (
    <ProtectedLayout title="Quiz">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/lesson/${roadmapId}/${stepId}`)} className="text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full">
            <motion.div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full"
              animate={{ width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%` }} />
          </div>
          <span className="text-xs text-slate-400 font-medium">{current + 1}/{questions.length}</span>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="p-8 rounded-2xl border border-white/[0.06] bg-[#0D0D18]">
            <Badge variant="violet" className="mb-4">Question {current + 1}</Badge>
            <h2 className="text-lg font-bold text-white mb-6">{q.question}</h2>

            <div className="space-y-3">
              {q.options?.map((opt: string, i: number) => {
                let style = 'bg-white/[0.02] border-white/[0.08] hover:border-violet-500/30 cursor-pointer';
                if (selected === i && !answered) style = 'bg-violet-500/15 border-violet-500/40';
                if (answered && i === q.correct) style = 'bg-emerald-500/15 border-emerald-500/40';
                if (answered && selected === i && i !== q.correct) style = 'bg-red-500/10 border-red-500/40';

                return (
                  <motion.button key={i} onClick={() => selectAnswer(i)}
                    whileHover={!answered ? { x: 4 } : undefined}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${style}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      answered && i === q.correct ? 'bg-emerald-500/25 text-emerald-400' :
                      answered && selected === i ? 'bg-red-500/25 text-red-400' :
                      selected === i ? 'bg-violet-500/25 text-violet-400' :
                      'bg-white/5 text-slate-400'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className={`text-sm ${answered && i === q.correct ? 'text-emerald-300 font-medium' : 'text-slate-200'}`}>{opt}</span>
                    {answered && i === q.correct && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />}
                    {answered && selected === i && i !== q.correct && <XCircle className="w-4 h-4 text-red-400 ml-auto" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            {answered && q.explanation && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`mt-5 p-4 rounded-xl border ${isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                <p className={`text-xs font-semibold mb-1 ${isCorrect ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {isCorrect ? '✅ Correct!' : '💡 Explanation:'}
                </p>
                <p className="text-xs text-slate-300">{q.explanation}</p>
              </motion.div>
            )}

            {/* Action */}
            <div className="mt-6 flex justify-end">
              {!answered ? (
                <Button variant="primary" onClick={confirmAnswer} disabled={selected === null}>
                  Confirm Answer
                </Button>
              ) : (
                <Button variant="primary" onClick={nextQuestion} loading={submitting}
                  icon={<ArrowRight className="w-4 h-4" />}>
                  {current < questions.length - 1 ? 'Next Question' : 'See Results'}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </ProtectedLayout>
  );
}

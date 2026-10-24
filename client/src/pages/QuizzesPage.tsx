import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, CircleCheck, Clock3, RotateCcw } from 'lucide-react';
import { quizzesApi } from '../api/roadmaps';
import { ProtectedLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function QuizzesPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    quizzesApi.list().then((res) => setQuizzes(res.data.quizzes || []))
      .catch((err) => setError(err.response?.data?.error || 'Could not load quizzes. Please try again.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  return <ProtectedLayout title="Quizzes">
    <div className="mx-auto max-w-6xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold text-violet-300">Practice and remember</p><h1 className="mt-1 text-3xl font-black text-white">Your quizzes</h1><p className="mt-2 text-sm text-slate-400">Quick checks from lessons in all your learning paths.</p></div>
        <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm text-slate-300"><BookOpenCheck className="h-5 w-5 text-violet-400" />{quizzes.length} practice {quizzes.length === 1 ? 'quiz' : 'quizzes'}</div>
      </div>

      {loading ? <div className="flex h-56 items-center justify-center"><LoadingSpinner size="lg" /></div>
        : error ? <div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 text-sm text-rose-200"><p>{error}</p><Button className="mt-4" variant="outline" size="sm" onClick={load} icon={<RotateCcw className="h-4 w-4" />}>Try again</Button></div>
          : !quizzes.length ? <div className="rounded-3xl border border-dashed border-violet-500/25 bg-white/[.02] px-6 py-14 text-center"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-500/10 text-violet-300"><BookOpenCheck className="h-7 w-7" /></div><h2 className="text-xl font-bold text-white">No quizzes yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">Create a learning path and its lesson checkpoints will show here automatically.</p><Button className="mt-5" variant="primary" onClick={() => navigate('/onboarding')}>Create a learning path<ArrowRight className="ml-2 h-4 w-4" /></Button></div>
            : <div className="grid gap-4 md:grid-cols-2">{quizzes.map((quiz, index) => <motion.article key={`${quiz.roadmapId}-${quiz.stepId}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .04, .3) }} className="flex flex-col rounded-2xl border border-white/[.08] bg-[#12151e] p-5 transition hover:border-violet-400/30">
              <div className="flex items-start justify-between gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-300"><BookOpenCheck className="h-5 w-5" /></div>{quiz.passed ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300"><CircleCheck className="h-3.5 w-3.5" />Passed</span> : quiz.lastScore !== null ? <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">Best {quiz.lastScore}%</span> : <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-400">New</span>}</div>
              <h2 className="mt-4 text-base font-bold text-white">{quiz.title}</h2><p className="mt-1 text-xs text-slate-400">{quiz.roadmapTitle}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><BookOpenCheck className="h-3.5 w-3.5" />{quiz.questionsCount} questions</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />About {Math.max(1, Math.ceil(quiz.questionsCount * .7))} min</span></div>
              <div className="mt-5 border-t border-white/[.06] pt-4"><Button variant={quiz.passed ? 'secondary' : 'primary'} className="w-full justify-center" onClick={() => navigate(`/quiz/${quiz.roadmapId}/${quiz.stepId}`)}>{quiz.passed ? 'Practice again' : quiz.attemptCount ? 'Continue practicing' : 'Start quiz'}<ArrowRight className="ml-2 h-4 w-4" /></Button></div>
            </motion.article>)}</div>}
    </div>
  </ProtectedLayout>;
}

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpenCheck, Check, CircleCheck, Clock3, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { aiApi } from '../api/roadmaps';
import { quizzesApi } from '../api/roadmaps';
import { ProtectedLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

type PracticeQuestion = { question: string; options: string[]; correct: number; explanation: string };

export default function QuizzesPage() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('beginner');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    quizzesApi.list().then((res) => setQuizzes(res.data.quizzes || []))
      .catch((err) => setError(err.response?.data?.error || 'Could not load quizzes. Please try again.'))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const generate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!topic.trim() || generating) return;
    setGenerating(true);
    setGenerateError('');
    setQuestions([]);
    setAnswers([]);
    setCurrent(0);
    setFinished(false);
    try {
      const response = await aiApi.generateQuiz(topic.trim(), level);
      const generated = response.data?.questions;
      if (!Array.isArray(generated) || generated.length !== 10) throw new Error('AI must return exactly 10 questions. Please try generating again.');
      setQuestions(generated);
      setAnswers(Array(10).fill(-1));
    } catch (err: any) {
      setGenerateError(err.response?.data?.error || err.message || 'Could not generate the quiz. Please try again.');
    } finally { setGenerating(false); }
  };

  const score = answers.reduce((total, answer, index) => total + (answer === questions[index]?.correct ? 1 : 0), 0);
  const resetPractice = () => { setQuestions([]); setAnswers([]); setCurrent(0); setFinished(false); setGenerateError(''); };

  return <ProtectedLayout title="Quizzes">
    <div className="mx-auto max-w-6xl space-y-7 pb-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold text-violet-300">Practice and remember</p><h1 className="mt-1 text-3xl font-black text-white">Your quizzes</h1><p className="mt-2 text-sm text-slate-400">Practice from your learning paths or ask AI to build a focused 10-question quiz.</p></div>
        <div className="flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm text-slate-300"><BookOpenCheck className="h-5 w-5 text-violet-400" />{quizzes.length} lesson {quizzes.length === 1 ? 'quiz' : 'quizzes'}</div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-violet-400/15 bg-gradient-to-br from-violet-500/[.10] via-[#12151e] to-cyan-500/[.06] p-5 sm:p-7">
        <div className="mb-5 flex items-start gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-violet-300/15 bg-violet-500/10 text-violet-300"><Sparkles className="h-5 w-5" /></div><div><h2 className="text-lg font-bold text-white">Create an AI practice quiz</h2><p className="mt-1 text-sm leading-6 text-slate-400">Choose any topic and get exactly 10 multiple-choice questions with explanations.</p></div></div>
        {!questions.length ? <form onSubmit={generate} className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px_auto]">
          <label className="sr-only" htmlFor="quiz-topic">Quiz topic</label><input id="quiz-topic" value={topic} onChange={(event) => setTopic(event.target.value.slice(0, 200))} maxLength={200} required placeholder="e.g. JavaScript promises, photosynthesis…" className="min-h-12 min-w-0 rounded-xl border border-white/10 bg-[#0c0e15]/80 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400/50 focus:ring-2 focus:ring-violet-500/10" />
          <label className="sr-only" htmlFor="quiz-level">Difficulty</label><select id="quiz-level" value={level} onChange={(event) => setLevel(event.target.value)} className="min-h-12 rounded-xl border border-white/10 bg-[#0c0e15]/80 px-4 text-sm text-white outline-none focus:border-violet-400/50"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
          <Button type="submit" loading={generating} disabled={!topic.trim()} className="min-h-12" icon={<Sparkles className="h-4 w-4" />}>Generate 10 questions</Button>
        </form> : <div>
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-violet-300">{finished ? 'Quiz complete' : `Question ${current + 1} of 10`}</p><p className="mt-1 text-sm text-slate-400">{topic} · {level}</p></div><div className="h-2 overflow-hidden rounded-full bg-white/10 sm:w-48"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all" style={{ width: `${finished ? 100 : (current / 10) * 100}%` }} /></div></div>
          {finished ? <div className="rounded-2xl border border-white/[.08] bg-[#0c0e15]/70 p-5 sm:p-7"><div className="flex flex-col items-center text-center"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-400/10 text-amber-300"><Trophy className="h-7 w-7" /></div><h3 className="mt-4 text-2xl font-black text-white">{score} / 10 correct</h3><p className="mt-1 text-sm text-slate-400">{score === 10 ? 'Perfect work!' : score >= 7 ? 'Great progress. Review anything you missed.' : 'Keep practicing. The explanations below can help.'}</p></div><div className="mt-6 max-h-[440px] space-y-3 overflow-y-auto">{questions.map((question, index) => <article key={index} className="rounded-xl border border-white/[.07] bg-white/[.02] p-4"><p className="text-sm font-semibold leading-6 text-white">{index + 1}. {question.question}</p><div className="mt-2 flex items-start gap-2 text-xs leading-5"><span className={answers[index] === question.correct ? 'text-emerald-300' : 'text-rose-300'}>{answers[index] === question.correct ? 'Your answer is correct' : `Correct answer: ${question.options[question.correct]}`}</span>{answers[index] !== question.correct && <span className="text-slate-500">· Your answer: {answers[index] < 0 ? 'Not answered' : question.options[answers[index]]}</span>}</div><p className="mt-2 text-sm leading-6 text-slate-400">{question.explanation}</p></article>)}</div><Button className="mt-5 w-full sm:w-auto" onClick={resetPractice} icon={<RotateCcw className="h-4 w-4" />}>Create another quiz</Button></div>
            : <motion.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[.08] bg-[#0c0e15]/70 p-5 sm:p-7"><h3 className="text-lg font-bold leading-7 text-white">{questions[current].question}</h3><div className="mt-5 grid gap-3 sm:grid-cols-2">{questions[current].options.map((option, index) => { const selected = answers[current] === index; return <button key={index} type="button" aria-pressed={selected} onClick={() => setAnswers((old) => old.map((answer, i) => i === current ? index : answer))} className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm leading-5 transition ${selected ? 'border-violet-400/50 bg-violet-500/10 text-white' : 'border-white/[.08] bg-white/[.02] text-slate-300 hover:border-violet-400/25 hover:bg-white/[.04]'}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${selected ? 'bg-violet-500 text-white' : 'bg-white/[.06] text-slate-400'}`}>{String.fromCharCode(65 + index)}</span>{option}{selected && <Check className="ml-auto h-4 w-4 shrink-0 text-violet-300" />}</button>; })}</div><div className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-white/[.07] pt-4 sm:flex-row"><Button variant="secondary" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>Previous</Button><Button disabled={answers[current] < 0} onClick={() => current === 9 ? setFinished(true) : setCurrent((value) => value + 1)}>{current === 9 ? 'See results' : 'Next question'}<ArrowRight className="ml-2 h-4 w-4" /></Button></div></motion.div>}
        </div>}
        {generateError && <p role="alert" className="mt-3 rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-200">{generateError}</p>}
        <p className="mt-4 text-xs text-slate-500">AI-generated practice only · no XP is awarded for these quizzes.</p>
      </section>

      <section><div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-lg font-bold text-white">Lesson quizzes</h2><p className="mt-1 text-sm text-slate-400">Quick checks from lessons in all your learning paths.</p></div></div>
      {loading ? <div className="flex h-40 items-center justify-center"><LoadingSpinner size="lg" /></div>
        : error ? <div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 text-sm text-rose-200"><p>{error}</p><Button className="mt-4" variant="outline" size="sm" onClick={load} icon={<RotateCcw className="h-4 w-4" />}>Try again</Button></div>
          : !quizzes.length ? <div className="rounded-2xl border border-dashed border-white/10 bg-white/[.02] px-6 py-9 text-center"><div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-xl bg-violet-500/10 text-violet-300"><BookOpenCheck className="h-5 w-5" /></div><h3 className="font-bold text-white">No lesson quizzes yet</h3><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-400">Create a learning path and its lesson checkpoints will show here automatically.</p><Button className="mt-4" variant="outline" size="sm" onClick={() => navigate('/onboarding')}>Create a learning path<ArrowRight className="ml-2 h-4 w-4" /></Button></div>
            : <div className="grid gap-4 md:grid-cols-2">{quizzes.map((quiz, index) => <motion.article key={`${quiz.roadmapId}-${quiz.stepId}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * .04, .3) }} className="flex flex-col rounded-2xl border border-white/[.08] bg-[#12151e] p-5 transition hover:border-violet-400/30">
              <div className="flex items-start justify-between gap-3"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-300"><BookOpenCheck className="h-5 w-5" /></div>{quiz.passed ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300"><CircleCheck className="h-3.5 w-3.5" />Passed</span> : quiz.lastScore !== null ? <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">Best {quiz.lastScore}%</span> : <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-400">New</span>}</div>
              <h3 className="mt-4 text-base font-bold text-white">{quiz.title}</h3><p className="mt-1 text-xs text-slate-400">{quiz.roadmapTitle}</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1"><BookOpenCheck className="h-3.5 w-3.5" />{quiz.questionsCount} questions</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />About {Math.max(1, Math.ceil(quiz.questionsCount * .7))} min</span></div>
              <div className="mt-5 border-t border-white/[.06] pt-4"><Button variant={quiz.passed ? 'secondary' : 'primary'} className="w-full justify-center" onClick={() => navigate(`/quiz/${quiz.roadmapId}/${quiz.stepId}`)}>{quiz.passed ? 'Practice again' : quiz.attemptCount ? 'Continue practicing' : 'Start quiz'}<ArrowRight className="ml-2 h-4 w-4" /></Button></div>
            </motion.article>)}</div>}
      </section>
    </div>
  </ProtectedLayout>;
}

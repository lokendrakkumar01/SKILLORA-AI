import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Target, TrendingUp, BookOpen, Brain, MessageCircle, BarChart3,
  Trophy, ArrowRight, ChevronDown, CheckCircle2, Users, Clock,
  PlayCircle, Sparkles, Compass, ShieldCheck, Flame, Laptop, GraduationCap,
  Star, Globe, Lock, Unlock
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/Navbar';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const ROTATING_GOALS = [
  'Full Stack Web Development',
  'AI & Machine Learning',
  'Python for Data Science',
  'Cybersecurity & Ethical Hacking',
  'UI/UX Design System',
  'React Native Mobile Apps',
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Target,
    badge: 'Goal Setup',
    title: 'Enter Your Ambition',
    desc: 'Tell Skillora what you want to master, your time availability, and current skill level.',
    gradient: 'from-violet-600 to-indigo-600',
    glow: 'shadow-violet-500/25',
  },
  {
    step: '02',
    icon: Compass,
    badge: 'AI Generation',
    title: 'Get a Dynamic Roadmap',
    desc: 'Receive a personalized curriculum with phases, modules, lessons, and quiz checkpoints.',
    gradient: 'from-indigo-600 to-blue-600',
    glow: 'shadow-blue-500/25',
  },
  {
    step: '03',
    icon: TrendingUp,
    badge: 'Continuous Growth',
    title: 'Practice & Prove Mastery',
    desc: 'Learn with your AI tutor, take adaptive quizzes, earn XP, and track real progress.',
    gradient: 'from-cyan-600 to-emerald-600',
    glow: 'shadow-emerald-500/25',
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'AI Roadmap Engine',
    desc: 'Generate tailored syllabi with prerequisites, time estimates, and milestone checkpoints for any subject.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    hoverBorder: 'hover:border-violet-500/50',
  },
  {
    icon: BookOpen,
    title: 'Interactive Workspaces',
    desc: 'Clean, distraction-free lessons with structured breakdowns, code snippets, and hands-on exercises.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    hoverBorder: 'hover:border-blue-500/50',
  },
  {
    icon: Brain,
    title: 'Contextual AI Tutor',
    desc: 'Ask questions inside lessons. Get simplified analogies, code breakdowns, and hints without leaving.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/50',
  },
  {
    icon: ShieldCheck,
    title: 'Adaptive Quiz Engine',
    desc: 'Evaluate comprehension with instant feedback, deep answer explanations, and topic-level scoring.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/50',
  },
  {
    icon: BarChart3,
    title: 'Progress Intelligence',
    desc: 'Measure consistency with weekly study charts, streak tracking, and skill mastery percentages.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    hoverBorder: 'hover:border-amber-500/50',
  },
  {
    icon: Trophy,
    title: 'Gamified Milestones',
    desc: 'Level up with earned XP, maintain daily streaks, unlock achievement badges, and celebrate progress.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    hoverBorder: 'hover:border-pink-500/50',
  },
];

const POPULAR_PATHS = [
  {
    title: 'Full Stack Web Development',
    category: 'Software Engineering',
    duration: '90 Days',
    level: 'Beginner → Pro',
    learners: '14.2k',
    icon: Laptop,
    accent: 'violet',
  },
  {
    title: 'Applied Machine Learning',
    category: 'Artificial Intelligence',
    duration: '75 Days',
    level: 'Intermediate',
    learners: '9.8k',
    icon: Brain,
    accent: 'indigo',
  },
  {
    title: 'Python for Data Analytics',
    category: 'Data Science',
    duration: '45 Days',
    level: 'Beginner Friendly',
    learners: '18.1k',
    icon: BarChart3,
    accent: 'blue',
  },
  {
    title: 'Modern UI/UX Design System',
    category: 'Product Design',
    duration: '40 Days',
    level: 'All Levels',
    learners: '8.4k',
    icon: Sparkles,
    accent: 'pink',
  },
  {
    title: 'Cybersecurity Fundamentals',
    category: 'Security & Networks',
    duration: '60 Days',
    level: 'Intermediate',
    learners: '6.7k',
    icon: ShieldCheck,
    accent: 'emerald',
  },
  {
    title: 'Cloud Architecture & DevOps',
    category: 'Infrastructure',
    duration: '60 Days',
    level: 'Intermediate',
    learners: '7.3k',
    icon: Globe,
    accent: 'amber',
  },
];

const ACCENT_MAP: Record<string, { border: string; hoverBorder: string; iconBg: string; iconText: string; tag: string }> = {
  violet: { border: 'border-violet-500/25', hoverBorder: 'hover:border-violet-500/60', iconBg: 'bg-violet-500/15', iconText: 'text-violet-400', tag: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
  indigo: { border: 'border-indigo-500/25', hoverBorder: 'hover:border-indigo-500/60', iconBg: 'bg-indigo-500/15', iconText: 'text-indigo-400', tag: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' },
  blue: { border: 'border-blue-500/25', hoverBorder: 'hover:border-blue-500/60', iconBg: 'bg-blue-500/15', iconText: 'text-blue-400', tag: 'bg-blue-500/10 text-blue-300 border-blue-500/20' },
  pink: { border: 'border-pink-500/25', hoverBorder: 'hover:border-pink-500/60', iconBg: 'bg-pink-500/15', iconText: 'text-pink-400', tag: 'bg-pink-500/10 text-pink-300 border-pink-500/20' },
  emerald: { border: 'border-emerald-500/25', hoverBorder: 'hover:border-emerald-500/60', iconBg: 'bg-emerald-500/15', iconText: 'text-emerald-400', tag: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  amber: { border: 'border-amber-500/25', hoverBorder: 'hover:border-amber-500/60', iconBg: 'bg-amber-500/15', iconText: 'text-amber-400', tag: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
};

const FAQS = [
  {
    q: 'How does Skillora AI customize my learning path?',
    a: "Skillora assesses your specific goal, prior experience level, target timeline, and available daily hours. Using our AI roadmap engine, it structures high-yield modules, exercises, and quizzes calibrated to prevent overwhelm while accelerating comprehension.",
  },
  {
    q: 'What if I get stuck on a difficult concept or exercise?',
    a: "Every lesson features an intelligent AI Tutor side panel. It understands your exact lesson context and can simplify theories into real-world analogies, suggest code fixes, or quiz you on prerequisite knowledge until you feel confident.",
  },
  {
    q: 'Can I regenerate or adapt my roadmap as I progress?',
    a: "Yes! Learning isn't linear. You can adjust your daily time goals, regenerate roadmaps with new requirements, or mark already-known topics as completed to fast-forward through familiar material.",
  },
  {
    q: 'Is Skillora AI suitable for absolute beginners?',
    a: 'Absolutely. When selecting the "Beginner" level in onboarding, the platform breaks down foundational concepts into bite-sized explanations, accompanied by intuitive examples and gentle starter practice.',
  },
  {
    q: 'How does the gamification and streak system work?',
    a: 'You earn XP for reading lessons and passing quiz checkpoints. Daily streaks record your active study days, rewarding consistent dedication without overwhelming you with pressure.',
  },
];

const STATS = [
  { value: 50, suffix: 'k+', label: 'Active Learners', color: 'text-white' },
  { value: 200, suffix: '+', label: 'Curated Paths', color: 'text-white' },
  { value: 98, suffix: '%', label: 'Goal Success', color: 'text-violet-400' },
];

/* ─── Mockup Roadmap Steps ──────────────────────────────────────────────────── */
const MOCK_STEPS = [
  { title: 'HTML5 Semantic Layouts & CSS Grid', time: '25 min', status: 'done' },
  { title: 'JavaScript Async Flow & Promises', time: '30 min', status: 'active' },
  { title: 'State Management with React Hooks', time: '40 min', status: 'locked' },
  { title: 'REST API Architecture with Express', time: '35 min', status: 'locked' },
];

/* ─── Fade-in variant ──────────────────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

const fadeUpView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ─── Section Header ─────────────────────────────────────────────────────────  */
function SectionBadge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border mb-5 ${color}`}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [goalInput, setGoalInput] = useState('');
  const [rotatingIdx, setRotatingIdx] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const t = setInterval(() => setRotatingIdx(i => (i + 1) % ROTATING_GOALS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const handleStart = (goal?: string) => {
    const g = goal || goalInput.trim();
    if (g) localStorage.setItem('skillora_goal_draft', g);
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 overflow-x-hidden">
      <PublicNavbar />

      {/* ══════════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Violet glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(ellipse at center,rgba(124,58,237,.35) 0%,rgba(99,102,241,.08) 45%,transparent 75%)' }}
          />
          {/* Blue glow right */}
          <div
            className="absolute top-1/3 -right-40 w-[600px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(ellipse at center,rgba(59,130,246,.4) 0%,transparent 65%)' }}
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-14 xl:gap-20 items-center">

            {/* ── Left column ───────────────────────────────── */}
            <div className="flex flex-col items-start">

              {/* Badge */}
              <motion.div {...fadeUp(0)}
                className="inline-flex items-center gap-2 px-4 py-1.5 mb-7 rounded-full bg-violet-500/10 border border-violet-500/25 backdrop-blur-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs font-bold text-violet-300 tracking-wide">Next-Gen AI Learning Platform</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 {...fadeUp(0.08)}
                className="text-[2.6rem] sm:text-5xl lg:text-[3.6rem] font-black leading-[1.08] tracking-tight mb-6 text-white"
              >
                Stop Wondering<br />
                <span className="gradient-text-accent">What to Learn</span> Next.
              </motion.h1>

              {/* Sub */}
              <motion.p {...fadeUp(0.16)}
                className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-lg mb-9"
              >
                Your personal AI guide turns ambitious learning goals into clear step-by-step
                roadmaps, interactive lessons, smart practice quizzes, and visible progress.
              </motion.p>

              {/* Input bar */}
              <motion.div {...fadeUp(0.22)} className="w-full max-w-lg mb-5">
                <div className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-[#10101c] border border-white/[0.1] focus-within:border-violet-500/50 focus-within:shadow-[0_0_0_4px_rgba(124,58,237,.12)] transition-all">
                  <div className="flex-1 flex items-center gap-3 px-4 py-1.5">
                    <Target className="w-4 h-4 text-violet-400 shrink-0" />
                    <input
                      type="text"
                      value={goalInput}
                      onChange={e => setGoalInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleStart()}
                      placeholder={`e.g. Learn ${ROTATING_GOALS[rotatingIdx]}…`}
                      className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleStart()}
                    className="btn-primary-glow flex-shrink-0 px-6 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Build My Path <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Popular chips */}
              <motion.div {...fadeUp(0.28)} className="flex flex-wrap items-center gap-2 mb-12">
                <span className="text-xs text-slate-500 font-semibold">Popular:</span>
                {ROTATING_GOALS.slice(0, 3).map(g => (
                  <button
                    key={g}
                    onClick={() => handleStart(g)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-300 hover:text-violet-300 hover:border-violet-500/40 transition-all cursor-pointer"
                  >
                    {g}
                  </button>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div {...fadeUp(0.34)}
                className="grid grid-cols-3 gap-6 sm:gap-10 pt-8 border-t border-white/[0.07] w-full max-w-md"
              >
                {STATS.map(s => (
                  <div key={s.label}>
                    <div className={`text-2xl sm:text-3xl font-extrabold ${s.color}`}>
                      <AnimatedCounter target={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-medium">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right column: App mockup ───────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block"
            >
              {/* Outer glow ring */}
              <div className="rounded-3xl p-px bg-gradient-to-b from-violet-500/40 via-indigo-500/20 to-transparent shadow-2xl">
                <div className="bg-[#0d0d18] rounded-[23px] p-6 border border-white/[0.06]">

                  {/* Window bar */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.07]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">skillora.ai/roadmap</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      Live Engine
                    </span>
                  </div>

                  {/* Roadmap header */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h4 className="text-sm font-bold text-white">Full Stack Web Development</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Phase 2: Modern JavaScript & APIs</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-violet-400">45% Completed</span>
                      <div className="w-20 h-1.5 rounded-full bg-white/[0.08] mt-1.5 overflow-hidden">
                        <div className="w-[45%] h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2.5 mb-5">
                    {MOCK_STEPS.map((step, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          step.status === 'active'
                            ? 'bg-violet-500/10 border-violet-500/35 shadow-lg shadow-violet-500/10'
                            : step.status === 'done'
                            ? 'bg-emerald-500/[0.05] border-emerald-500/20'
                            : 'bg-white/[0.02] border-white/[0.04] opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {step.status === 'done' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : step.status === 'active' ? (
                            <PlayCircle className="w-4 h-4 text-violet-400 shrink-0 animate-pulse" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          )}
                          <span className={`text-xs font-medium ${step.status === 'active' ? 'text-white font-semibold' : 'text-slate-400'}`}>
                            {step.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500 ml-3 shrink-0">{step.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* AI Tutor bubble */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#15152a] to-[#111120] border border-violet-500/20 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      <span className="font-bold text-violet-300">Skillora Tutor: </span>
                      "Notice how Async/Await eliminates callback nesting. Ready for the practice challenge?"
                    </p>
                  </div>

                  {/* XP + streak */}
                  <div className="mt-4 pt-3.5 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 font-semibold text-amber-300">
                      <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      +350 XP Gained
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-orange-300">
                      <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                      6 Days Streak
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TRUST BAR
          ══════════════════════════════════════════════════ */}
      <div className="border-y border-white/[0.06] bg-[#090910] py-5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-center">
          {[
            { icon: Star, text: '4.9/5 Average Rating', color: 'text-amber-400' },
            { icon: Users, text: '50,000+ Active Learners', color: 'text-violet-400' },
            { icon: ShieldCheck, text: 'No Credit Card Required', color: 'text-emerald-400' },
            { icon: Zap, text: 'AI Roadmap in 30 Seconds', color: 'text-blue-400' },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Icon className={`w-4 h-4 ${color}`} />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 md:py-36 relative border-b border-white/[0.06] bg-[#090910]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

          <div className="text-center mb-20">
            <motion.div {...fadeUpView(0)}>
              <SectionBadge color="bg-blue-500/10 text-blue-300 border-blue-500/20">
                Simple 3-Step Process
              </SectionBadge>
            </motion.div>
            <motion.h2 {...fadeUpView(0.07)}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4"
            >
              How Skillora AI <span className="gradient-text-accent">Guides You</span>
            </motion.h2>
            <motion.p {...fadeUpView(0.12)} className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
              No more doom-scrolling tutorial hell. Convert your ambition into clear daily habits.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {HOW_IT_WORKS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  {...fadeUpView(idx * 0.12)}
                  className="relative p-8 rounded-3xl bg-[#0e0e1a] border border-white/[0.07] hover:border-violet-500/35 hover:-translate-y-1.5 transition-all duration-300 group overflow-hidden"
                >
                  {/* Step number watermark */}
                  <span className="absolute top-5 right-6 text-6xl font-black text-white/[0.04] group-hover:text-violet-500/[0.08] transition-colors select-none">
                    {s.step}
                  </span>

                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.gradient} flex items-center justify-center text-white mb-6 shadow-lg ${s.glow}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-extrabold text-violet-400 uppercase tracking-widest block mb-2">
                    Step {s.step} · {s.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES GRID
          ══════════════════════════════════════════════════ */}
      <section id="features" className="py-28 md:py-36 relative border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

          <div className="text-center mb-20">
            <motion.div {...fadeUpView(0)}>
              <SectionBadge color="bg-violet-500/10 text-violet-300 border-violet-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Comprehensive Toolkit
              </SectionBadge>
            </motion.div>
            <motion.h2 {...fadeUpView(0.07)}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4"
            >
              Engineered for <span className="gradient-text-accent">Deep Learning</span>
            </motion.h2>
            <motion.p {...fadeUpView(0.12)} className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
              Everything you need to transform from beginner curiosity to professional mastery.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  {...fadeUpView(idx * 0.07)}
                  className={`p-7 rounded-3xl bg-[#0d0d18] border ${f.border} ${f.hoverBorder} hover:bg-[#10101e] hover:-translate-y-1 transition-all duration-300 group`}
                >
                  <div className={`w-11 h-11 rounded-2xl ${f.bg} border ${f.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2.5 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          POPULAR LEARNING PATHS
          ══════════════════════════════════════════════════ */}
      <section id="paths" className="py-28 md:py-36 relative border-b border-white/[0.06] bg-[#090910]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <motion.div {...fadeUpView(0)}>
                <SectionBadge color="bg-emerald-500/10 text-emerald-300 border-emerald-500/20">
                  Pre-Tested Curricula
                </SectionBadge>
              </motion.div>
              <motion.h2 {...fadeUpView(0.07)}
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white"
              >
                Popular Learning <span className="gradient-text-accent">Tracks</span>
              </motion.h2>
            </div>
            <motion.button
              {...fadeUpView(0.1)}
              onClick={() => navigate('/register')}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 cursor-pointer"
            >
              Browse All Topics <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_PATHS.map((path, idx) => {
              const Icon = path.icon;
              const ac = ACCENT_MAP[path.accent];
              return (
                <motion.div
                  key={path.title}
                  {...fadeUpView(idx * 0.07)}
                  onClick={() => handleStart(path.title)}
                  className={`p-6 rounded-3xl bg-[#0e0e1a] border ${ac.border} ${ac.hoverBorder} cursor-pointer hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-md border ${ac.tag}`}>
                        {path.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">{path.level}</span>
                    </div>

                    <div className="flex items-start gap-3.5 mb-5">
                      <div className={`w-10 h-10 rounded-xl ${ac.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon className={`w-5 h-5 ${ac.iconText}`} />
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug group-hover:text-violet-200 transition-colors">
                        {path.title}
                      </h3>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {path.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> {path.learners} learners
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          AI TUTOR SHOWCASE
          ══════════════════════════════════════════════════ */}
      <section id="tutor" className="py-28 md:py-36 relative border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left narrative */}
            <div>
              <motion.div {...fadeUpView(0)}>
                <SectionBadge color="bg-cyan-500/10 text-cyan-300 border-cyan-500/20">
                  Contextual Intelligence
                </SectionBadge>
              </motion.div>
              <motion.h2 {...fadeUpView(0.07)}
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6"
              >
                Meet Your 24/7<br />
                <span className="gradient-text-accent">AI Learning Partner</span>
              </motion.h2>
              <motion.p {...fadeUpView(0.12)} className="text-sm sm:text-base text-slate-400 leading-relaxed mb-8">
                Whenever a lesson feels abstract or a quiz question confuses you, the AI Tutor
                is right beside you with tailored explanations, real-world metaphors, and step-by-step guidance.
              </motion.p>

              <motion.div {...fadeUpView(0.16)} className="space-y-4">
                {[
                  'Explains complex theories at your current experience level',
                  'Gives practical, production-ready code examples instantly',
                  'Offers progressive hints instead of spoiling answers',
                  'Suggests targeted revision whenever you struggle with a topic',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </motion.div>

              <motion.button
                {...fadeUpView(0.22)}
                onClick={() => navigate('/register')}
                className="mt-10 btn-primary-glow px-7 py-3.5 rounded-xl text-white text-sm font-bold flex items-center gap-2 cursor-pointer w-fit"
              >
                Try AI Tutor Free <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Right: Chat UI */}
            <motion.div {...fadeUpView(0.1)}>
              <div className="rounded-3xl p-px bg-gradient-to-br from-violet-500/40 via-indigo-500/20 to-transparent shadow-2xl">
                <div className="bg-[#0b0b16] rounded-[23px] p-6 border border-white/[0.06]">

                  {/* Tutor header */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                        <Brain className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Skillora AI Tutor</p>
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                          Active in Current Lesson
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 font-mono">
                      useEffect
                    </span>
                  </div>

                  {/* Chat messages */}
                  <div className="space-y-4 mb-5 text-xs">
                    {/* User */}
                    <div className="flex justify-end">
                      <div className="bg-violet-600/20 border border-violet-500/30 text-slate-100 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] leading-relaxed">
                        I still don't understand why we use useEffect dependencies in React?
                      </div>
                    </div>
                    {/* Tutor */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-violet-600/25 border border-violet-500/20 flex items-center justify-center shrink-0 mt-1">
                        <Brain className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                      <div className="bg-[#141424] border border-white/[0.07] text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[88%] leading-relaxed space-y-2">
                        <p>Think of it like an <strong className="text-white">alarm trigger 🔔</strong></p>
                        <p className="text-slate-400">
                          An empty{' '}
                          <code className="text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded text-[11px]">[]</code>{' '}
                          runs once on mount. Adding{' '}
                          <code className="text-violet-300 bg-violet-500/10 px-1.5 py-0.5 rounded text-[11px]">[userId]</code>{' '}
                          re-runs the effect only when <code className="text-violet-300 text-[11px]">userId</code> changes!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick prompts */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.05]">
                    {['Show a code example', 'Give me a practice quiz', 'Explain with an analogy'].map(p => (
                      <span
                        key={p}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-slate-400 hover:text-violet-300 hover:border-violet-500/35 cursor-pointer transition-all"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ
          ══════════════════════════════════════════════════ */}
      <section id="faq" className="py-28 md:py-36 relative border-b border-white/[0.06] bg-[#090910]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">

          <div className="text-center mb-16">
            <motion.div {...fadeUpView(0)}>
              <SectionBadge color="bg-amber-500/10 text-amber-300 border-amber-500/20">
                Got Questions?
              </SectionBadge>
            </motion.div>
            <motion.h2 {...fadeUpView(0.07)}
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4"
            >
              Frequently Asked <span className="gradient-text-accent">Questions</span>
            </motion.h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div
                  key={idx}
                  {...fadeUpView(idx * 0.06)}
                  className={`rounded-2xl border ${isOpen ? 'border-violet-500/30 bg-[#0f0f1c]' : 'border-white/[0.07] bg-[#0c0c16]'} overflow-hidden transition-all`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white pr-4 leading-snug">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-violet-400' : 'text-slate-500'}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-sm text-slate-400 leading-relaxed border-t border-white/[0.04] pt-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════════════ */}
      <section className="py-28 md:py-36 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 60%,rgba(124,58,237,.18) 0%,rgba(99,102,241,.05) 45%,transparent 75%)' }}
        />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div {...fadeUpView(0)}>
            <div className="rounded-3xl p-px bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 shadow-2xl shadow-violet-500/20">
              <div className="bg-[#0a0a14] rounded-[23px] px-8 py-16 sm:py-20 text-center relative overflow-hidden">

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-violet-500/30">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
                  Ready to Master Anything,<br />
                  <span className="gradient-text-accent">One Step at a Time?</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed mb-10">
                  Join thousands of students and career switchers building personalized roadmaps with AI-guided learning.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full sm:w-auto btn-primary-glow px-8 py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Build My Learning Path <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.09] text-white font-semibold text-sm transition-all cursor-pointer"
                  >
                    Sign In to Account
                  </button>
                </div>

                {/* Trust note */}
                <p className="mt-8 text-xs text-slate-600">
                  Free to start · No credit card required · Cancel anytime
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.07] py-12 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-extrabold text-sm tracking-tight">SKILLORA AI</span>
              <p className="text-[10px] text-slate-600 -mt-0.5">Learn Anything, One Step at a Time</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-slate-500">
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(l => (
              <a key={l} href="#" className="hover:text-slate-300 transition-colors">{l}</a>
            ))}
          </div>

          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Skillora AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

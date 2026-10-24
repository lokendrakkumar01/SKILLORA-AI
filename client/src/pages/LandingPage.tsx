import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Target, TrendingUp, BookOpen, Brain, MessageCircle, BarChart3,
  Trophy, ArrowRight, ChevronDown, CheckCircle2, Users, Clock,
  PlayCircle, Sparkles, Compass, ShieldCheck, Flame, Laptop, GraduationCap
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/Navbar';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

const POPULAR_GOALS = [
  'Full Stack Web Development',
  'AI & Machine Learning Engineering',
  'Python for Data Science',
  'Cybersecurity & Ethical Hacking',
  'Modern UI/UX Design System',
  'Mobile App Development with React Native',
];

const STEPS = [
  {
    step: '01',
    icon: Target,
    title: 'Enter Any Ambition',
    desc: 'Tell Skillora AI what you want to master, your weekly time availability, and current skill baseline.',
    badge: 'Step 1: Goal Setup',
    gradient: 'from-violet-500/20 to-purple-500/10'
  },
  {
    step: '02',
    icon: Compass,
    title: 'Dynamic AI Curriculum',
    desc: 'Get a comprehensive roadmap broken into structured phases, manageable modules, and interactive lessons.',
    badge: 'Step 2: AI Generation',
    gradient: 'from-indigo-500/20 to-blue-500/10'
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Practice & Prove Mastery',
    desc: 'Learn through guided concepts, chat with your dedicated AI tutor, test yourself in quizzes, and earn verifiable XP.',
    badge: 'Step 3: Continuous Growth',
    gradient: 'from-cyan-500/20 to-emerald-500/10'
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'AI Roadmap Engine',
    desc: 'Generate tailored syllabi with prerequisites, estimated times, and milestone checkpoints for any subject.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20'
  },
  {
    icon: BookOpen,
    title: 'Interactive Workspaces',
    desc: 'Clean, distraction-free lessons featuring structured breakdowns, runnable code snippets, and hands-on exercises.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  {
    icon: Brain,
    title: 'Contextual AI Tutor',
    desc: 'Ask questions directly within lessons. Get simplified analogies, code breakdowns, and hints without leaving your workspace.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20'
  },
  {
    icon: ShieldCheck,
    title: 'Adaptive Quiz Engine',
    desc: 'Evaluate your comprehension with instant feedback, deep answer explanations, and topic-level scoring.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    icon: BarChart3,
    title: 'Progress Intelligence',
    desc: 'Measure your consistency with weekly study charts, streak tracking, and skill mastery percentages.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  {
    icon: Trophy,
    title: 'Gamified Milestones',
    desc: 'Level up with earned XP, maintain daily study streaks, unlock achievement badges, and celebrate progress.',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20'
  },
];

const POPULAR_PATHS = [
  {
    title: 'Full Stack Web Development',
    category: 'Software Engineering',
    duration: '90 Days',
    level: 'Beginner to Pro',
    learners: '14.2k learners',
    icon: Laptop,
    accent: 'border-violet-500/30 hover:border-violet-500/60'
  },
  {
    title: 'Applied Machine Learning',
    category: 'Artificial Intelligence',
    duration: '75 Days',
    level: 'Intermediate',
    learners: '9.8k learners',
    icon: Brain,
    accent: 'border-indigo-500/30 hover:border-indigo-500/60'
  },
  {
    title: 'Python for Data Analytics',
    category: 'Data Science',
    duration: '45 Days',
    level: 'Beginner Friendly',
    learners: '18.1k learners',
    icon: BarChart3,
    accent: 'border-blue-500/30 hover:border-blue-500/60'
  },
  {
    title: 'Modern UI/UX Design System',
    category: 'Product Design',
    duration: '40 Days',
    level: 'All Levels',
    learners: '8.4k learners',
    icon: Sparkles,
    accent: 'border-pink-500/30 hover:border-pink-500/60'
  },
  {
    title: 'Cybersecurity Fundamentals',
    category: 'Security & Networks',
    duration: '60 Days',
    level: 'Intermediate',
    learners: '6.7k learners',
    icon: ShieldCheck,
    accent: 'border-emerald-500/30 hover:border-emerald-500/60'
  },
  {
    title: 'Cloud Architecture & DevOps',
    category: 'Infrastructure',
    duration: '60 Days',
    level: 'Intermediate',
    learners: '7.3k learners',
    icon: Compass,
    accent: 'border-amber-500/30 hover:border-amber-500/60'
  },
];

const FAQS = [
  {
    q: 'How does Skillora AI customize my learning path?',
    a: 'Skillora assesses your specific goal, prior experience level, target timeline, and available hours per day. Using our AI roadmap algorithm, it structures high-yield modules, exercises, and quizzes calibrated to prevent overwhelm while accelerating comprehension.'
  },
  {
    q: 'What if I get stuck on a difficult concept or exercise?',
    a: 'Every lesson features an intelligent AI Tutor side panel. It understands your exact lesson context and can simplify theories into real-world analogies, suggest code fixes, or quiz you on prerequisite knowledge until you feel confident.'
  },
  {
    q: 'Can I regenerate or adapt my roadmap as I progress?',
    a: 'Yes! Learning isn\'t linear. You can adjust your daily time goals, regenerate roadmaps with new requirements, or mark already-known topics as completed to fast-forward through familiar material.'
  },
  {
    q: 'Is Skillora AI suitable for absolute beginners?',
    a: 'Absolutely. When selecting the "Beginner" level in onboarding, the platform breaks down foundational concepts into bite-sized explanations, accompanied by intuitive visuals and gentle starter practice.'
  },
  {
    q: 'How does the gamification and streak system work?',
    a: 'You earn XP for reading lessons and passing quiz checkpoints. Daily streaks record your active study days, rewarding consistent dedication without overwhelming you.'
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [goalInput, setGoalInput] = useState('');
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveGoalIndex((prev) => (prev + 1) % POPULAR_GOALS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleStartWithGoal = (goalToUse?: string) => {
    const selected = goalToUse || goalInput.trim();
    if (selected) {
      localStorage.setItem('skillora_goal_draft', selected);
    }
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 selection:bg-violet-600 selection:text-white">
      <PublicNavbar />

      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden">
        {/* Ambient Glows & Grid */}
        <div className="absolute inset-0 grid-background opacity-40 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] hero-glow-1 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[400px] hero-glow-2 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 backdrop-blur-md mb-6"
              >
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-violet-300">
                  Next-Gen AI Learning Platform
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] mb-6"
              >
                Stop Wondering <br />
                <span className="gradient-text-accent">What to Learn</span> Next.
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed mb-8"
              >
                Your personal AI guide turns ambitious learning goals into step-by-step
                roadmaps, interactive lessons, smart practice quizzes, and visible progress.
              </motion.p>

              {/* Goal Input Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full max-w-xl mb-4"
              >
                <div className="relative p-1.5 rounded-2xl bg-[#11111e]/90 border border-white/[0.12] focus-within:border-violet-500/60 focus-within:ring-4 focus-within:ring-violet-500/20 transition-all shadow-2xl flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center px-3.5">
                    <Target className="w-5 h-5 text-violet-400 shrink-0 mr-3" />
                    <input
                      type="text"
                      value={goalInput}
                      onChange={(e) => setGoalInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStartWithGoal()}
                      placeholder={`e.g. Learn ${POPULAR_GOALS[activeGoalIndex]}...`}
                      className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none py-2"
                    />
                  </div>
                  <button
                    onClick={() => handleStartWithGoal()}
                    className="btn-primary-glow px-6 py-3.5 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    Build My Path
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Quick Prompt Chips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center flex-wrap gap-2 text-xs text-slate-400 mb-10"
              >
                <span className="font-semibold text-slate-400">Popular:</span>
                {POPULAR_GOALS.slice(0, 3).map((goal) => (
                  <button
                    key={goal}
                    onClick={() => {
                      setGoalInput(goal);
                      handleStartWithGoal(goal);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-violet-500/40 hover:text-violet-300 text-slate-300 transition-all cursor-pointer"
                  >
                    {goal}
                  </button>
                ))}
              </motion.div>

              {/* Social Proof Stats */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-3 gap-6 sm:gap-10 pt-6 border-t border-white/[0.08] w-full max-w-lg"
              >
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    <AnimatedCounter target={50} suffix="k+" />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">Active Learners</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    <AnimatedCounter target={200} suffix="+" />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">Curated Paths</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-violet-400">
                    <AnimatedCounter target={98} suffix="%" />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">Goal Success</div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Interactive App Preview Mockup */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="rounded-3xl p-1 bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent shadow-2xl"
              >
                <div className="bg-[#0e0e18] rounded-[22px] p-6 border border-white/[0.08]">
                  {/* Browser Window Bar */}
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">skillora.ai/roadmap</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Live Engine
                    </span>
                  </div>

                  {/* Header in Roadmap */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h4 className="text-sm font-bold text-white">Full Stack Web Development</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Phase 2: Modern JavaScript & APIs</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-violet-300">45% Completed</span>
                      <div className="w-24 h-1.5 rounded-full bg-white/10 mt-1.5 overflow-hidden">
                        <div className="w-[45%] h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Mock Steps */}
                  <div className="space-y-2.5">
                    {[
                      { title: 'HTML5 Semantic Layouts & CSS Grid', time: '25 min', status: 'done' },
                      { title: 'JavaScript Asynchronous Flow & Promises', time: '30 min', status: 'active' },
                      { title: 'State Management with React & Hooks', time: '40 min', status: 'locked' },
                      { title: 'REST API Architecture with Express', time: '35 min', status: 'locked' },
                    ].map((step, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          step.status === 'active'
                            ? 'bg-violet-600/15 border-violet-500/40 shadow-lg shadow-violet-500/10'
                            : step.status === 'done'
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                            : 'bg-white/[0.02] border-white/[0.05] opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {step.status === 'done' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : step.status === 'active' ? (
                            <PlayCircle className="w-4 h-4 text-violet-400 shrink-0 animate-pulse" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                          )}
                          <span className={`text-xs font-medium ${step.status === 'active' ? 'text-white font-semibold' : 'text-slate-300'}`}>
                            {step.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                          {step.time}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* AI Tutor Card Inside Mockup */}
                  <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-br from-[#161628] to-[#12121f] border border-violet-500/20 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shrink-0">
                      <Brain className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1 text-[11px] text-slate-300 leading-relaxed">
                      <span className="font-bold text-violet-300">Skillora AI Tutor:</span> "Notice how Async/Await eliminates callback nesting. Ready for the practice challenge?"
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="mt-4 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                    <span className="text-amber-300 font-semibold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> +350 XP Gained
                    </span>
                    <span className="text-orange-300 font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" /> 6 Days Streak
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: HOW IT WORKS
          ========================================================================= */}
      <section id="how-it-works" className="py-24 md:py-32 relative border-t border-white/[0.06] bg-[#090910]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold mb-4">
              Simple 3-Step Process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
              How Skillora AI <span className="gradient-text-accent">Guides You</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              No more doom-scrolling tutorial hell. Convert your ambition into clear daily habits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="relative p-8 rounded-3xl bg-[#0f0f1b] border border-white/[0.08] hover:border-violet-500/40 transition-all duration-300 group hover:-translate-y-1.5 shadow-xl"
                >
                  {/* Step Number Indicator */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-white/10 group-hover:text-violet-400/30 transition-colors">
                      {s.step}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider block mb-2">
                    {s.badge}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: PLATFORM FEATURES
          ========================================================================= */}
      <section id="features" className="py-24 md:py-32 relative border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-4">
              Comprehensive Toolkit
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
              Engineered for <span className="gradient-text-accent">Deep Learning</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Everything you need to transform from beginner curiosity to professional mastery.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, idx) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="p-7 rounded-3xl bg-[#0d0d17] border border-white/[0.08] hover:border-violet-500/30 hover:bg-[#11111f] transition-all duration-300 group hover:-translate-y-1 shadow-md"
                >
                  <div className={`w-11 h-11 rounded-2xl ${f.bg} border ${f.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: POPULAR LEARNING PATHS
          ========================================================================= */}
      <section id="paths" className="py-24 md:py-32 relative border-t border-white/[0.06] bg-[#090910]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
                Pre-Tested Curricula
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                Popular Learning <span className="gradient-text-accent">Tracks</span>
              </h2>
            </div>
            <button
              onClick={() => navigate('/register')}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              Browse All Topics <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {POPULAR_PATHS.map((path, idx) => {
              const Icon = path.icon;
              return (
                <motion.div
                  key={path.title}
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  onClick={() => handleStartWithGoal(path.title)}
                  className={`p-6 rounded-3xl bg-[#0f0f1b] border ${path.accent} cursor-pointer group hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between shadow-xl`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        {path.category}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300">
                        {path.level}
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors">
                        {path.title}
                      </h3>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {path.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" /> {path.learners}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: AI TUTOR SHOWCASE
          ========================================================================= */}
      <section id="tutor" className="py-24 md:py-32 relative border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-4">
                Contextual Intelligence
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6">
                Meet Your 24/7 <br />
                <span className="gradient-text-accent">AI Learning Partner</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8">
                Whenever a lesson feels abstract or a quiz question confuses you, the AI Tutor
                is right beside you with tailored explanations, real-world metaphors, and step-by-step guidance.
              </p>

              <div className="space-y-4">
                {[
                  'Explains complex theories at your current level of experience',
                  'Gives practical, production-ready code examples instantly',
                  'Offers progressive hints instead of spoiling answers',
                  'Suggests targeted revision whenever you struggle with a topic'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Chat UI Simulation */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl p-1 bg-gradient-to-br from-violet-500/30 via-white/[0.08] to-transparent shadow-2xl">
                <div className="bg-[#0c0c16] rounded-[22px] p-6 border border-white/[0.08]">
                  {/* Tutor Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Skillora Tutor</h4>
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active in Current Lesson
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-3.5 mb-4 text-xs">
                    <div className="flex justify-end">
                      <div className="bg-violet-600/25 border border-violet-500/40 text-slate-100 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] leading-relaxed">
                        I still don't quite understand why we use useEffect dependencies in React?
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-violet-600/30 flex items-center justify-center shrink-0 mt-1">
                        <Brain className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                      <div className="bg-[#141424] border border-white/[0.08] text-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] leading-relaxed space-y-2">
                        <p>
                          Think of dependencies like an <strong className="text-white">alert trigger 🔔</strong>.
                        </p>
                        <p className="text-slate-300">
                          If the dependency list is empty <code className="text-violet-300 bg-white/5 px-1 py-0.5 rounded">[]</code>, the effect runs only once when the component is mounted. If you put <code className="text-violet-300 bg-white/5 px-1 py-0.5 rounded">[userId]</code>, it re-runs only when the <code className="text-violet-300">userId</code> changes!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Pill Prompts */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
                    {['Show a code example', 'Give me a practice quiz', 'Explain with an analogy'].map((p) => (
                      <span
                        key={p}
                        className="text-[11px] px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:border-violet-500/40 cursor-pointer transition-all"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FAQ ACCORDION
          ========================================================================= */}
      <section id="faq" className="py-24 md:py-32 relative border-t border-white/[0.06] bg-[#090910]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
              Got Questions?
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
              Frequently Asked <span className="gradient-text-accent">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.08] bg-[#0e0e18] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-white pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-violet-400' : ''
                      }`}
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
                        <p className="px-6 pb-6 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/[0.04] pt-4">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: GRAND CALL TO ACTION
          ========================================================================= */}
      <section className="py-24 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow-1 opacity-70 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 shadow-2xl">
            <div className="bg-[#0b0b14] rounded-[22px] px-8 py-16 sm:p-20 text-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-violet-500/30">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                Ready to Master Anything, <br />
                <span className="gradient-text-accent">One Step at a Time?</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed mb-10">
                Join thousands of students and career switchers building personalized roadmaps with AI-guided learning.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto btn-primary-glow px-8 py-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  Build My Learning Path
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  Sign In to Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer className="border-t border-white/[0.08] py-12 bg-[#050508]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="text-sm font-extrabold text-white tracking-tight">SKILLORA AI</span>
            <span className="text-xs text-slate-400">© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#paths" className="hover:text-white transition-colors">Roadmaps</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

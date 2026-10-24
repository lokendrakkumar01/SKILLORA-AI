import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Target, TrendingUp, BookOpen, Brain, MessageCircle, BarChart3,
  Trophy, ArrowRight, ChevronDown, CheckCircle2, Star, Users, Clock,
  Shield, Rocket, Map, PlayCircle, Globe
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/Navbar';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { Badge } from '../components/ui/Badge';

const GOALS = [
  'Full Stack Web Development',
  'Machine Learning & AI',
  'Data Science with Python',
  'Mobile App Development',
  'Cybersecurity',
  'UI/UX Design',
  'Cloud Architecture',
  'Blockchain Development',
];

const FEATURES = [
  { icon: Zap, title: 'AI Roadmap Engine', desc: 'Get a personalized, step-by-step learning plan generated instantly for any goal.', color: 'violet' },
  { icon: BookOpen, title: 'Interactive Lessons', desc: 'Structured content with real examples, code blocks, and hands-on exercises.', color: 'blue' },
  { icon: Brain, title: 'Smart Quizzes', desc: 'Adaptive assessments that identify your weak spots and adjust difficulty.', color: 'cyan' },
  { icon: BarChart3, title: 'Progress Analytics', desc: 'Visualize your learning journey with streaks, XP, and completion charts.', color: 'green' },
  { icon: MessageCircle, title: 'AI Tutor', desc: 'Ask anything, anytime. Your personal tutor explains concepts at your level.', color: 'amber' },
  { icon: Trophy, title: 'Achievements', desc: 'Stay motivated with XP, streaks, badges, and milestone celebrations.', color: 'red' },
];

const PATHS = [
  { emoji: '🌐', title: 'Full Stack Web Dev', duration: '90 days', level: 'Beginner→Pro', learners: '12.4k', color: 'from-violet-600/20 to-blue-600/20', border: 'border-violet-500/20' },
  { emoji: '🤖', title: 'Machine Learning', duration: '75 days', level: 'Intermediate', learners: '8.2k', color: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-500/20' },
  { emoji: '🎨', title: 'UI/UX Design', duration: '45 days', level: 'Beginner', learners: '9.1k', color: 'from-pink-600/20 to-violet-600/20', border: 'border-pink-500/20' },
  { emoji: '🔒', title: 'Cybersecurity', duration: '80 days', level: 'Intermediate', learners: '5.7k', color: 'from-green-600/20 to-emerald-600/20', border: 'border-green-500/20' },
  { emoji: '📊', title: 'Data Analytics', duration: '60 days', level: 'Beginner', learners: '10.3k', color: 'from-amber-600/20 to-orange-600/20', border: 'border-amber-500/20' },
  { emoji: '🐍', title: 'Python Programming', duration: '30 days', level: 'Beginner', learners: '18.6k', color: 'from-cyan-600/20 to-blue-600/20', border: 'border-cyan-500/20' },
];

const FAQS = [
  { q: 'How does the AI generate my learning roadmap?', a: 'Our AI analyzes your goal, experience level, available time, and preferred learning style to create a structured roadmap with phases, modules, and individual lessons tailored specifically for you.' },
  { q: 'Do I need any prior experience to start?', a: 'Not at all! SKILLORA AI supports all levels from complete beginners to advanced practitioners. Just tell us where you are and we\'ll meet you there.' },
  { q: 'Can I change my roadmap after it\'s generated?', a: 'Yes. You can regenerate your roadmap at any time, adjust your daily time commitment, or skip ahead if you already know certain topics.' },
  { q: 'Is the AI tutor available 24/7?', a: 'Yes! The AI tutor is available whenever you\'re studying. It understands the context of your current lesson and provides relevant, personalized explanations.' },
  { q: 'How is progress tracked?', a: 'Progress is tracked through lesson completions, quiz scores, study streaks, and time spent. Your dashboard gives you a real-time view of your learning journey with beautiful analytics.' },
];

const STEPS = [
  { num: '01', icon: Target, title: 'Tell Us Your Goal', desc: 'Enter what you want to learn — any topic, skill, or career goal. The more specific, the better the roadmap.' },
  { num: '02', icon: Map, title: 'Get Your AI Roadmap', desc: 'Receive a personalized, structured learning path with phases, modules, and individual lessons built for your level and schedule.' },
  { num: '03', icon: TrendingUp, title: 'Learn, Practice, Progress', desc: 'Work through lessons, take quizzes, ask the AI tutor questions, and track your progress with satisfying analytics.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [goalInput, setGoalInput] = useState('');
  const [currentGoal, setCurrentGoal] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setCurrentGoal((c) => (c + 1) % GOALS.length), 2800);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    if (goalInput.trim()) {
      localStorage.setItem('skillora_goal_draft', goalInput.trim());
    }
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-200">
      <PublicNavbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-violet-500/60"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 20}%` }}
            animate={{ y: [-10, 10, -10], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                <span className="text-xs text-violet-300 font-medium">AI-Powered Learning • Free to Start</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                <span className="text-white">Stop Wondering</span>
                <br />
                <span className="text-gradient">What to Learn</span>
                <br />
                <span className="text-white">Next.</span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                Your personal AI learning guide turns ambitious goals into clear steps, practical lessons, and visible progress.
              </p>

              {/* Goal input */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                  <input
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    placeholder="What do you want to master?"
                    className="w-full px-5 py-4 rounded-2xl bg-[#111118] border border-white/10 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStart}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-sm whitespace-nowrap flex items-center gap-2 shadow-lg shadow-violet-500/25"
                >
                  Build My Path <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Cycling suggestions */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Try:</span>
                <AnimatePresence mode="wait">
                  <motion.button
                    key={currentGoal}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setGoalInput(GOALS[currentGoal])}
                    className="text-violet-400 hover:text-violet-300 font-medium transition-colors cursor-pointer"
                  >
                    {GOALS[currentGoal]}
                  </motion.button>
                </AnimatePresence>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-10">
                {[
                  { value: 50, suffix: 'k+', label: 'Learners' },
                  { value: 200, suffix: '+', label: 'Learning Paths' },
                  { value: 98, suffix: '%', label: 'Satisfaction' },
                ].map(({ value, suffix, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-black text-white">
                      <AnimatedCounter target={value} suffix={suffix} />
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Animated Roadmap Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="rounded-2xl border border-white/[0.08] bg-[#111118] p-6 shadow-2xl shadow-black/50"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-white font-bold text-sm">Full Stack Web Development</h3>
                    <p className="text-xs text-slate-400 mt-0.5">90-day roadmap • Beginner</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-violet-300 font-semibold">35% done</div>
                    <div className="w-20 h-1.5 bg-white/10 rounded-full mt-1.5">
                      <div className="w-[35%] h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" />
                    </div>
                  </div>
                </div>
                {[
                  { phase: 'Phase 1', title: 'HTML & CSS Fundamentals', status: 'done', steps: 8 },
                  { phase: 'Phase 2', title: 'JavaScript Essentials', status: 'active', steps: 12 },
                  { phase: 'Phase 3', title: 'React & Modern Frontend', status: 'locked', steps: 10 },
                  { phase: 'Phase 4', title: 'Node.js & Backend', status: 'locked', steps: 14 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-all ${
                      item.status === 'active' ? 'bg-violet-500/15 border border-violet-500/25' :
                      item.status === 'done' ? 'bg-white/[0.03]' : 'opacity-40 bg-white/[0.02]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      item.status === 'done' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.status === 'active' ? 'bg-violet-500/25 text-violet-400' :
                      'bg-white/5 text-slate-600'
                    }`}>
                      {item.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> :
                       item.status === 'active' ? <PlayCircle className="w-4 h-4" /> :
                       <Shield className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500">{item.phase}</div>
                      <div className={`text-sm font-medium truncate ${item.status === 'locked' ? 'text-slate-600' : 'text-slate-200'}`}>
                        {item.title}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">{item.steps} steps</div>
                  </motion.div>
                ))}
                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>1,250 XP earned</span>
                  </div>
                  <Badge variant="violet">🔥 5 day streak</Badge>
                </div>
              </motion.div>

              {/* Floating AI chat bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-[#1A1A2E] border border-white/[0.08] rounded-2xl p-4 shadow-xl max-w-[200px]"
              >
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
                    <Brain className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-300 leading-relaxed">"Great progress! Ready for JavaScript? Let's dive in 🚀"</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="blue" className="mb-4">How It Works</Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Three Steps to <span className="text-gradient">Mastery</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Go from idea to expertise with AI-guided learning that adapts to you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-8 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#131320] to-[#0F0F1A] hover:border-violet-500/30 transition-all group"
              >
                <div className="absolute -top-3 left-8">
                  <span className="text-5xl font-black text-white/[0.04] group-hover:text-white/[0.07] transition-colors">{step.num}</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mb-5">
                  <step.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-violet-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-[#080810] relative">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="violet" className="mb-4">Platform Features</Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Everything You Need to <span className="text-gradient">Succeed</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, borderColor: 'rgba(124,58,237,0.35)' }}
                className="p-6 rounded-2xl border border-white/[0.06] bg-[#0D0D18] group transition-all duration-300 hover:shadow-xl hover:shadow-black/40"
              >
                <div className="w-11 h-11 rounded-xl bg-violet-500/15 flex items-center justify-center mb-5 group-hover:bg-violet-500/25 transition-colors">
                  <f.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR PATHS */}
      <section id="paths" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="green" className="mb-4">Popular Paths</Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Start with a <span className="text-gradient">Proven Path</span>
            </h2>
            <p className="text-lg text-slate-400">Or enter any custom goal for a personalized roadmap.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PATHS.map((path, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                onClick={() => { setGoalInput(path.title); navigate('/register'); }}
                className={`p-6 rounded-2xl border ${path.border} bg-gradient-to-br ${path.color} cursor-pointer hover:shadow-xl hover:shadow-black/40 transition-all group`}
              >
                <div className="text-3xl mb-4">{path.emoji}</div>
                <h3 className="text-white font-bold text-base mb-2">{path.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1"><Clock className="w-3 h-3" />{path.duration}</div>
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" />{path.learners}</div>
                </div>
                <div className="mt-3">
                  <Badge variant="dark">{path.level}</Badge>
                </div>
                <div className="mt-4 flex items-center text-violet-400 text-xs font-medium gap-1 group-hover:gap-2 transition-all">
                  Start this path <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI TUTOR DEMO */}
      <section className="py-24 bg-[#080810]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Badge variant="cyan" className="mb-5">AI Tutor</Badge>
              <h2 className="text-4xl font-black text-white mb-4">
                Your Personal <span className="text-gradient">AI Tutor</span> — Always Available
              </h2>
              <p className="text-slate-400 text-base leading-relaxed mb-6">
                Stuck on a concept? Ask your AI tutor and get instant, clear explanations tailored to your exact learning context and level.
              </p>
              <div className="space-y-3">
                {['Explains any concept at your level', 'Gives real-world examples instantly', 'Generates practice questions', 'Hints before revealing answers', 'Remembers your current lesson'].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl border border-white/[0.08] bg-[#0F0F1A] overflow-hidden">
              <div className="p-4 border-b border-white/[0.06] flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
                  <Brain className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">SKILLORA Tutor</span>
                <span className="ml-auto"><Badge variant="green">Online</Badge></span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-end">
                  <div className="bg-violet-500/20 border border-violet-500/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%]">
                    <p className="text-sm text-slate-200">I don't understand async/await in JavaScript</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0 mt-1">
                    <Brain className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-[#1A1A2E] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Great question! Think of <code className="text-violet-400 bg-violet-500/15 px-1 rounded">async/await</code> as a way to write asynchronous code that reads like synchronous code.
                      <br /><br />
                      <strong className="text-white">Simple analogy:</strong> Imagine ordering coffee ☕. You don't stand frozen waiting — you sit down and get notified when it's ready. That's exactly what <code className="text-violet-400 bg-violet-500/15 px-1 rounded">await</code> does!
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  {['Give me an example', 'Practice question', 'Explain simpler'].map((q) => (
                    <button key={q} className="text-xs px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-all">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <Badge variant="amber" className="mb-4">FAQ</Badge>
            <h2 className="text-4xl font-black text-white">Frequently Asked <span className="text-gradient">Questions</span></h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="border border-white/[0.07] rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.02] transition-colors">
                  <span className="font-semibold text-sm text-white">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-4" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-[#0A0A0F] to-blue-900/20" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="gradient-border rounded-3xl p-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center animate-pulse-glow">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Ready to Start Your <span className="text-gradient">Learning Journey?</span>
            </h2>
            <p className="text-lg text-slate-400 mb-8">Join 50,000+ learners building their future with AI-powered guidance.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-xl shadow-violet-500/30">
                Build My Learning Path <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
                className="px-8 py-4 rounded-2xl border border-white/10 text-slate-300 font-semibold hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5" /> Sign In
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">S</span>
            </div>
            <span className="text-white font-bold text-sm">SKILLORA AI</span>
          </div>
          <p className="text-xs text-slate-500">© 2024 SKILLORA AI. Learn Anything, One Step at a Time.</p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Globe className="w-3.5 h-3.5" />
            <span>Available worldwide</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

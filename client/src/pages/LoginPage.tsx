import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles,
  AlertCircle, PlayCircle, CheckCircle2, Zap, Brain, Trophy, TrendingUp, BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STATS = [
  { value: '50k+', label: 'Active Learners' },
  { value: '200+', label: 'Learning Paths' },
  { value: '98%', label: 'Goal Success Rate' },
];

const FEATURES_LIST = [
  { icon: Zap, text: 'Personalized AI roadmap in under 30 seconds' },
  { icon: Brain, text: 'Contextual AI tutor inside every lesson' },
  { icon: Trophy, text: 'XP system, streaks & achievement badges' },
  { icon: TrendingUp, text: 'Adaptive quizzes that grow with you' },
  { icon: BarChart3, text: 'Progress analytics & weekly streak tracking' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('test@skillora.com', 'test123456');
      navigate('/dashboard');
    } catch {
      setError('Demo user not found. Please register a free account instead!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] flex overflow-hidden">

      {/* ── LEFT PANEL (decorative, desktop only) ─────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0820] via-[#090912] to-[#07070b]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />
        {/* Violet blob */}
        <div
          className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center,rgba(124,58,237,.65) 0%,transparent 65%)' }}
        />
        {/* Cyan blob */}
        <div
          className="absolute bottom-10 right-0 w-[450px] h-[450px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center,rgba(6,182,212,.6) 0%,transparent 65%)' }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2">
                SKILLORA
                <span className="text-[11px] px-2 py-0.5 rounded-md font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">AI</span>
              </span>
              <p className="text-[10px] text-slate-500 -mt-0.5 font-medium tracking-wide uppercase">Learn Step-by-Step</p>
            </div>
          </Link>
        </div>

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.1] mb-5">
              Welcome Back to<br />
              <span
                style={{
                  background: 'linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Your Journey.
              </span>
            </h2>
            <p className="text-base text-slate-400 leading-relaxed max-w-sm mb-10">
              Resume your personalized roadmap, continue your streak, and keep building towards your goals — all in one place.
            </p>

            {/* Feature list */}
            <div className="space-y-4 mb-10">
              {FEATURES_LIST.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.text}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-violet-500/12 border border-violet-500/20 flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(124,58,237,0.12)' }}
                    >
                      <Icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">{f.text}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
                  className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] text-center"
                >
                  <p className="text-xl font-extrabold text-white">{s.value}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
            <div className="flex -space-x-2">
              {['RK', 'AS', 'PM', 'LJ'].map((initials) => (
                <div
                  key={initials}
                  className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 border-2 border-[#0d0d18] flex items-center justify-center text-[10px] font-bold text-white"
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-300 font-medium">
              <span className="text-white font-bold">50,000+ learners</span> growing with Skillora
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center px-5 sm:px-10 py-12 relative">
        {/* Subtle bg */}
        <div className="absolute inset-0 bg-[#08080f]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Glow */}
        <div
          className="absolute bottom-0 left-0 w-80 h-80 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at bottom left,rgba(6,182,212,.8) 0%,transparent 65%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">
                SKILLORA <span className="text-xs px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">AI</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
              Welcome Back 👋
            </h1>
            <p className="text-sm text-slate-400">
              Sign in to access your roadmap and continue where you left off.
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 tracking-wide uppercase">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0f0f1c] border border-white/[0.09] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/60 focus:shadow-[0_0_0_4px_rgba(124,58,237,.12)] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 tracking-wide uppercase">
                  Password
                </label>
                <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Your password"
                  required
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#0f0f1c] border border-white/[0.09] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/60 focus:shadow-[0_0_0_4px_rgba(124,58,237,.12)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 btn-primary-glow py-4 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Authenticating…
                </>
              ) : (
                <>Sign In to Skillora <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-xs text-slate-600 font-medium">or</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Demo button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.04] border border-white/[0.09] hover:bg-white/[0.07] hover:border-violet-500/30 text-sm font-semibold text-slate-200 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <PlayCircle className="w-4 h-4 text-violet-400" />
            Try Demo Mode — No Account Needed
          </button>

          {/* What's in demo */}
          <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="flex flex-wrap gap-3">
              {['Sample roadmap', 'AI tutor chat', 'Quiz engine', 'Progress dashboard'].map(f => (
                <span key={f} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
              Create one free →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

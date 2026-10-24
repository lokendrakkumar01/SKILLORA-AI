import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles,
  AlertCircle, CheckCircle2, Zap, Brain, Trophy, TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PERKS = [
  { icon: Zap, title: 'Personalized Roadmaps', desc: 'Turn your learning goal into a structured curriculum.' },
  { icon: Brain, title: 'Contextual AI Tutor', desc: 'Ask questions and get answers tailored to your lesson.' },
  { icon: Trophy, title: 'Gamified Progress', desc: 'Earn XP, maintain streaks, unlock achievements.' },
  { icon: TrendingUp, title: 'Adaptive Quizzes', desc: 'Checkpoints that grow harder as you improve.' },
];

const INCLUDED = [
  'Free AI custom roadmap generation',
  'Embedded AI Tutor in every lesson',
  'Interactive practice quizzes & progress tracking',
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] flex overflow-x-hidden">

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
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-25 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center,rgba(124,58,237,.6) 0%,transparent 65%)' }}
        />
        {/* Blue blob */}
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center,rgba(59,130,246,.5) 0%,transparent 65%)' }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
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
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.1] mb-5">
              Start Learning<br />
              <span
                className="transparent"
                style={{
                  background: 'linear-gradient(135deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                With Purpose.
              </span>
            </h2>
            <p className="text-base text-slate-400 leading-relaxed max-w-sm mb-10">
              Your personal AI guide turns ambitious learning goals into a clear, actionable roadmap — tailored to your schedule and skill level.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {PERKS.map((p, i) => {
                const Icon = p.icon;
                return (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                    className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/20 flex items-center justify-center mb-3">
                      <Icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <p className="text-xs font-bold text-white mb-1">{p.title}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{p.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
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
          className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right,rgba(124,58,237,.8) 0%,transparent 65%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-lg rounded-3xl border border-white/[0.08] bg-[#11141c]/85 p-6 shadow-xl shadow-black/20 sm:p-8"
        >
          {/* Mobile logo (hidden on desktop) */}
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
              Create Free Account
            </h1>
            <p className="text-sm text-slate-400">
              Start turning any ambition into structured mastery.{' '}
              <span className="text-emerald-400 font-semibold">Free forever.</span>
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
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 tracking-wide uppercase">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Alex Morgan"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0f0f1c] border border-white/[0.09] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/60 focus:shadow-[0_0_0_4px_rgba(124,58,237,.12)] transition-all"
                />
              </div>
            </div>

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
              <label className="block text-xs font-bold text-slate-300 mb-2 tracking-wide uppercase">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
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
              {/* Password strength hint */}
              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className={`h-1 w-8 rounded-full transition-all ${
                          form.password.length >= i * 3
                            ? form.password.length >= 9
                              ? 'bg-emerald-500'
                              : form.password.length >= 6
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                            : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {form.password.length < 6 ? 'Too short' : form.password.length < 9 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}
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
                  Creating Your Profile…
                </>
              ) : (
                <>Get Started Free <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Included list */}
          <div className="mt-6 p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20">
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-3">What's included — free</p>
            <div className="space-y-2">
              {INCLUDED.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
              Sign in →
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  );
}

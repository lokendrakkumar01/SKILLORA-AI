import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, PlayCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    setForm({ email: 'test@skillora.com', password: 'test123456' });
    setError('');
    setLoading(true);
    try {
      await login('test@skillora.com', 'test123456');
      navigate('/dashboard');
    } catch {
      setError('Could not connect with demo user. Please register a free account!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] hero-glow-1 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grid-background opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/25">
              <div className="w-full h-full bg-[#090912] rounded-[15px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              SKILLORA <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to access your custom roadmap and lessons
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-1 bg-gradient-to-b from-white/[0.12] to-white/[0.03] shadow-2xl">
          <div className="bg-[#0c0c16] rounded-[22px] p-7 sm:p-9 border border-white/[0.08]">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@domain.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#131322] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#131322] border border-white/[0.1] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 btn-primary-glow py-3.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In to Skillora'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Access Button */}
            <div className="mt-5 pt-5 border-t border-white/[0.06] text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5 text-violet-400" />
                Explore One-Click Demo Mode
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-violet-400 hover:text-violet-300 font-bold ml-1">
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = ['Free AI roadmap generation', 'Personalized lesson content', 'Progress tracking & analytics', 'AI tutor available 24/7'];

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 grid-bg">
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-white font-black text-lg">S</span>
            </div>
            <span className="text-white font-bold text-xl">SKILLORA AI</span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Start learning for free</h1>
          <p className="text-slate-400 text-sm">Join 50,000+ learners on their AI-guided journey</p>
        </div>

        <div className="bg-[#0F0F1A] border border-white/[0.07] rounded-2xl p-8 shadow-2xl shadow-black/40">
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full name" type="text" placeholder="Alex Johnson" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              icon={<User className="w-4 h-4" />} required />
            <Input label="Email address" type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              icon={<Mail className="w-4 h-4" />} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required minLength={6}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border bg-[#111118] text-slate-200 placeholder-slate-500 text-sm transition-all outline-none border-white/10 hover:border-violet-500/40 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <div className="grid grid-cols-2 gap-2">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  {perk}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

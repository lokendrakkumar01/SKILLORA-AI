import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, Flame, BookOpen, Trophy, TrendingUp, Plus, ArrowRight,
  Target, Clock, BarChart2, Star, CheckCircle2
} from 'lucide-react';
import { progressApi } from '../api/roadmaps';
import { ProtectedLayout } from '../components/layout/AppLayout';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressApi.overview()
      .then((res) => setOverview(res.data))
      .catch(() => setOverview(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total XP', value: overview?.xp || 0, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', suffix: '' },
    { label: 'Day Streak', value: overview?.streak || 0, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10', suffix: 'd' },
    { label: 'Lessons Done', value: overview?.totalLessons || 0, icon: BookOpen, color: 'text-violet-400', bg: 'bg-violet-500/10', suffix: '' },
    { label: 'Quiz Accuracy', value: overview?.quizAccuracy || 0, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10', suffix: '%' },
  ];

  // Build weekly chart data
  const activityData = (() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const map: Record<string, number> = {};
    (overview?.weeklyActivity || []).forEach((a: any) => {
      const day = new Date(a.date).toLocaleDateString('en-US', { weekday: 'short' });
      map[day] = (map[day] || 0) + a.minutesStudied;
    });
    return days.map((d) => ({ day: d, minutes: map[d] || 0 }));
  })();

  return (
    <ProtectedLayout title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-white">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {overview?.streak > 0 ? `🔥 You're on a ${overview.streak}-day streak! Keep it going.` : "Let's start learning today!"}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl border border-white/[0.06] bg-[#0F0F1A] hover:border-violet-500/20 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-black text-white">
                {loading ? <div className="shimmer h-7 w-16 rounded" /> : <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Roadmaps */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Active Learning Paths</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/onboarding')} icon={<Plus className="w-3.5 h-3.5" />}>
                New Path
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12"><LoadingSpinner size="lg" /></div>
            ) : !overview?.roadmaps?.length ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="p-10 rounded-2xl border border-dashed border-violet-500/25 text-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-violet-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No learning paths yet</h3>
                <p className="text-slate-400 text-sm mb-6">Create your first AI-generated roadmap and start your journey!</p>
                <Button variant="primary" onClick={() => navigate('/onboarding')} icon={<Zap className="w-4 h-4" />}>
                  Build My First Path
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {overview.roadmaps.map((rm: any, i: number) => (
                  <motion.div key={rm._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    onClick={() => navigate(`/roadmap/${rm._id}`)}
                    className="p-5 rounded-2xl border border-white/[0.06] bg-[#0F0F1A] hover:border-violet-500/30 cursor-pointer group transition-all hover:shadow-lg hover:shadow-black/30">
                    <div className="flex items-start gap-4">
                      <ProgressRing percentage={rm.completionPercentage || 0} size={60} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-white text-sm leading-tight">{rm.title}</h3>
                          <Badge variant={rm.status === 'completed' ? 'green' : 'violet'}>{rm.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 truncate">{rm.goal}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${rm.completionPercentage || 0}%` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" />
                          </div>
                          <span className="text-xs text-slate-400">{rm.completionPercentage || 0}%</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors mt-1 shrink-0" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Weekly Activity */}
            <Card>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-violet-400" /> Weekly Activity
              </h3>
              {loading ? (
                <div className="shimmer h-32 rounded-xl" />
              ) : (
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#e2e8f0', fontSize: 12 }} />
                    <Bar dataKey="minutes" fill="#7C3AED" radius={[4, 4, 0, 0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Achievements */}
            <Card>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> Recent Achievements
              </h3>
              {!overview?.achievements?.length ? (
                <div className="text-center py-4">
                  <Star className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Complete lessons to earn achievements!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {overview.achievements.map((ach: any) => (
                    <div key={ach._id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-xl">{ach.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white">{ach.title}</div>
                        <div className="text-[10px] text-slate-400">{ach.description}</div>
                      </div>
                      <Badge variant="amber">+{ach.xpBonus}</Badge>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="ghost" size="sm" onClick={() => navigate('/achievements')} className="w-full mt-3">
                View All <ArrowRight className="w-3 h-3" />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}

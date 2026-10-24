import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';
import { profileApi } from '../api/roadmaps';
import { ProtectedLayout } from '../components/layout/AppLayout';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AchievementIcon } from '../components/ui/AchievementIcon';

const ALL_ACHIEVEMENTS = [
  { type: 'first_lesson', title: 'First Step!', description: 'Complete your first lesson', xpBonus: 100 },
  { type: 'streak_3', title: '3-Day Streak!', description: 'Study 3 days in a row', xpBonus: 150 },
  { type: 'streak_7', title: 'Week Warrior!', description: 'Study 7 days in a row', xpBonus: 300 },
  { type: 'quiz_master', title: 'Quiz Master!', description: 'Pass 5 quizzes with 80%+', xpBonus: 200 },
  { type: 'roadmap_complete', title: 'Roadmap Explorer!', description: 'Complete a full roadmap', xpBonus: 500 },
  { type: 'lessons_10', title: 'Consistent Learner!', description: 'Complete 10 lessons', xpBonus: 250 },
];

export default function AchievementsPage() {
  const [earned, setEarned] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profileApi.get().then((res) => setEarned(res.data.achievements || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const earnedTypes = new Set(earned.map((a: any) => a.type));

  if (loading) return (
    <ProtectedLayout title="Achievements">
      <div className="flex items-center justify-center h-96"><LoadingSpinner size="lg" /></div>
    </ProtectedLayout>
  );

  return (
    <ProtectedLayout title="Achievements">
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" /> Achievements
          </h1>
          <p className="text-sm text-slate-400 mt-1">{earned.length} of {ALL_ACHIEVEMENTS.length} unlocked</p>
        </motion.div>

        {/* Progress bar */}
        <div className="p-5 rounded-2xl border border-white/[0.06] bg-[#0F0F1A]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Collection Progress</span>
            <span className="text-xs text-violet-300 font-bold">{Math.round((earned.length / ALL_ACHIEVEMENTS.length) * 100)}%</span>
          </div>
          <div className="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${(earned.length / ALL_ACHIEVEMENTS.length) * 100}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-violet-500 to-amber-500 rounded-full" />
          </div>
        </div>

        {/* Achievements grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {ALL_ACHIEVEMENTS.map((ach, i) => {
            const isEarned = earnedTypes.has(ach.type);
            return (
              <motion.div key={ach.type}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`p-5 rounded-2xl border transition-all ${
                  isEarned
                    ? 'border-amber-500/25 bg-amber-500/5 shadow-lg shadow-amber-500/5'
                    : 'border-white/[0.06] bg-[#0D0D18] opacity-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${isEarned ? 'bg-gradient-to-br from-violet-500/15 to-orange-500/10 text-violet-300' : 'bg-white/[.04] text-slate-600'}`}>
                    <AchievementIcon type={ach.type} className={`h-6 w-6 ${isEarned ? '' : 'opacity-60'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold ${isEarned ? 'text-white' : 'text-slate-500'}`}>{ach.title}</h3>
                      {isEarned && <Badge variant="amber">Earned!</Badge>}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{ach.description}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs">
                      <Zap className={`w-3 h-3 ${isEarned ? 'text-amber-400' : 'text-slate-600'}`} />
                      <span className={isEarned ? 'text-amber-300' : 'text-slate-600'}>+{ach.xpBonus} XP</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ProtectedLayout>
  );
}

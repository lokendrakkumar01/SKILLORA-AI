import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Zap, Flame, BookOpen, Trophy, Save, Camera } from 'lucide-react';
import { profileApi } from '../api/roadmaps';
import { ProtectedLayout } from '../components/layout/AppLayout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    if (user) setForm({ name: user.name, bio: user.bio || '' });
    profileApi.get().then((res) => {
      setAchievements(res.data.achievements || []);
    }).catch(() => {});
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await profileApi.update(form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const stats = [
    { label: 'Total XP', value: user.xp, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Day Streak', value: user.streak, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Lessons', value: user.totalLessonsCompleted || 0, icon: BookOpen, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Achievements', value: achievements.length, icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <ProtectedLayout title="Profile">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#111118] to-[#0D0D18] text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-xl shadow-violet-500/20">
              <span className="text-white font-black text-3xl">{user.name[0]?.toUpperCase()}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#111118] border border-white/10 flex items-center justify-center cursor-pointer hover:border-violet-500/40 transition-colors">
              <Camera className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">{user.name}</h1>
          <p className="text-sm text-slate-400 mt-1">{user.email}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Badge variant="violet">{user.level}</Badge>
            <Badge variant="amber" icon={<Zap className="w-3 h-3" />}>{user.xp} XP</Badge>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="p-4 rounded-2xl border border-white/[0.06] bg-[#0F0F1A] text-center">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Edit profile */}
        <Card>
          <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-violet-400" /> Edit Profile
          </h2>
          <div className="space-y-4">
            <Input label="Full Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              icon={<User className="w-4 h-4" />} />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us about your learning journey..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border bg-[#111118] text-slate-200 placeholder-slate-500 text-sm outline-none border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 resize-none transition-all" />
            </div>
            <Button variant="primary" loading={saving} onClick={handleSave} icon={<Save className="w-4 h-4" />}>
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Achievements */}
        {achievements.length > 0 && (
          <Card>
            <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" /> Achievements Earned
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {achievements.map((ach: any) => (
                <div key={ach._id} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-2xl">{ach.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{ach.title}</div>
                    <div className="text-xs text-slate-400">{ach.description}</div>
                  </div>
                  <Badge variant="amber">+{ach.xpBonus}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </ProtectedLayout>
  );
}

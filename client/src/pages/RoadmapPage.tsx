import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, ChevronRight, CheckCircle2, Lock, PlayCircle, Clock,
  Zap, ArrowLeft, RefreshCw, BookOpen, Target
} from 'lucide-react';
import { roadmapsApi } from '../api/roadmaps';
import { ProtectedLayout } from '../components/layout/AppLayout';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function RoadmapPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    if (!id) return;
    roadmapsApi.get(id)
      .then((res) => setRoadmap(res.data.roadmap))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  const togglePhase = (i: number) => {
    setExpandedPhases((prev) => {
      const s = new Set(prev);
      s.has(i) ? s.delete(i) : s.add(i);
      return s;
    });
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'in_progress':
      case 'available': return <PlayCircle className="w-4 h-4 text-violet-400" />;
      default: return <Lock className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  if (loading) return (
    <ProtectedLayout title="Roadmap">
      <div className="flex items-center justify-center h-96"><LoadingSpinner size="lg" /></div>
    </ProtectedLayout>
  );

  if (!roadmap) return null;

  // Count totals
  let totalSteps = 0, completedSteps = 0;
  roadmap.phases?.forEach((p: any) => p.modules?.forEach((m: any) => m.steps?.forEach((s: any) => {
    totalSteps++;
    if (s.status === 'completed') completedSteps++;
  })));

  return (
    <ProtectedLayout title={roadmap.title}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#111118] to-[#0D0D18]">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <ProgressRing percentage={roadmap.completionPercentage || 0} size={90} strokeWidth={7} />
            <div className="flex-1">
              <h1 className="text-2xl font-black text-white">{roadmap.title}</h1>
              <p className="text-sm text-slate-400 mt-1">{roadmap.description || roadmap.goal}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge variant="violet">{roadmap.level}</Badge>
                <Badge variant="dark" icon={<Clock className="w-3 h-3" />}>{roadmap.estimatedDays} days</Badge>
                <Badge variant="dark" icon={<BookOpen className="w-3 h-3" />}>{totalSteps} lessons</Badge>
                <Badge variant="dark" icon={<Zap className="w-3 h-3" />}>{completedSteps}/{totalSteps} done</Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Phases */}
        <div className="space-y-3">
          {roadmap.phases?.map((phase: any, pi: number) => {
            const isOpen = expandedPhases.has(pi);
            let phaseTotal = 0, phaseDone = 0;
            phase.modules?.forEach((m: any) => m.steps?.forEach((s: any) => {
              phaseTotal++;
              if (s.status === 'completed') phaseDone++;
            }));
            const phasePercent = phaseTotal > 0 ? Math.round((phaseDone / phaseTotal) * 100) : 0;

            return (
              <motion.div key={pi} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pi * 0.08 }}
                className="border border-white/[0.06] rounded-2xl overflow-hidden bg-[#0D0D18]">
                {/* Phase header */}
                <button onClick={() => togglePhase(pi)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/[0.02] transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                    phaseDone === phaseTotal && phaseTotal > 0
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-violet-500/15 text-violet-400'
                  }`}>
                    {phaseDone === phaseTotal && phaseTotal > 0 ? <CheckCircle2 className="h-5 w-5" /> : `P${pi + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm">{phase.title}</h3>
                    <p className="text-xs text-slate-400 truncate">{phase.description}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="text-xs text-slate-400">{phaseDone}/{phaseTotal}</div>
                    <div className="w-16 h-1.5 bg-white/[0.06] rounded-full">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${phasePercent}%` }} />
                    </div>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </motion.div>
                </button>

                {/* Phase content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden">
                      <div className="px-5 pb-5 space-y-4">
                        {phase.modules?.map((mod: any, mi: number) => (
                          <div key={mi} className="space-y-2">
                            <div className="flex items-center gap-2 ml-2">
                              <Target className="w-3.5 h-3.5 text-slate-500" />
                              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">{mod.title}</h4>
                              <span className="text-[10px] text-slate-500">{mod.estimatedHours}h est.</span>
                            </div>
                            <div className="space-y-1.5 ml-1">
                              {mod.steps?.map((step: any, si: number) => {
                                const isClickable = step.status === 'available' || step.status === 'in_progress' || step.status === 'completed';
                                return (
                                  <motion.div key={si}
                                    whileHover={isClickable ? { x: 4 } : undefined}
                                    onClick={() => isClickable && navigate(`/lesson/${id}/${step._id}`)}
                                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                                      step.status === 'completed'
                                        ? 'bg-emerald-500/5 border-emerald-500/15 cursor-pointer'
                                        : step.status === 'available' || step.status === 'in_progress'
                                        ? 'bg-violet-500/10 border-violet-500/25 cursor-pointer hover:border-violet-500/40 shadow-sm'
                                        : 'bg-white/[0.01] border-white/[0.04] opacity-50 cursor-not-allowed'
                                    }`}
                                  >
                                    <div className="shrink-0">{getStepIcon(step.status)}</div>
                                    <div className="flex-1 min-w-0">
                                      <div className={`text-sm font-medium ${step.status === 'locked' ? 'text-slate-600' : 'text-white'}`}>
                                        {step.title}
                                      </div>
                                      <div className="text-xs text-slate-500 truncate mt-0.5">{step.description}</div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                      {step.quizQuestions?.length > 0 && (
                                        <Badge variant="cyan" size="sm">Quiz</Badge>
                                      )}
                                      <span className="text-[10px] text-slate-500">{step.estimatedMinutes}m</span>
                                      <Badge variant="dark" size="sm">+{step.xpReward || 50} XP</Badge>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </ProtectedLayout>
  );
}

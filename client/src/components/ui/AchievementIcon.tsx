import { Award, BookOpen, Brain, Flame, Map, Target, Zap } from 'lucide-react';

const ICONS = {
  first_lesson: Target,
  streak_3: Flame,
  streak_7: Zap,
  quiz_master: Brain,
  roadmap_complete: Map,
  lessons_10: BookOpen,
};

export function AchievementIcon({ type, className = 'h-6 w-6' }: { type: string; className?: string }) {
  const Icon = ICONS[type as keyof typeof ICONS] || Award;
  return <Icon className={className} aria-hidden="true" />;
}

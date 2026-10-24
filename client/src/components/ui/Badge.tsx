import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'violet' | 'blue' | 'green' | 'amber' | 'red' | 'dark' | 'cyan';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({ children, variant = 'violet', size = 'sm', icon, className = '' }: BadgeProps) {
  const variants = {
    violet: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
    blue: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
    red: 'bg-red-500/15 text-red-300 border-red-500/25',
    dark: 'bg-white/5 text-slate-400 border-white/10',
    cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  };
  const sizes = { sm: 'text-xs px-2 py-0.5', md: 'text-sm px-3 py-1' };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </span>
  );
}

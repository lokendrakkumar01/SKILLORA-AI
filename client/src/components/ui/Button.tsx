import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children, variant = 'primary', size = 'md', loading = false, icon, className = '', disabled, ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#0A0A0F] disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-500 hover:to-blue-500 shadow-lg hover:shadow-violet-500/30 active:scale-95',
    secondary: 'bg-[#1E1E3F] text-slate-200 border border-[#2D2D5E] hover:bg-[#252545] hover:border-violet-500/50 active:scale-95',
    outline: 'border border-violet-500 text-violet-400 hover:bg-violet-500/10 active:scale-95',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-95',
    danger: 'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 active:scale-95',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
    </motion.button>
  );
}

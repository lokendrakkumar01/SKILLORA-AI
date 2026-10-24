import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
  delay?: number;
}

export function Card({ children, className = '', hover = false, glow = false, onClick, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hover ? { y: -4, borderColor: 'rgba(124,58,237,0.4)' } : undefined}
      onClick={onClick}
      className={`rounded-2xl border border-white/[0.08] bg-[#12151e] p-6 transition-all duration-300
        ${hover ? 'cursor-pointer hover:shadow-lg hover:shadow-black/25 hover:border-violet-400/25' : ''}
        ${glow ? 'shadow-[0_12px_36px_-24px_rgba(124,58,237,0.35)]' : ''}
        ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function GlowCard({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2, boxShadow: '0 16px 42px rgba(124,58,237,0.12)' }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#171b26] to-[#12151e] p-6 cursor-pointer transition-colors hover:border-violet-400/30 ${className}`}
    >
      {children}
    </motion.div>
  );
}

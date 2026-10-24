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
      className={`rounded-2xl border border-white/[0.06] bg-[#111118] p-6 transition-all duration-300
        ${hover ? 'cursor-pointer hover:shadow-xl hover:shadow-black/40 hover:border-violet-500/30' : ''}
        ${glow ? 'shadow-[0_0_30px_rgba(124,58,237,0.15)]' : ''}
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
      whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(124,58,237,0.2)' }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`rounded-2xl border border-white/[0.07] bg-gradient-to-b from-[#1A1A2E] to-[#111118] p-6 cursor-pointer transition-colors hover:border-violet-500/40 ${className}`}
    >
      {children}
    </motion.div>
  );
}

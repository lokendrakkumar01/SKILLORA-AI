import React from 'react';

export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg className="animate-spin w-full h-full" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#7C3AED" strokeWidth="3" />
        <path className="opacity-90" fill="#7C3AED" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-[#0A0A0F] flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center animate-pulse-glow">
          <span className="text-white font-black text-xl">S</span>
        </div>
        <LoadingSpinner size="lg" />
        <p className="text-slate-400 text-sm animate-pulse">Loading SKILLORA AI...</p>
      </div>
    </div>
  );
}

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
        )}
        <input
          className={`w-full rounded-xl border bg-[#111118] text-slate-200 placeholder-slate-500
            px-4 py-3 text-sm transition-all duration-200 outline-none
            border-white/10 hover:border-violet-500/40 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/60 focus:border-red-500' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

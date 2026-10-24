import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Map, Trophy, User, LogOut, Menu, X, Zap, Flame, Sparkles, ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#paths', label: 'Learning Paths' },
  { href: '#tutor', label: 'AI Tutor' },
  { href: '#faq', label: 'FAQ' },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07070b]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/60'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/50 transition-all">
            <div className="w-full h-full bg-[#090912] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-lg tracking-tight flex items-center gap-1.5">
              SKILLORA <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-0.5 tracking-wider uppercase font-medium">Learn Step-by-Step</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-full px-5 py-1.5 backdrop-blur-md">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-white/[0.06] transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors"
          >
            Sign In
          </Link>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
            className="btn-primary-glow px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            Get Started Free
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a12]/95 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-6 space-y-4 shadow-2xl"
          >
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-2.5 text-sm font-medium text-slate-300 hover:text-white border-b border-white/[0.04]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                to="/login"
                className="w-full text-center py-2.5 rounded-xl border border-white/10 text-slate-200 text-xs font-semibold hover:bg-white/[0.05]"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2.5 rounded-xl btn-primary-glow text-white text-xs font-bold"
                onClick={() => setMenuOpen(false)}
              >
                Get Started Free →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

const APP_NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/roadmaps', label: 'My Roadmaps', icon: Map },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col bg-[#090910] border-r border-white/[0.08] transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-18 flex items-center px-5 border-b border-white/[0.08] justify-between">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-violet-500/30">
              S
            </div>
            <span className="text-white font-bold text-sm tracking-tight">SKILLORA AI</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.05] ml-auto"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 p-3.5 space-y-1.5">
        {APP_NAV.map(({ href, label, icon: Icon }) => {
          const active = location.pathname === href || (href !== '/dashboard' && location.pathname.startsWith(href));
          return (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-violet-300 border border-violet-500/30 shadow-md shadow-violet-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-violet-400" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {user && !collapsed && (
        <div className="p-4 border-t border-white/[0.08] bg-[#0c0c16]/50">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-blue-500 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <span className="flex items-center gap-0.5 text-amber-300 font-semibold">
                  <Zap className="w-3 h-3 text-amber-400" />
                  {user.xp || 0} XP
                </span>
                {user.streak > 0 && (
                  <span className="flex items-center gap-0.5 text-orange-300 font-semibold">
                    <Flame className="w-3 h-3 text-orange-400" />
                    {user.streak}d
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}

export function AppTopbar({ title }: { title?: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-white/[0.08] flex items-center justify-between px-6 bg-[#07070b]/60 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center font-bold text-white text-xs">
              S
            </div>
          </Link>
        </div>
        {title && <h1 className="text-sm font-bold text-slate-200 tracking-tight">{title}</h1>}
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs bg-white/[0.03] border border-white/[0.06] px-3.5 py-1.5 rounded-full">
            <span className="flex items-center gap-1.5 font-bold text-amber-300">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {user.xp} XP
            </span>
            <div className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1.5 font-bold text-orange-300">
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              {user.streak} Days Streak
            </span>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold hover:scale-105 transition-transform shadow-md shadow-violet-500/25"
          >
            {user.name?.[0]?.toUpperCase() || 'U'}
          </button>
        </div>
      )}
    </header>
  );
}

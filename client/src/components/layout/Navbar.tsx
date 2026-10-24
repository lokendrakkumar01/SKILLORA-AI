import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, LayoutDashboard, Map, Trophy, User, LogOut, Menu, X, Zap, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#paths', label: 'Learning Paths' },
  { href: '#faq', label: 'FAQ' },
];

export function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <span className="text-white font-black text-sm">S</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            SKILLORA <span className="text-gradient-violet">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
            Sign In
          </Link>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/register')}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-violet-500/20"
          >
            Get Started Free
          </motion.button>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-400">
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-white/[0.06] px-4 pb-4"
          >
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href}
                className="block py-3 text-slate-400 hover:text-white border-b border-white/[0.05] text-sm"
                onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Link to="/login" className="text-center py-2 text-slate-400 text-sm">Sign In</Link>
              <Link to="/register" className="text-center py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold">
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
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
    <aside className={`hidden lg:flex flex-col bg-[#0D0D14] border-r border-white/[0.06] transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="h-16 flex items-center px-4 border-b border-white/[0.06] justify-between">
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">S</span>
            </div>
            <span className="text-white font-bold text-sm">SKILLORA AI</span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-slate-500 hover:text-slate-300 ml-auto">
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {APP_NAV.map(({ href, label, icon: Icon }) => {
          const active = location.pathname === href || location.pathname.startsWith(href + '/');
          return (
            <Link key={href} to={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${active ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'}`}>
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {user && !collapsed && (
        <div className="p-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user.name[0]?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{user.xp} XP</span>
                {user.streak > 0 && (
                  <>
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span>{user.streak}d</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}

export function AppTopbar({ title }: { title?: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-6 bg-[#0A0A0F]/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="lg:hidden">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-xs">S</span>
            </div>
          </Link>
        </div>
        {title && <h1 className="text-sm font-semibold text-slate-200">{title}</h1>}
      </div>
      {user && (
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-amber-300">{user.xp} XP</span>
            {user.streak > 0 && (
              <>
                <Flame className="w-3.5 h-3.5 text-orange-400 ml-1" />
                <span className="text-orange-300">{user.streak} day streak</span>
              </>
            )}
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity">
            {user.name[0]?.toUpperCase()}
          </button>
        </div>
      )}
    </header>
  );
}

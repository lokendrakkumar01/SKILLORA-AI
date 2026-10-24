import React from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppMobileNav, AppSidebar, AppTopbar } from './Navbar';
import { PageLoader } from '../ui/LoadingSpinner';
import { GlobalAiAssistant } from '../ai/GlobalAiAssistant';

export function ProtectedLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell flex h-dvh overflow-hidden">
      <AppSidebar />
      <div className="app-shell__content flex-1 flex flex-col overflow-hidden min-w-0">
        <AppTopbar title={title} />
        <main className="app-main flex-1 overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="app-main__inner"
          >
            {children}
          </motion.div>
        </main>
        <AppMobileNav />
      </div>
      <GlobalAiAssistant />
    </div>
  );
}

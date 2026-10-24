import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppSidebar, AppTopbar } from './Navbar';
import { PageLoader } from '../ui/LoadingSpinner';

export function ProtectedLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const { user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen bg-[#0A0A0F] overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppTopbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

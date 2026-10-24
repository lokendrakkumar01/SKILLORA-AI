import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 grid-bg">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md">
        <div className="text-8xl font-black text-gradient mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" icon={<Home className="w-4 h-4" />}>Go Home</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="secondary" icon={<ArrowLeft className="w-4 h-4" />}>Dashboard</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

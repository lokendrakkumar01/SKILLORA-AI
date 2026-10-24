import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth';

interface User {
  _id: string;
  name: string;
  email: string;
  xp: number;
  streak: number;
  level: string;
  avatar?: string;
  bio?: string;
  totalLessonsCompleted: number;
  preferences: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (u: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('skillora_token');
    if (token) {
      authApi.me()
        .then((res) => setUser(res.data.user))
        .catch(() => localStorage.removeItem('skillora_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('skillora_token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authApi.register({ name, email, password });
    localStorage.setItem('skillora_token', res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    authApi.logout().catch(() => {});
    localStorage.removeItem('skillora_token');
    setUser(null);
    window.location.href = '/';
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...updates } : null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

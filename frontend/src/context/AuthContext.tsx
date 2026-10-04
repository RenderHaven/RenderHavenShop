import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { authApi } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (phone: string, otp?: string, password?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('rhs_token')
  );
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('rhs_token'));

  const refreshUser = useCallback(async () => {
    const userId = localStorage.getItem('rhs_user_id');
    if (!userId) return;
    try {
      const data = (await authApi.getUser(userId)) as { user: User };
      setUser(data.user ?? (data as unknown as User));
    } catch {
      // token may be expired — clear
      logout();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [token, refreshUser]);

  const login = useCallback(
    async (phone: string, otp?: string, password?: string) => {
      const res = await authApi.login({ phone, otp, password });
      const { token: newToken, user: userData } = res as { token: string; user: User };
      localStorage.setItem('rhs_token', newToken);
      localStorage.setItem('rhs_user_id', (userData as User).id);
      setToken(newToken);
      setUser(userData as User);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('rhs_token');
    localStorage.removeItem('rhs_user_id');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}


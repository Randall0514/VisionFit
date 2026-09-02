import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '../api';
import useSessionTimeout from '../hooks/useSessionTimeout';

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  sessionWarning: boolean;
  sessionExpired: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  dismissSessionWarning: () => void;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      api.getMe()
        .then((data) => {
          if (data.user.role === 'admin') {
            setUser(data.user);
          } else {
            localStorage.removeItem('admin_token');
          }
        })
        .catch(() => localStorage.removeItem('admin_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    setUser(null);
    setSessionWarning(false);
    setSessionExpired(true);
  }, []);

  const handleWarning = useCallback(() => {
    setSessionWarning(true);
  }, []);

  const handleTimeout = useCallback(() => {
    logout();
  }, [logout]);

  const { dismissWarning } = useSessionTimeout({
    onWarning: handleWarning,
    onTimeout: handleTimeout,
    enabled: !!user,
  });

  const dismissSessionWarning = useCallback(() => {
    setSessionWarning(false);
    dismissWarning();
  }, [dismissWarning]);

  const clearSessionExpired = useCallback(() => {
    setSessionExpired(false);
  }, []);

  const login = async (email: string, password: string) => {
    const result = await api.login(email, password);
    if (result.user.role !== 'admin') {
      throw new Error('Access denied. Admin only.');
    }
    localStorage.setItem('admin_token', result.token);
    setUser(result.user);
    setSessionExpired(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, sessionWarning, sessionExpired, login, logout, dismissSessionWarning, clearSessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

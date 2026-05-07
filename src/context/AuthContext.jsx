import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  const _clear = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  // On mount, validate the stored token by calling /auth/me
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.me()
        .then(userData => {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        })
        .catch(() => {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            authService.refresh(refreshToken)
              .then(res => {
                localStorage.setItem('token', res.accessToken);
                localStorage.setItem('refreshToken', res.refreshToken);
                setUser(res.user);
                localStorage.setItem('user', JSON.stringify(res.user));
              })
              .catch(() => _clear());
          } else {
            _clear();
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [_clear]);

  // Returns { success, user } or { success: false, message }
  const login = useCallback(async (email, password) => {
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('token', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  }, []);

  // Returns { success } or { success: false, message }
  const signup = useCallback(async (name, email, password) => {
    try {
      await authService.register(name, email, password);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      if (refreshToken) await authService.logout(refreshToken);
    } catch { /* ignore */ }
    _clear();
  }, [_clear]);

  const isAdmin = user?.role === 'ADMIN';
  const isAuthenticated = !!user;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
            <svg className="w-7 h-7 text-white fill-white" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <p className="text-slate-500 text-sm font-medium animate-pulse">Loading TaskFlow...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

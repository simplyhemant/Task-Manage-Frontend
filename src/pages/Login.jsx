import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Mail, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button, Card, cn } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const fillAdmin = () => { setEmail('admin@taskflow.com'); setPassword('admin123'); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[45%] h-[45%] bg-purple-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[440px] space-y-6 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-300/40">
            <svg className="w-8 h-8 text-white fill-white" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">TaskFlow</h1>
            <p className="text-slate-500 text-sm mt-1 max-w-[280px]">Efficiency and clarity for high-performance teams.</p>
          </div>
        </div>

        <Card className="p-0 shadow-2xl shadow-indigo-100/60 border border-slate-200/60 overflow-hidden">
          {/* Tab Nav */}
          <div className="flex border-b border-slate-100">
            <button className="flex-1 py-4 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/40">
              Sign In
            </button>
            <Link to="/register" className="flex-1 py-4 text-sm font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors text-center">
              Sign Up
            </Link>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to access your workspace.</p>
            </div>

            {justRegistered && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                <CheckCircle2 size={16} className="shrink-0" />
                Account created! Please sign in.
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
                  <input
                    type="email" required
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-xs font-semibold text-indigo-600 hover:underline">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200/50"
                isLoading={isLoading}
              >
                Sign in to Dashboard
              </Button>
            </form>

            {/* Quick Admin Fill */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center mb-3 font-medium">Demo Credentials</p>
              <button onClick={fillAdmin}
                className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors group">
                <div className="text-left">
                  <p className="text-xs font-bold text-indigo-700">Admin Account</p>
                  <p className="text-[11px] text-indigo-500">admin@taskflow.com • admin123</p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-600 text-white px-2 py-1 rounded-lg">Fill</span>
              </button>
            </div>
          </div>
        </Card>

        <p className="text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

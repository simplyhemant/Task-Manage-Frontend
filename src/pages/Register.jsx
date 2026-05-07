import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button, Card, cn } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    let strength = 0;
    if (val.length >= 6) strength += 25;
    if (val.match(/[A-Z]/)) strength += 25;
    if (val.match(/[0-9]/)) strength += 25;
    if (val.match(/[^A-Za-z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    setError('');

    const result = await signup(name, email, password);
    if (result.success) {
      navigate('/login', { state: { registered: true } });
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const strengthLabel = passwordStrength >= 100 ? 'Very Strong' : passwordStrength >= 75 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : passwordStrength >= 25 ? 'Weak' : '';
  const strengthColor = passwordStrength >= 75 ? 'text-emerald-500' : passwordStrength >= 50 ? 'text-amber-500' : 'text-red-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-purple-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[480px] space-y-6 relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-300/40">
            <svg className="w-8 h-8 text-white fill-white" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">TaskFlow</h1>
            <p className="text-slate-500 text-sm mt-1">Create your account and start managing projects.</p>
          </div>
        </div>

        <Card className="p-0 shadow-2xl shadow-indigo-100/60 border border-slate-200/60 overflow-hidden">
          {/* Tab Nav */}
          <div className="flex border-b border-slate-100">
            <Link to="/login" className="flex-1 py-4 text-sm font-semibold text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors text-center">
              Sign In
            </Link>
            <button className="flex-1 py-4 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/40">
              Sign Up
            </button>
          </div>

          <div className="p-8 space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create Account</h2>
              <p className="text-sm text-slate-500 mt-1">Join thousands of teams using TaskFlow.</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-fade-in">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
                  <input
                    type="text" required minLength={3}
                    placeholder="Alex Rivera"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
                  <input
                    type="email" required
                    placeholder="alex@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password + Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
                    <input
                      type={showPassword ? 'text' : 'password'} required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                      onChange={handlePasswordChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
                    <input
                      type={showPassword ? 'text' : 'password'} required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Password Strength</span>
                    <span className={strengthColor}>{strengthLabel}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    {[25, 50, 75, 100].map((threshold, i) => (
                      <div key={i} className={cn(
                        "h-full flex-1 rounded-full transition-all duration-300",
                        passwordStrength >= threshold
                          ? threshold <= 25 ? "bg-red-400" : threshold <= 50 ? "bg-amber-400" : "bg-emerald-500"
                          : "bg-slate-200"
                      )} />
                    ))}
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="flex items-center gap-3 pt-1">
                <input type="checkbox" id="terms" required
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                <label htmlFor="terms" className="text-xs text-slate-500 cursor-pointer">
                  I agree to the <a href="#" className="text-indigo-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 font-semibold hover:underline">Privacy Policy</a>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200/50 mt-2"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>
          </div>
        </Card>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

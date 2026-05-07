import React, { useState } from 'react';
import { User, Lock, Save, Loader } from 'lucide-react';
import { Card } from '../components/UI';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

export const Settings = () => {
  const { user, login } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', profileImageUrl: user?.profileImageUrl || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg('');
    setProfileError('');
    try {
      await userService.updateProfile(profileForm);
      setProfileMsg('Profile updated successfully!');
    } catch (err) {
      setProfileError(err.message);
    }
    setProfileLoading(false);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg('');
    setPasswordError('');
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordMsg('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message);
    }
    setPasswordLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <User size={20} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Profile Information</h3>
            <p className="text-xs text-slate-500">Update your name and profile picture</p>
          </div>
        </div>

        {profileMsg && <div className="bg-emerald-50 text-emerald-600 text-sm px-4 py-2 rounded-lg mb-4 border border-emerald-200">{profileMsg}</div>}
        {profileError && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4 border border-red-200">{profileError}</div>}

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Your name" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
            <input value={user?.email || ''} disabled
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
            <input value={user?.role || ''} disabled
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
          </div>
          <button type="submit" disabled={profileLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
            {profileLoading ? <Loader size={14} className="animate-spin" /> : <Save size={14} />}
            Save Profile
          </button>
        </form>
      </Card>

      {/* Password Settings */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Lock size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Change Password</h3>
            <p className="text-xs text-slate-500">Use a strong password with at least 8 characters</p>
          </div>
        </div>

        {passwordMsg && <div className="bg-emerald-50 text-emerald-600 text-sm px-4 py-2 rounded-lg mb-4 border border-emerald-200">{passwordMsg}</div>}
        {passwordError && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4 border border-red-200">{passwordError}</div>}

        <form onSubmit={handlePasswordSave} className="space-y-4">
          {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label className="block text-xs font-bold text-slate-700 mb-1 capitalize">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input type="password" required minLength={field !== 'currentPassword' ? 8 : 1}
                value={passwordForm[field]}
                onChange={e => setPasswordForm(f => ({ ...f, [field]: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••" />
            </div>
          ))}
          <button type="submit" disabled={passwordLoading}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
            {passwordLoading ? <Loader size={14} className="animate-spin" /> : <Lock size={14} />}
            Change Password
          </button>
        </form>
      </Card>
    </div>
  );
};

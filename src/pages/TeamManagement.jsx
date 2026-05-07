import React, { useEffect, useState, useCallback } from 'react';
import { Users, Shield, UserX, Loader, Crown } from 'lucide-react';
import { Card, Badge } from '../components/UI';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const roleColor = { ADMIN: 'indigo', USER: 'slate' };

export const TeamManagement = () => {
  const { user: currentUser, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = useCallback(() => {
    setLoading(true);
    userService.getAll()
      .then(setUsers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handlePromote = async (id) => {
    if (!confirm('Promote this user to ADMIN?')) return;
    try {
      await userService.update(id, { role: 'ADMIN' });
      loadUsers();
    } catch (e) { setError(e.message); }
  };

  const handleDemote = async (id) => {
    if (!confirm('Demote this user to USER?')) return;
    try {
      await userService.update(id, { role: 'USER' });
      loadUsers();
    } catch (e) { setError(e.message); }
  };

  const handleDeactivate = async (id) => {
    if (!confirm('Deactivate this user? They will no longer be able to log in.')) return;
    try {
      await userService.deactivate(id);
      loadUsers();
    } catch (e) { setError(e.message); }
  };

  if (!isAdmin) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Shield size={48} className="text-slate-300" />
      <p className="text-slate-500 font-medium">Admin access required</p>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader className="animate-spin text-indigo-600" size={32} /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          Team Management <Shield size={20} className="text-indigo-600" />
        </h2>
        <p className="text-slate-500 text-sm mt-1">{users.length} active user{users.length !== 1 ? 's' : ''} in the system</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">{error}</div>}

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
                        {u.name}
                        {u.id === currentUser?.id && <span className="text-[10px] text-indigo-500 font-bold">(you)</span>}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                <td className="px-6 py-4">
                  <Badge variant={roleColor[u.role] || 'slate'} className="flex items-center gap-1 w-fit">
                    {u.role === 'ADMIN' && <Crown size={10} />}
                    {u.role}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={u.isActive ? 'emerald' : 'red'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-6 py-4">
                  {u.id !== currentUser?.id && (
                    <div className="flex gap-2 justify-end">
                      {u.role === 'USER' ? (
                        <button onClick={() => handlePromote(u.id)}
                          className="text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium transition-colors flex items-center gap-1">
                          <Crown size={12} /> Promote
                        </button>
                      ) : (
                        <button onClick={() => handleDemote(u.id)}
                          className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors">
                          Demote
                        </button>
                      )}
                      {u.isActive && (
                        <button onClick={() => handleDeactivate(u.id)}
                          className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors flex items-center gap-1">
                          <UserX size={12} /> Deactivate
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

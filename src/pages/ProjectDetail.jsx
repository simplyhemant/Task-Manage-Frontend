import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, Users, List, Layout,
  Calendar, CheckCircle2, Clock, Loader, UserPlus, X
} from 'lucide-react';
import { Card, Badge, Avatar, Button, cn } from '../components/UI';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';

const statusColor = { TODO: 'slate', IN_PROGRESS: 'indigo', DONE: 'emerald' };
const priorityColor = { HIGH: 'red', MEDIUM: 'amber', LOW: 'slate' };
const statusVariant = { ACTIVE: 'emerald', ON_HOLD: 'amber', COMPLETED: 'indigo', ARCHIVED: 'slate' };

/* ── Create Task Modal ── */
const CreateTaskModal = ({ projectId, members, onClose, onCreated }) => {
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskService.create({
        ...form,
        projectId: Number(projectId),
        assignedToId: form.assignedToId ? Number(form.assignedToId) : null,
        dueDate: form.dueDate || null,
      });
      onCreated();
      onClose();
    } catch (err) { setError(err.message); }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-slate-900">Create Task</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Task title..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 h-20 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                {['LOW', 'MEDIUM', 'HIGH'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assign To</label>
            <select value={form.assignedToId} onChange={e => setForm(f => ({ ...f, assignedToId: e.target.value }))}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Unassigned</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ── Add Member Modal ── */
const AddMemberModal = ({ projectId, existingMemberIds, onClose, onAdded }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    userService.getAll().then(setUsers).catch(() => {});
  }, []);

  const filtered = users.filter(u =>
    !existingMemberIds.includes(u.id) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = async (userId) => {
    setAdding(userId);
    try {
      await projectService.addMember(projectId, userId);
      onAdded();
      onClose();
    } catch (err) { alert(err.message); }
    setAdding(null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-900">Add Member</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-3" />
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {filtered.length === 0
            ? <p className="text-center text-slate-400 py-8 text-sm">No users found</p>
            : filtered.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                </div>
                <button onClick={() => handleAdd(u.id)} disabled={adding === u.id}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-60">
                  {adding === u.id ? '...' : 'Add'}
                </button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
export const ProjectDetail = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [viewMode, setViewMode] = useState('List');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [error, setError] = useState('');

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, t, m] = await Promise.all([
        projectService.getById(id),
        projectService.getTasks(id),
        projectService.getMembers(id),
      ]);
      setProject(p);
      setTasks(t);
      setMembers(m);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [id]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateStatus(taskId, newStatus);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (e) { alert(e.message); }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member from the project?')) return;
    try {
      await projectService.removeMember(id, userId);
      loadAll();
    } catch (e) { alert(e.message); }
  };

  const isOwner = project?.owner?.email === user?.email;
  const canManage = isAdmin || isOwner;
  const memberIds = members.map(m => m.id);

  const done = tasks.filter(t => t.status === 'DONE').length;
  const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;

  if (loading) return <div className="flex items-center justify-center h-64"><Loader className="animate-spin text-indigo-600" size={32} /></div>;
  if (error) return <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">{error}</div>;
  if (!project) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/projects" className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-300 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
              <Badge variant={statusVariant[project.status] || 'slate'}>{project.status?.replace('_', ' ')}</Badge>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Owner: <span className="font-medium">{project.owner?.name}</span>
              {project.startDate && <span className="ml-3 flex items-center gap-1 inline-flex"><Calendar size={12} /> {project.startDate}{project.endDate ? ` → ${project.endDate}` : ''}</span>}
            </p>
          </div>
        </div>
        {canManage && (
          <button onClick={() => setShowCreateTask(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-200">
            <Plus size={16} /> Add Task
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200">
        {['Overview', 'Tasks', 'Members'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("pb-4 text-sm font-bold transition-all relative",
              activeTab === tab ? "text-indigo-600" : "text-slate-500 hover:text-slate-700")}>
            {tab}
            {tab === 'Tasks' && <span className="ml-1.5 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">{tasks.length}</span>}
            {tab === 'Members' && <span className="ml-1.5 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">{members.length}</span>}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600" />}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-base font-bold mb-3">Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{project.description || 'No description provided.'}</p>
            </Card>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Tasks', value: tasks.length, icon: List, color: 'indigo' },
                { label: 'Completed', value: done, icon: CheckCircle2, color: 'emerald' },
                { label: 'Pending', value: tasks.length - done, icon: Clock, color: 'amber' },
              ].map(({ label, value, icon: Icon, color }) => (
                <Card key={label} className={`flex flex-col items-center text-center p-6 bg-${color}-50/30 border-${color}-100`}>
                  <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center text-${color}-600 mb-3`}>
                    <Icon size={22} />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase mt-1">{label}</p>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <Card>
              <h3 className="text-base font-bold mb-6">Progress</h3>
              <div className="flex flex-col items-center py-4 relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={364.4} strokeDashoffset={364.4 * (1 - progress / 100)}
                    className="text-indigo-600 transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900">{progress}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Complete</span>
                </div>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Team Size</span><span className="font-bold">{members.length} members</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Status</span><Badge variant={statusVariant[project.status] || 'slate'} className="text-[10px] py-0">{project.status}</Badge></div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'Tasks' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              {[['List', List], ['Board', Layout]].map(([mode, Icon]) => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={cn("p-1.5 rounded-md transition-all", viewMode === mode ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                  <Icon size={18} />
                </button>
              ))}
            </div>
            {canManage && (
              <button onClick={() => setShowCreateTask(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                <Plus size={15} /> New Task
              </button>
            )}
          </div>

          {tasks.length === 0
            ? <Card className="text-center py-16"><p className="text-slate-500">No tasks yet. Create the first one!</p></Card>
            : viewMode === 'List' ? (
              <Card className="p-0 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Task</th>
                      <th className="px-6 py-4">Assignee</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks.map(task => (
                      <tr key={task.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{task.title}</td>
                        <td className="px-6 py-4">
                          {task.assignedTo
                            ? <div className="flex items-center gap-2"><Avatar name={task.assignedTo.name} size="sm" /><span className="text-xs text-slate-600">{task.assignedTo.name}</span></div>
                            : <span className="text-xs text-slate-400">Unassigned</span>}
                        </td>
                        <td className="px-6 py-4"><Badge variant={priorityColor[task.priority] || 'slate'}>{task.priority}</Badge></td>
                        <td className="px-6 py-4">
                          {canManage || task.assignedTo?.email === user?.email
                            ? <select value={task.status} onChange={e => handleStatusChange(task.id, e.target.value)}
                                className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer">
                                {['TODO', 'IN_PROGRESS', 'DONE'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                              </select>
                            : <Badge variant={statusColor[task.status] || 'slate'}>{task.status?.replace('_', ' ')}</Badge>
                          }
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['TODO', 'IN_PROGRESS', 'DONE'].map(col => (
                  <div key={col} className="bg-slate-50/70 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {col.replace('_', ' ')}
                        <span className="ml-2 bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{tasks.filter(t => t.status === col).length}</span>
                      </h4>
                    </div>
                    {tasks.filter(t => t.status === col).map(task => (
                      <Card key={task.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                        <Badge variant={priorityColor[task.priority] || 'slate'} className="text-[10px] px-1.5 mb-2">{task.priority}</Badge>
                        <h5 className="text-sm font-bold text-slate-900 mb-2">{task.title}</h5>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</span>
                          {task.assignedTo && <Avatar name={task.assignedTo.name} size="sm" />}
                        </div>
                      </Card>
                    ))}
                  </div>
                ))}
              </div>
            )
          }
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'Members' && (
        <div className="space-y-4">
          {canManage && (
            <div className="flex justify-end">
              <button onClick={() => setShowAddMember(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                <UserPlus size={16} /> Add Member
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map(member => (
              <Card key={member.id} className="flex items-center gap-4 group">
                <Avatar name={member.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{member.name}</h4>
                    {member.id === project.owner?.id && <Badge variant="indigo" className="text-[10px] py-0">Owner</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{member.email}</p>
                  <Badge variant={member.role === 'ADMIN' ? 'indigo' : 'slate'} className="text-[9px] py-0 mt-1">{member.role}</Badge>
                </div>
                {canManage && member.id !== project.owner?.id && (
                  <button onClick={() => handleRemoveMember(member.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={15} />
                  </button>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {showCreateTask && (
        <CreateTaskModal projectId={id} members={members} onClose={() => setShowCreateTask(false)} onCreated={loadAll} />
      )}
      {showAddMember && (
        <AddMemberModal projectId={id} existingMemberIds={memberIds} onClose={() => setShowAddMember(false)} onAdded={loadAll} />
      )}
    </div>
  );
};

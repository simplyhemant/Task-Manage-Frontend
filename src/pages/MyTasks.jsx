import React, { useEffect, useState, useCallback } from 'react';
import { CheckSquare, Clock, AlertCircle, Loader, Plus, ChevronDown } from 'lucide-react';
import { Card, Badge } from '../components/UI';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const statusColor = { TODO: 'slate', IN_PROGRESS: 'indigo', DONE: 'emerald' };
const priorityColor = { HIGH: 'red', MEDIUM: 'amber', LOW: 'slate' };
const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];

const TaskCard = ({ task, onStatusChange, canEdit }) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (!canEdit) return;
    setUpdating(true);
    try {
      await taskService.updateStatus(task.id, newStatus);
      onStatusChange(task.id, newStatus);
    } catch (e) { alert(e.message); }
    setUpdating(false);
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-slate-900 text-sm flex-1 mr-2">{task.title}</h4>
        <Badge variant={priorityColor[task.priority] || 'slate'} className="text-[10px] shrink-0">{task.priority}</Badge>
      </div>
      {task.description && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>}
      <div className="text-xs text-slate-400 mb-3">
        <span className="font-medium text-slate-600">{task.project?.name}</span>
        {task.dueDate && <span className="ml-2">• Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
      </div>
      <div className="flex items-center justify-between">
        <Badge variant={statusColor[task.status] || 'slate'}>{task.status?.replace('_', ' ')}</Badge>
        {canEdit && (
          <select
            value={task.status}
            onChange={e => handleStatusChange(e.target.value)}
            disabled={updating}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer bg-white"
          >
            {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        )}
      </div>
    </Card>
  );
};

const CreateTaskModal = ({ projects, onClose, onCreated }) => {
  const [form, setForm] = useState({ title: '', description: '', projectId: '', priority: 'MEDIUM', dueDate: '' });
  const [members, setMembers] = useState([]);
  const [assignedToId, setAssignedToId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (form.projectId) {
      projectService.getMembers(form.projectId).then(setMembers).catch(() => setMembers([]));
    }
  }, [form.projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await taskService.create({ ...form, projectId: Number(form.projectId), assignedToId: assignedToId ? Number(assignedToId) : null, dueDate: form.dueDate || null });
      onCreated();
      onClose();
    } catch (e) { setError(e.message); }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-5">Create New Task</h3>
        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
            <input required minLength={3} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Project *</label>
              <select required value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Select project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                {['LOW', 'MEDIUM', 'HIGH'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assign to</label>
              <select value={assignedToId} onChange={e => setAssignedToId(e.target.value)} disabled={!form.projectId}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Unassigned</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
              {submitting ? 'Creating...' : 'Create Task'}
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [showCreate, setShowCreate] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [t, p] = await Promise.all([taskService.getMyTasks(), projectService.getAll()]);
      setTasks(t);
      setProjects(p);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const filtered = tasks.filter(t =>
    (!filter.status || t.status === filter.status) &&
    (!filter.priority || t.priority === filter.priority)
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Loader className="animate-spin text-indigo-600" size={32} /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Tasks</h2>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} task{filtered.length !== 1 ? 's' : ''} assigned to you</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-200">
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
          <option value="">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <select value={filter.priority} onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
          <option value="">All Priorities</option>
          {['LOW', 'MEDIUM', 'HIGH'].map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {(filter.status || filter.priority) && (
          <button onClick={() => setFilter({ status: '', priority: '' })}
            className="px-3 py-2 text-sm text-slate-500 hover:text-slate-800 underline">Clear filters</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <CheckSquare size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No tasks found</p>
          <p className="text-slate-400 text-sm mt-1">Tasks assigned to you will appear here</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(task => (
            <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange}
              canEdit={task.assignedTo?.id === user?.id || task.createdBy?.id === user?.id} />
          ))}
        </div>
      )}

      {showCreate && <CreateTaskModal projects={projects} onClose={() => setShowCreate(false)} onCreated={loadData} />}
    </div>
  );
};

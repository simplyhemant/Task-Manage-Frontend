import React, { useEffect, useState, useCallback } from 'react';
import { Plus, FolderKanban, Loader, Trash2, Edit, Users, CheckSquare, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, cn } from '../components/UI';
import { projectService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const statusVariant = { ACTIVE: 'emerald', ON_HOLD: 'amber', COMPLETED: 'indigo', ARCHIVED: 'slate' };

const ProjectForm = ({ initial, onSubmit, onClose }) => {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    startDate: initial?.startDate || new Date().toISOString().split('T')[0],
    endDate: initial?.endDate || '',
    status: initial?.status || 'ACTIVE',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, endDate: form.endDate || null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Project Name *</label>
        <input required minLength={3} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="My Awesome Project" />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
          placeholder="Describe the project..." />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
          <input required type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
          <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
      </div>
      {initial && (
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            {['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <button type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors">
          {initial ? 'Save Changes' : 'Create Project'}
        </button>
        <button type="button" onClick={onClose}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
};

export const ProjectsList = () => {
  const { user, isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [error, setError] = useState('');

  const loadProjects = useCallback(() => {
    setLoading(true);
    projectService.getAll()
      .then(setProjects)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleCreate = async (data) => {
    try {
      await projectService.create(data);
      setShowCreate(false);
      loadProjects();
    } catch (e) { setError(e.message); }
  };

  const handleUpdate = async (data) => {
    try {
      await projectService.update(editProject.id, data);
      setEditProject(null);
      loadProjects();
    } catch (e) { setError(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project? All tasks will also be deleted.')) return;
    try {
      await projectService.delete(id);
      loadProjects();
    } catch (e) { setError(e.message); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader className="animate-spin text-indigo-600" size={32} /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-slate-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} accessible to you</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-indigo-200">
          <Plus size={16} /> New Project
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200">{error}</div>}

      {projects.length === 0 ? (
        <Card className="text-center py-16">
          <FolderKanban size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No projects yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first project to get started</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id}>
            <Card className="hover:shadow-lg transition-shadow group relative cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <FolderKanban size={20} className="text-indigo-600" />
                </div>
                <Badge variant={statusVariant[project.status] || 'slate'}>{project.status?.replace('_', ' ')}</Badge>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{project.name}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{project.description || 'No description'}</p>

              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1"><CheckSquare size={12} /> {project.taskCount} tasks</span>
                <span className="flex items-center gap-1"><Users size={12} /> {project.memberCount} members</span>
                {project.endDate && <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(project.endDate).toLocaleDateString()}</span>}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="text-xs text-slate-400">
                  Owner: <span className="font-medium text-slate-600">{project.owner?.name}</span>
                </div>
                {(isAdmin || project.owner?.email === user?.email) && (
                  <div className="flex gap-1">
                    <button onClick={() => setEditProject(project)}
                      className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(project.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Create New Project</h3>
            <ProjectForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Edit Project</h3>
            <ProjectForm initial={editProject} onSubmit={handleUpdate} onClose={() => setEditProject(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

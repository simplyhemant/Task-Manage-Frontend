import { api } from './api';

export const taskService = {
  getAll: () => api.get('/tasks'),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  assign: (id, userId) => api.patch(`/tasks/${id}/assign?userId=${userId}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  filter: (params) => {
    const q = new URLSearchParams(Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null)
    )).toString();
    return api.get(`/tasks/filter${q ? '?' + q : ''}`);
  },
};

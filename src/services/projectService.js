import { api } from './api';

export const projectService = {
  getAll: () => api.get('/projects'),
  getMine: () => api.get('/projects/my-projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getMembers: (id) => api.get(`/projects/${id}/members`),
  addMember: (id, userId) => api.post(`/projects/${id}/members`, { userId }),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
  getTasks: (id) => api.get(`/projects/${id}/tasks`),
};

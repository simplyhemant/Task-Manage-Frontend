import { api } from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentTasks: () => api.get('/dashboard/recent-tasks'),
  getUpcomingDeadlines: () => api.get('/dashboard/upcoming-deadlines'),
};

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  return Promise.reject(err);
});

export const roleAPI = {
  getAll: (p) => api.get('/roles', { params: p }),
  getById: (id) => api.get(`/roles/${id}`),
  create: (d) => api.post('/roles', d),
  update: (id, d) => api.put(`/roles/${id}`, d),
  delete: (id) => api.delete(`/roles/${id}`)
};

export const employeeAPI = {
  getAll: (p) => api.get('/employees', { params: p }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (d) => api.post('/employees', d),
  update: (id, d) => api.put(`/employees/${id}`, d),
  delete: (id) => api.delete(`/employees/${id}`),
  getStats: () => api.get('/employees/stats')
};

export const taskAPI = {
  getAll: (p) => api.get('/tasks', { params: p }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (d) => api.post('/tasks', d),
  update: (id, d) => api.put(`/tasks/${id}`, d),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  requestTransfer: (id, d) => api.post(`/tasks/${id}/transfer`, d),
  respondTransfer: (id, d) => api.patch(`/tasks/${id}/transfer/respond`, d),
  addNote: (id, d) => api.post(`/tasks/${id}/notes`, d),
  getStats: () => api.get('/tasks/stats'),
  getPendingTransfers: (empId) => api.get(`/tasks/pending-transfers/${empId}`)
};

export const clientAPI = {
  getAll: (p) => api.get('/clients', { params: p }),
  getById: (id) => api.get(`/clients/${id}`),
  create: (d) => api.post('/clients', d),
  update: (id, d) => api.put(`/clients/${id}`, d),
  delete: (id) => api.delete(`/clients/${id}`),
  getStats: () => api.get('/clients/stats')
};

export const policyAPI = {
  getAll: (p) => api.get('/policies', { params: p }),
  getById: (id) => api.get(`/policies/${id}`),
  create: (d) => api.post('/policies', d),
  update: (id, d) => api.put(`/policies/${id}`, d),
  delete: (id) => api.delete(`/policies/${id}`),
  getRenewals: () => api.get('/policies/renewals/upcoming')
};

export const claimAPI = {
  getAll: (p) => api.get('/claims', { params: p }),
  getById: (id) => api.get(`/claims/${id}`),
  create: (d) => api.post('/claims', d),
  update: (id, d) => api.put(`/claims/${id}`, d),
  delete: (id) => api.delete(`/claims/${id}`),
  updateStatus: (id, status) => api.patch(`/claims/${id}/status`, { status })
};

export const reminderAPI = {
  getAll: (p) => api.get('/reminders', { params: p }),
  getById: (id) => api.get(`/reminders/${id}`),
  create: (d) => api.post('/reminders', d),
  update: (id, d) => api.put(`/reminders/${id}`, d),
  delete: (id) => api.delete(`/reminders/${id}`),
  complete: (id) => api.patch(`/reminders/${id}/complete`),
  snooze: (id, d) => api.patch(`/reminders/${id}/snooze`, d)
};

export const targetAPI = {
  getAll: (p) => api.get('/targets', { params: p }),
  getById: (id) => api.get(`/targets/${id}`),
  create: (d) => api.post('/targets', d),
  update: (id, d) => api.put(`/targets/${id}`, d),
  delete: (id) => api.delete(`/targets/${id}`)
};

export default api;

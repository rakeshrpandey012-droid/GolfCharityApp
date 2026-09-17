import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// User
export const getProfile = () => API.get('/user/profile');
export const getAnalytics = () => API.get('/user/analytics');
export const getAdminUsers = (q) => API.get(`/user/admin/users${q ? `?q=${q}` : ''}`);
export const updateAdminUser = (id, data) => API.patch(`/user/admin/users/${id}`, data);

// Scores
export const getScores = () => API.get('/scores');
export const addScore = (data) => API.post('/scores', data);
export const updateAdminScore = (id, data) => API.patch(`/scores/admin/${id}`, data);

// Subscriptions
export const createSubscription = (data) => API.post('/subscriptions', data);
export const getMySubscription = () => API.get('/subscriptions/me');
export const cancelSubscription = () => API.post('/subscriptions/cancel');
export const renewSubscription = () => API.post('/subscriptions/renew');
export const getAdminSubscriptions = (status) => API.get(`/subscriptions/admin${status ? `?status=${status}` : ''}`);
export const simulatePayment = (data) => API.post('/subscriptions/simulate-webhook', data);

// Charities
export const getCharities = () => API.get('/charities');
export const selectCharity = (data) => API.post('/charities/select', data);
export const createCharity = (data) => API.post('/charities', data);
export const updateCharity = (id, data) => API.patch(`/charities/${id}`, data);
export const deleteCharity = (id) => API.delete(`/charities/${id}`);
export const donateToCharity = (id, data) => API.post(`/charities/${id}/donate`, data);

// Draw
export const getLatestDraw = () => API.get('/draw/latest');
export const getDrawHistory = () => API.get('/draw/history');
export const createDraftDraw = (data) => API.post('/draw/draft', data);
export const simulateDraw = (id) => API.post(`/draw/${id}/simulate`);
export const publishDraw = (id) => API.post(`/draw/${id}/publish`);
export const runDraw = (data) => API.post('/draw/run', data);

// Winners
export const getWinners = () => API.get('/winners');
export const uploadWinnerProof = (data) => API.post('/winners/proof', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateWinnerStatus = (id, data) => API.patch(`/winners/${id}/status`, data);

export default API;

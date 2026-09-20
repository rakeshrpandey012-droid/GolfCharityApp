import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('🔌 API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH & USER
// ============================================

export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response;
};

export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

export const getProfile = async () => {
  return await apiClient.get('/user/profile');
};

// ============================================
// SCORES
// ============================================

export const fetchGolfScores = async () => {
  const response = await apiClient.get('/scores');
  return response.data;
};

export const submitGolfScore = async (scoreData) => {
  return await apiClient.post('/scores', scoreData);
};

export const deleteGolfScore = async (scoreId) => {
  return await apiClient.delete(`/scores/${scoreId}`);
};

// ============================================
// CHARITIES
// ============================================

export const getCharities = async () => {
  const response = await apiClient.get('/charities');
  return response.data;
};

export const selectCharity = async (charityData) => {
  const response = await apiClient.post('/charities/select', charityData);
  return response.data;
};

export const donateToCharity = async (charityId, amount) => {
  const response = await apiClient.post(`/charities/${charityId}/donate`, { amount });
  return response.data;
};

export const createCharity = async (charityData) => {
  const response = await apiClient.post('/charities', charityData);
  return response.data;
};

export const updateCharity = async (id, charityData) => {
  const response = await apiClient.patch(`/charities/${id}`, charityData);
  return response.data;
};

export const deleteCharity = async (id) => {
  const response = await apiClient.delete(`/charities/${id}`);
  return response.data;
};

// ============================================
// DRAWS & WINNERS (Public/User)
// ============================================

export const getLatestDraw = async () => {
  const response = await apiClient.get('/draws/latest');
  return response.data;
};

export const getMySubscription = async () => {
  const response = await apiClient.get('/subscriptions/me');
  return response.data;
};

export const createSubscription = async (data) => {
  const response = await apiClient.post('/subscriptions', data);
  return response.data;
};

export const cancelSubscription = async (id) => {
  const response = await apiClient.delete(`/subscriptions/${id}`);
  return response.data;
};

export const renewSubscription = async (id) => {
  const response = await apiClient.post(`/subscriptions/${id}/renew`);
  return response.data;
};

// ============================================
// ADMIN API
// ============================================

export const getAnalytics = async () => {
  return await apiClient.get('/user/analytics');
};

export const getAdminUsers = async () => {
  const response = await apiClient.get('/user/admin/users');
  return response.data;
};

export const createAdminUser = async (userData) => {
  const response = await apiClient.post('/user/admin/users', userData);
  return response.data;
};

export const updateAdminUser = async (userId, userData) => {
  const response = await apiClient.patch(`/user/admin/users/${userId}`, userData);
  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await apiClient.delete(`/user/admin/users/${userId}`);
  return response.data;
};

export const createDraftDraw = async (drawData) => {
  const response = await apiClient.post('/draws/draft', drawData);
  return response.data;
};

export const getDrawHistory = async () => {
  const response = await apiClient.get('/draws/history');
  return response.data;
};

export const simulateDraw = async (drawId) => {
  const response = await apiClient.post(`/draws/${drawId}/simulate`);
  return response.data;
};

export const publishDraw = async (drawId) => {
  const response = await apiClient.post(`/draws/${drawId}/publish`);
  return response.data;
};

export const deleteDraw = async (drawId) => {
  const response = await apiClient.delete(`/admin/draws/${drawId}`);
  return response.data;
};

export const getWinners = async () => {
  const response = await apiClient.get('/winners');
  return response.data;
};

export const updateWinnerStatus = async (winnerId, status) => {
  const response = await apiClient.patch(`/winners/${winnerId}/status`, { status });
  return response.data;
};

export default apiClient;
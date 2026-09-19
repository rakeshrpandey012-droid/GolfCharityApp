import axios from 'axios';

// ===== CONFIGURATION =====
// For local development, make sure backend is running at: http://localhost:5000
// To deploy, set VITE_API_URL to your backend URL in Vercel.
// If `VITE_API_URL` is set use it. Otherwise, when in production default to
// the live backend URL. In development use the local backend.
const DEFAULT_LOCAL_API = 'http://localhost:5000/api';
const API_BASE_URL = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://golf-charity-backend-three.vercel.app/api' : DEFAULT_LOCAL_API)).replace(/\/$/, '');

console.log('🌐 API Base URL:', API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', req.method.toUpperCase(), req.url);
    return req;
  },
  (err) => {
    console.error('❌ Request Error:', err);
    return Promise.reject(err);
  }
);

// Response interceptor
API.interceptors.response.use(
  (res) => {
    console.log('📥 API Response:', res.status, res.config.url);
    return res;
  },
  (err) => {
    console.error('❌ Response Error:', {
      status: err.response?.status,
      message: err.message,
      url: err.config?.url,
      data: err.response?.data,
    });

    if (err.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Handle different error types
    if (!err.response) {
      if (err.code === 'ECONNABORTED') {
        err.message = '⏱️ Request timeout. Backend server might be slow or offline.';
      } else if (err.message === 'Network Error') {
        err.message = `🚫 Backend server is not running at ${API_BASE_URL}\n\nMake sure your backend server is running:\n- Check backend is running on port 5000\n- Run: npm start (in backend folder)\n- Check VITE_API_URL in .env`;
      } else {
        err.message = `🌐 Network error: ${err.message}`;
      }
    }
    
    return Promise.reject(err);
  }
);

// ==================== AUTH ====================
export const login = (data) => {
  console.log('🔐 Logging in:', data.email);
  return API.post('/auth/login', {
    email: data.email,
    password: data.password,
  });
};

export const register = (data) => {
  console.log('📝 Registering:', data.email);
  return API.post('/auth/register', {
    name: data.name,
    email: data.email,
    password: data.password,
    dob: data.dob,
    phone: data.phone || '',
  });
};

export const getMe = () => API.get('/auth/me');

// ==================== USER ====================
export const getProfile = () => API.get('/user/profile');
export const updateProfile = (data) => API.patch('/user/profile', data);
export const getAnalytics = () => API.get('/user/analytics');
export const getAdminUsers = (q) => API.get(`/user/admin/users${q ? `?q=${q}` : ''}`);
export const updateAdminUser = (id, data) => API.patch(`/user/admin/users/${id}`, data);

// ==================== SCORES ====================
export const getScores = () => API.get('/scores');
export const addScore = (data) => API.post('/scores', {
  date: data.date,
  score: data.score,
  courseId: data.courseId,
  holeCount: data.holeCount,
});
export const updateAdminScore = (id, data) => API.patch(`/scores/admin/${id}`, data);
export const deleteScore = (id) => API.delete(`/scores/${id}`);

// ==================== SUBSCRIPTIONS ====================
export const createSubscription = (data = {}) => API.post('/subscriptions', {
  plan: data.plan || data.planType || 'monthly',
  charityId: data.charityId,
  contributionPercentage: data.contributionPercentage,
});
export const getMySubscription = async () => {
  const res = await API.get('/subscriptions/me');
  const payload = res.data || {};
  const items = Array.isArray(payload.subscriptions) ? payload.subscriptions : [];
  const active = payload.activeSubscription || items.find((item) => item.status === 'active') || items[0] || {};
  return { ...res, data: active && Object.keys(active).length ? active : payload.subscription || payload || {} };
};
export const cancelSubscription = () => API.post('/subscriptions/cancel');
export const renewSubscription = (data = {}) => API.post('/subscriptions/renew', {
  plan: data.plan || 'monthly',
});
export const getAdminSubscriptions = (status) => API.get(`/subscriptions/admin${status ? `?status=${status}` : ''}`);
export const simulatePayment = (data) => API.post('/subscriptions/simulate-webhook', data);

// ==================== CHARITIES ====================
export const getCharities = () => API.get('/charities');
export const selectCharity = (charityId, percentage = 10) => API.post('/charities/select', {
  charityId,
  charityPercentage: Number(percentage),
});
export const createCharity = (data) => API.post('/charities', {
  name: data.name,
  description: data.description,
  image: data.image || '',
  events: data.events || [],
  isSpotlight: Boolean(data.spotlight ?? data.isSpotlight),
});
export const updateCharity = (id, data) => API.patch(`/charities/${id}`, {
  name: data.name,
  description: data.description,
  image: data.image || '',
  events: data.events || [],
  isSpotlight: Boolean(data.spotlight ?? data.isSpotlight),
});
export const deleteCharity = (id) => API.delete(`/charities/${id}`);
export const donateToCharity = (id, amount) => API.post(`/charities/${id}/donate`, { amount });

// ==================== DRAW ====================
export const getLatestDraw = () => API.get('/draw/latest');
export const getDrawHistory = () => API.get('/draw/history');
export const createDraftDraw = (data) => API.post('/draw/draft', data);
export const simulateDraw = (id) => API.post(`/draw/${id}/simulate`);
export const publishDraw = (id) => API.post(`/draw/${id}/publish`);
export const runDraw = (data) => API.post('/draw/run', data);

// ==================== WINNERS ====================
export const getWinners = () => API.get('/winners');
export const uploadWinnerProof = (formData) => API.post('/winners/proof', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateWinnerStatus = (id, data) => API.patch(`/winners/${id}/status`, data);

export default API;
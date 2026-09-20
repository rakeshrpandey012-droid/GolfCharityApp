import axios from 'axios';

// ===== CONFIGURATION =====
// For local development, make sure backend is running at: http://localhost:5000
// To deploy, set VITE_API_URL to your backend URL in Vercel environment variables.
// Priority: VITE_API_URL env var → Production backend → Local development backend
const DEFAULT_LOCAL_API = 'http://localhost:5000/api';
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://golf-charity-backend-three.vercel.app/api' 
    : DEFAULT_LOCAL_API)
).replace(/\/$/, '');

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('📦 Environment:', import.meta.env.MODE);

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ==================== REQUEST INTERCEPTOR ====================
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem('token');
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 [${req.method.toUpperCase()}] ${req.url}`);
    return req;
  },
  (err) => {
    console.error('❌ Request Error:', err.message);
    return Promise.reject(err);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
API.interceptors.response.use(
  (res) => {
    console.log(`📥 [${res.status}] ${res.config.url}`);
    return res;
  },
  (err) => {
    const errorInfo = {
      status: err.response?.status,
      message: err.message,
      url: err.config?.url,
      data: err.response?.data,
    };
    console.error('❌ Response Error:', errorInfo);

    // Handle authentication errors
    if (err.response?.status === 401) {
      console.warn('🔑 Token expired or invalid - Redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle network errors
    if (!err.response) {
      if (err.code === 'ECONNABORTED') {
        err.message = '⏱️ Request timeout. Backend server might be slow or offline.';
      } else if (err.message === 'Network Error') {
        err.message = `🚫 Cannot connect to backend at ${API_BASE_URL}\n\nMake sure your backend server is running:\n- Port: 5000\n- Run: npm start (in backend folder)\n- Check VITE_API_URL in .env file`;
      } else {
        err.message = `🌐 Network error: ${err.message}`;
      }
    } else if (err.response?.status === 400) {
      // Bad request - likely validation error from backend
      err.message = err.response?.data?.message || 'Invalid request data';
    } else if (err.response?.status === 403) {
      // Forbidden
      err.message = 'You do not have permission to perform this action';
    } else if (err.response?.status === 404) {
      // Not found
      err.message = 'Resource not found';
    } else if (err.response?.status === 500) {
      // Server error
      err.message = err.response?.data?.message || 'Server error - please try again later';
    }
    
    return Promise.reject(err);
  }
);

// ==================== AUTH ====================
export const login = (data) => {
  console.log('🔐 Login attempt:', data.email);
  if (!data.email || !data.password) {
    return Promise.reject(new Error('Email and password are required'));
  }
  return API.post('/auth/login', {
    email: data.email,
    password: data.password,
  });
};

export const register = (data) => {
  console.log('📝 Registration attempt:', data.email);
  if (!data.name || !data.email || !data.password) {
    return Promise.reject(new Error('Name, email, and password are required'));
  }
  return API.post('/auth/register', {
    name: data.name,
    email: data.email,
    password: data.password,
    dob: data.dob || '',
    phone: data.phone || '',
  });
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return Promise.resolve();
};

export const getMe = () => API.get('/auth/me');

// ==================== USER ====================
export const getProfile = () => API.get('/user/profile');

export const updateProfile = (data) => {
  if (!data || Object.keys(data).length === 0) {
    return Promise.reject(new Error('No data to update'));
  }
  return API.patch('/user/profile', data);
};

export const getAnalytics = () => API.get('/user/analytics');

// Admin user management
export const getAdminUsers = (q = '') => {
  const query = q ? `?q=${encodeURIComponent(q)}` : '';
  return API.get(`/user/admin/users${query}`);
};

export const createAdminUser = (data) => {
  if (!data.name || !data.email || !data.password) {
    return Promise.reject(new Error('Name, email, and password are required'));
  }
  return API.post('/user/admin/users', {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role || 'user',
    subscriptionStatus: data.subscriptionStatus || 'active',
  });
};

export const updateAdminUser = (id, data) => {
  if (!id) {
    return Promise.reject(new Error('User ID is required'));
  }
  if (!data || Object.keys(data).length === 0) {
    return Promise.reject(new Error('No data to update'));
  }
  return API.patch(`/user/admin/users/${id}`, data);
};

export const deleteAdminUser = (id) => {
  if (!id) {
    return Promise.reject(new Error('User ID is required'));
  }
  return API.delete(`/user/admin/users/${id}`);
};

// ==================== SCORES ====================
export const getScores = () => API.get('/scores');

export const addScore = (data) => {
  if (!data.date || !data.score || !data.courseId) {
    return Promise.reject(new Error('Date, score, and courseId are required'));
  }
  return API.post('/scores', {
    date: data.date,
    score: data.score,
    courseId: data.courseId,
    holeCount: data.holeCount || 18,
  });
};

export const updateScore = (id, data) => {
  if (!id) {
    return Promise.reject(new Error('Score ID is required'));
  }
  return API.patch(`/scores/${id}`, data);
};

export const updateAdminScore = (id, data) => {
  if (!id) {
    return Promise.reject(new Error('Score ID is required'));
  }
  return API.patch(`/scores/admin/${id}`, data);
};

export const deleteScore = (id) => {
  if (!id) {
    return Promise.reject(new Error('Score ID is required'));
  }
  return API.delete(`/scores/${id}`);
};

// ==================== SUBSCRIPTIONS ====================
export const createSubscription = (data = {}) => {
  return API.post('/subscriptions', {
    plan: data.plan || data.planType || 'monthly',
    charityId: data.charityId || '',
    contributionPercentage: data.contributionPercentage || 0,
  });
};

export const getMySubscription = async () => {
  try {
    const res = await API.get('/subscriptions/me');
    const payload = res.data || {};
    
    // Handle different response formats
    const items = Array.isArray(payload.subscriptions) ? payload.subscriptions : [];
    const active = 
      payload.activeSubscription || 
      items.find((item) => item.status === 'active') || 
      items[0] || 
      {};
    
    const subscriptionData = active && Object.keys(active).length ? active : (payload.subscription || payload || {});
    
    return { ...res, data: subscriptionData };
  } catch (err) {
    console.error('Failed to fetch subscription:', err);
    throw err;
  }
};

export const cancelSubscription = () => API.post('/subscriptions/cancel');

export const renewSubscription = (data = {}) => {
  return API.post('/subscriptions/renew', {
    plan: data.plan || 'monthly',
  });
};

export const getAdminSubscriptions = (status = '') => {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return API.get(`/subscriptions/admin${query}`);
};

export const simulatePayment = (data) => {
  if (!data || Object.keys(data).length === 0) {
    return Promise.reject(new Error('Payment data is required'));
  }
  return API.post('/subscriptions/simulate-webhook', data);
};

// ==================== CHARITIES ====================
export const getCharities = () => API.get('/charities');

export const selectCharity = (charityId, percentage = 10) => {
  if (!charityId) {
    return Promise.reject(new Error('Charity ID is required'));
  }
  return API.post('/charities/select', {
    charityId,
    charityPercentage: Number(percentage),
  });
};

export const createCharity = (data) => {
  if (!data.name || !data.description) {
    return Promise.reject(new Error('Name and description are required'));
  }
  return API.post('/charities', {
    name: data.name,
    description: data.description,
    image: data.image || '',
    events: Array.isArray(data.events) ? data.events : [],
    isSpotlight: Boolean(data.spotlight ?? data.isSpotlight),
  });
};

export const updateCharity = (id, data) => {
  if (!id) {
    return Promise.reject(new Error('Charity ID is required'));
  }
  return API.patch(`/charities/${id}`, {
    name: data.name || '',
    description: data.description || '',
    image: data.image || '',
    events: Array.isArray(data.events) ? data.events : [],
    isSpotlight: Boolean(data.spotlight ?? data.isSpotlight),
  });
};

export const deleteCharity = (id) => {
  if (!id) {
    return Promise.reject(new Error('Charity ID is required'));
  }
  return API.delete(`/charities/${id}`);
};

export const donateToCharity = (id, amount) => {
  if (!id || !amount) {
    return Promise.reject(new Error('Charity ID and amount are required'));
  }
  return API.post(`/charities/${id}/donate`, { amount: Number(amount) });
};

// ==================== DRAW ====================
export const getLatestDraw = () => API.get('/draw/latest');

export const getDrawHistory = () => API.get('/draw/history');

export const createDraftDraw = (data) => {
  if (!data || Object.keys(data).length === 0) {
    return Promise.reject(new Error('Draw data is required'));
  }
  return API.post('/draw/draft', data);
};

export const simulateDraw = (id) => {
  if (!id) {
    return Promise.reject(new Error('Draw ID is required'));
  }
  return API.post(`/draw/${id}/simulate`);
};

export const publishDraw = (id) => {
  if (!id) {
    return Promise.reject(new Error('Draw ID is required'));
  }
  return API.post(`/draw/${id}/publish`);
};

export const runDraw = (data) => {
  if (!data || Object.keys(data).length === 0) {
    return Promise.reject(new Error('Draw data is required'));
  }
  return API.post('/draw/run', data);
};

// ==================== WINNERS ====================
export const getWinners = () => API.get('/winners');

export const uploadWinnerProof = (formData) => {
  if (!(formData instanceof FormData)) {
    return Promise.reject(new Error('FormData is required'));
  }
  return API.post('/winners/proof', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateWinnerStatus = (id, data) => {
  if (!id) {
    return Promise.reject(new Error('Winner ID is required'));
  }
  return API.patch(`/winners/${id}/status`, data);
};

export default API;
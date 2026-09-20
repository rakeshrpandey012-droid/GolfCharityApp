import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔌 API Base URL:', API_BASE_URL);

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `📤 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

apiClient.interceptors.response.use(
  (response) => {
    console.log(
      `✅ API Response: ${response.status}`,
      response.data
    );

    return response;
  },
  (error) => {
    const errorInfo = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    };

    console.error('❌ API Error:', errorInfo);

    if (error.code === 'ECONNABORTED') {
      error.message =
        '⏱️ Request timeout - Server took too long to respond';
    } else if (
      error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error'
    ) {
      error.message =
        '🔌 Network error - Cannot reach the server';
    } else if (error.response?.status === 401) {
      error.message =
        '🔐 Invalid credentials or session expired';

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } else if (error.response?.status === 403) {
      error.message =
        '🚫 Access denied - You do not have permission';
    } else if (error.response?.status === 404) {
      error.message = '❌ Endpoint not found';
    } else if (error.response?.status === 500) {
      error.message =
        '⚠️ Server error - Please try again later';
    } else if (!error.response) {
      error.message =
        '🔌 Cannot connect to server - Is the backend running?';
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTH ENDPOINTS
// ============================================

export const login = async (credentials) => {
  try {
    const response = await apiClient.post(
      '/auth/login',
      credentials
    );

    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    if (response.data?.user) {
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );
    }

    return response;
  } catch (error) {
    console.error('❌ Login Error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await apiClient.post(
      '/auth/register',
      userData
    );

    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }

    if (response.data?.user) {
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      );
    }

    return response;
  } catch (error) {
    console.error('❌ Registration Error:', error);
    throw error;
  }
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
    console.error('❌ Error parsing stored user:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh');

    if (response.data?.token) {
      localStorage.setItem(
        'token',
        response.data.token
      );
    }

    return response;
  } catch (error) {
    logout();
    throw error;
  }
};

// ============================================
// USER ENDPOINTS
// ============================================

export const getProfile = async () => {
  const response = await apiClient.get('/user/profile');
  return response;
};

export const updateProfile = async (userData) => {
  const response = await apiClient.put(
    '/user/profile',
    userData
  );

  if (response.data?.user) {
    localStorage.setItem(
      'user',
      JSON.stringify(response.data.user)
    );
  }

  return response;
};

// ============================================
// SUBSCRIPTION ENDPOINTS
// ============================================

export const createSubscription = async (subscriptionData) => {
  const response = await apiClient.post(
    '/subscriptions',
    subscriptionData
  );

  return response;
};

export const cancelSubscription = async (subscriptionId) => {
  const response = await apiClient.delete(
    `/subscriptions/${subscriptionId}`
  );

  return response.data;
};

export const renewSubscription = async (subscriptionId) => {
  const response = await apiClient.post(
    `/subscriptions/${subscriptionId}/renew`
  );

  return response.data;
};

export const getMySubscription = async () => {
  const response = await apiClient.get(
    '/subscriptions/me'
  );

  return response.data;
};

// ============================================
// DRAW & CHARITY ENDPOINTS
// ============================================

export const getLatestDraw = async () => {
  const response = await apiClient.get('/latest-draw');
  return response.data;
};

export const getCharities = async () => {
  const response = await apiClient.get('/charities');
  return response.data;
};

export const createCharity = async (charityData) => {
  const response = await apiClient.post('/admin/charities', charityData);
  return response.data;
};

export const updateCharity = async (id, charityData) => {
  const response = await apiClient.put(`/admin/charities/${id}`, charityData);
  return response.data;
};

export const deleteCharity = async (id) => {
  const response = await apiClient.delete(`/admin/charities/${id}`);
  return response.data;
};

export const donateToCharity = async (donationData) => {
  const response = await apiClient.post(
    '/donate',
    donationData
  );

  return response.data;
};

export const selectCharity = async (charityData) => {
  const response = await apiClient.post(
    '/charities/select',
    charityData
  );

  return response.data;
};

// ============================================
// ADMIN DRAW ENDPOINTS
// ============================================

export const createDraftDraw = async (drawData) => {
  try {
    const response = await apiClient.post(
      '/admin/draws/draft',
      drawData
    );

    return response.data;
  } catch (error) {
    console.error('❌ Create Draft Draw Error:', error);
    throw error;
  }
};

export const getDrawHistory = async () => {
  try {
    const response = await apiClient.get(
      '/admin/draws/history'
    );

    return response.data;
  } catch (error) {
    console.error('❌ Get Draw History Error:', error);
    throw error;
  }
};

export const simulateDraw = async (drawId) => {
  try {
    const response = await apiClient.post(
      `/admin/draws/${drawId}/simulate`
    );

    return response.data;
  } catch (error) {
    console.error('❌ Simulate Draw Error:', error);
    throw error;
  }
};

export const publishDraw = async (drawId) => {
  try {
    const response = await apiClient.post(
      `/admin/draws/${drawId}/publish`
    );

    return response.data;
  } catch (error) {
    console.error('❌ Publish Draw Error:', error);
    throw error;
  }
};

// ============================================
// ADMIN WINNERS ENDPOINTS
// ============================================

export const getWinners = async () => {
  const response = await apiClient.get('/admin/winners');
  return response.data;
};

export const createWinner = async (winnerData) => {
  const response = await apiClient.post('/admin/winners', winnerData);
  return response.data;
};

export const updateWinner = async (id, winnerData) => {
  const response = await apiClient.put(`/admin/winners/${id}`, winnerData);
  return response.data;
};

export const deleteWinner = async (id) => {
  const response = await apiClient.delete(`/admin/winners/${id}`);
  return response.data;
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

export const fetchAdminData = async (endpoint) => {
  return await apiClient.get(`/admin/${endpoint}`);
};

export const createAdminData = async (endpoint, data) => {
  return await apiClient.post(`/admin/${endpoint}`, data);
};

export const updateAdminData = async (endpoint, id, data) => {
  return await apiClient.put(
    `/admin/${endpoint}/${id}`,
    data
  );
};

export const deleteAdminData = async (endpoint, id) => {
  return await apiClient.delete(
    `/admin/${endpoint}/${id}`
  );
};

export const getAnalytics = async () => {
  return await apiClient.get('/admin/analytics');
};

// ============================================
// ADMIN USER ENDPOINTS
// ============================================

export const getAdminUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

export const createAdminUser = async (userData) => {
  const response = await apiClient.post(
    '/admin/users',
    userData
  );

  return response.data;
};

export const updateAdminUser = async (userId, userData) => {
  const response = await apiClient.put(
    `/admin/users/${userId}`,
    userData
  );

  return response.data;
};

export const deleteAdminUser = async (userId) => {
  const response = await apiClient.delete(
    `/admin/users/${userId}`
  );

  return response.data;
};

export const getAdminUser = async (userId) => {
  const response = await apiClient.get(
    `/admin/users/${userId}`
  );

  return response.data;
};

// ============================================
// ADMIN WINNER ENDPOINTS
// ============================================

export const updateWinnerStatus = async (winnerId, status) => {
  try {
    const response = await apiClient.put(
      `/admin/winners/${winnerId}/status`,
      { status }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Update Winner Status Error:', error);
    throw error;
  }
};

// ============================================
// HEALTH CHECK & GOLF
// ============================================

export const checkApiHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export const fetchGolfScores = async (filters = {}) => {
  return await apiClient.get('/golf/scores', {
    params: filters,
  });
};

export const submitGolfScore = async (scoreData) => {
  return await apiClient.post(
    '/golf/scores',
    scoreData
  );
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default apiClient;
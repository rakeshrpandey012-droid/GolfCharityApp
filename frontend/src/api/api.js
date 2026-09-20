import axios from 'axios';

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔌 API Base URL:', API_BASE_URL);

// Create axios instance with proper timeout settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout - CRITICAL FIX
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
    // Add authentication token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
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
    console.log(`✅ API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    // Enhanced error handling
    const errorInfo = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    };

    console.error('❌ API Error:', errorInfo);

    // Categorize and enhance error messages
    if (error.code === 'ECONNABORTED') {
      error.message = '⏱️ Request timeout - Server took too long to respond';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = '🔌 Network error - Cannot reach the server';
    } else if (error.response?.status === 401) {
      error.message = '🔐 Invalid credentials or session expired';
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } else if (error.response?.status === 403) {
      error.message = '🚫 Access denied - You do not have permission';
    } else if (error.response?.status === 404) {
      error.message = '❌ Endpoint not found';
    } else if (error.response?.status === 500) {
      error.message = '⚠️ Server error - Please try again later';
    } else if (!error.response) {
      error.message = '🔌 Cannot connect to server - Is the backend running?';
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTH ENDPOINTS
// ============================================

export const login = async (credentials) => {
  try {
    console.log('🔐 Logging in user:', credentials.email);
    const response = await apiClient.post('/auth/login', credentials);
    
    // Save token and user info
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    console.log('✅ Login successful');
    return response;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    console.log('📝 Registering user:', userData.email);
    const response = await apiClient.post('/auth/register', userData);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    console.log('✅ Registration successful');
    return response;
  } catch (error) {
    console.error('❌ Registration failed:', error.message);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('✅ Logged out');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh');
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    throw error;
  }
};

// ============================================
// USER ENDPOINTS
// ============================================

export const getProfile = async () => {
  try {
    const response = await apiClient.get('/user/profile');
    return response;
  } catch (error) {
    console.error('Failed to fetch profile:', error.message);
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.put('/user/profile', userData);
    // Update stored user info
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  } catch (error) {
    console.error('Failed to update profile:', error.message);
    throw error;
  }
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

export const fetchAdminData = async (endpoint) => {
  try {
    const response = await apiClient.get(`/admin/${endpoint}`);
    return response;
  } catch (error) {
    console.error(`Failed to fetch admin data from ${endpoint}:`, error.message);
    throw error;
  }
};

export const createAdminData = async (endpoint, data) => {
  try {
    const response = await apiClient.post(`/admin/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error(`Failed to create admin data in ${endpoint}:`, error.message);
    throw error;
  }
};

export const updateAdminData = async (endpoint, id, data) => {
  try {
    const response = await apiClient.put(`/admin/${endpoint}/${id}`, data);
    return response;
  } catch (error) {
    console.error(`Failed to update admin data in ${endpoint}:`, error.message);
    throw error;
  }
};

export const deleteAdminData = async (endpoint, id) => {
  try {
    const response = await apiClient.delete(`/admin/${endpoint}/${id}`);
    return response;
  } catch (error) {
    console.error(`Failed to delete admin data from ${endpoint}:`, error.message);
    throw error;
  }
};

// ============================================
// HEALTH CHECK
// ============================================

export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    console.log('✅ API Health Check:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API Health Check Failed:', error.message);
    throw error;
  }
};

// ============================================
// GOLF DATA ENDPOINTS (Examples)
// ============================================

export const fetchGolfScores = async (filters = {}) => {
  try {
    const response = await apiClient.get('/golf/scores', { params: filters });
    return response;
  } catch (error) {
    console.error('Failed to fetch golf scores:', error.message);
    throw error;
  }
};

export const submitGolfScore = async (scoreData) => {
  try {
    const response = await apiClient.post('/golf/scores', scoreData);
    return response;
  } catch (error) {
    console.error('Failed to submit golf score:', error.message);
    throw error;
  }
};

// ============================================
// EXPORT API CLIENT FOR DIRECT USE
// ============================================

export default apiClient;

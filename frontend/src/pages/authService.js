import axios from 'axios';

// ============================================
// API CONFIGURATION - CRITICAL FIX
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔌 API Base URL:', API_BASE_URL);

// Create axios instance with proper timeout settings
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
apiClient.interceptors.request.use(
  (config) => {
    // Add token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
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
    console.error('❌ Response Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
    });

    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      error.message = '⏱️ Request timeout - Server is taking too long to respond';
    } else if (error.code === 'ERR_NETWORK') {
      error.message = '🔌 Network error - Cannot reach the server. Is it running?';
    } else if (error.response?.status === 401) {
      error.message = '🔐 Invalid credentials';
      localStorage.removeItem('token');
    } else if (error.response?.status === 404) {
      error.message = '❌ Endpoint not found';
    } else if (!error.response) {
      error.message = '⚠️ Cannot connect to server. Check if backend is running.';
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTH FUNCTIONS
// ============================================

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      // Save token
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      console.log('✅ Login successful');
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error.message);
      throw {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      };
    }
  },

  // Register user
  register: async (email, password, name) => {
    try {
      console.log('📝 Attempting registration for:', email);
      
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        name,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      console.log('✅ Registration successful');
      return response.data;
    } catch (error) {
      console.error('❌ Registration failed:', error.message);
      throw {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('✅ Logged out');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh');
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      authService.logout();
      throw error;
    }
  },
};

// ============================================
// API HEALTH CHECK
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

export default apiClient;

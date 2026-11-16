import axios from 'axios';

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // When running in Vite dev server (port 5173), use proxy /api
  if (typeof window !== 'undefined') {
    if (window.location.port === '5173') {
      return '/api';
    }
    // When served via XAMPP Apache (port 80), localhost, or LAN IP (e.g. 172.22.225.121),
    // dynamically target port 5001 on the same host so localhost, 127.0.0.1, and LAN all work cleanly
    const host = window.location.hostname || 'localhost';
    return `http://${host}:5001/api`;
  }
  return 'http://localhost:5001/api';
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hirematch_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired or invalid
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        localStorage.removeItem('hirematch_token');
        localStorage.removeItem('hirematch_user');
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;


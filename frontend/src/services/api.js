import axios from 'axios';

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    // When served via XAMPP Apache or tunnel under /dashboard/VJOBAI/, use reverse-proxied /dashboard/VJOBAI/api
    // This eliminates mixed-content HTTPS errors, cross-port firewall blocks, and CORS issues entirely.
    if (window.location.pathname.startsWith('/dashboard/VJOBAI')) {
      return '/dashboard/VJOBAI/api';
    }
    // In dev server (port 5173) or direct node hosting, use relative /api
    return '/api';
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


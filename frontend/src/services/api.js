import axios from 'axios';

const resolveBaseUrl = () => {
  // 1. Explicit env var — set this in Vercel/Render dashboard to your backend URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const { hostname, port, pathname } = window.location;

    // 2. Local XAMPP Apache: served under /dashboard/VJOBAI/
    if (pathname.startsWith('/dashboard/VJOBAI')) {
      return '/dashboard/VJOBAI/api';
    }

    // 3. Vite dev server (port 5173) — use Vite proxy /api
    if (port === '5173') {
      return '/api';
    }

    // 4. Cloud/Vercel deployment at root — relative /api (handled by vercel.json rewrites)
    if (hostname.includes('vercel.app') || hostname.includes('render.com') || hostname.includes('netlify.app')) {
      return '/api';
    }

    // 5. GitHub Pages deployment: connect to live public tunnel backend
    if (hostname.includes('github.io')) {
      return 'https://vjobai-venu.loca.lt/dashboard/VJOBAI/api';
    }

    // 6. LAN IP / unknown — dynamically target port 5001 on the same host
    return `http://${hostname}:5001/api`;
  }
  return 'http://localhost:5001/api';
};

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
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


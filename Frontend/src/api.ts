import axios from 'axios';

// Create a custom, reusable Axios client
export const api = axios.create({
  baseURL: 'http://localhost:5000', // Empty base URL is routed by the Vite dev proxy / Express directly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically inject JWT Token on every outbound request
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('retro_coder_jwt_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Error reading token from localStorage:', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

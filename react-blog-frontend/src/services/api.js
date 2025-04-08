import axios from 'axios';
import { store } from '../redux/store';
import { refreshToken, logout } from '../redux/slices/authSlice';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/', // Fix: Use import.meta.env for Vite
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ensure trailing slashes for Django REST Framework
    if (config.url && !config.url.endsWith('/') && !config.url.includes('?')) {
      config.url = `${config.url}/`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Token expired, attempting refresh...');
        // Dispatch refresh token action
        const result = await store.dispatch(refreshToken()).unwrap();

        if (result && result.access) {
          console.log('Token refresh successful, retrying request');
          // If token refresh was successful, retry the original request
          originalRequest.headers.Authorization = `Bearer ${result.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh token fails, logout user
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      // The request was made and the server responded with a status code
      // outside of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config?.url,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Setup:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

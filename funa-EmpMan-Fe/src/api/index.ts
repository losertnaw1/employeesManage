import axios from 'axios';

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log environment variables for debugging
console.log('API Service - Environment mode:', import.meta.env.MODE);
console.log('API Service - API URL:', API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export * from './employeesApi';
export * from './locationsApi';
export * from './chineseLevelsApi';
export * from './educationLevelsApi';
export * from './ranksApi';
export * from './skillsApi';
export * from './projectsApi';
export * from './referrersApi';

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

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

import { AdminLoginRequest, AdminLoginResponse, PasswordResetRequest, ResetPasswordRequest } from '../types/admin';
import apiService from './apiService';

// Auth services
export const authService = {
  // Login
  login: async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const response = await apiService.post('/auth/login', credentials);

    // Store tokens in localStorage
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiService.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  // Get current admin
  getCurrentAdmin: async () => {
    const response = await apiService.get('/auth/me');
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (data: PasswordResetRequest): Promise<void> => {
    await apiService.post('/auth/forgot-password', data);
  },

  // Reset password
  resetPassword: async (token: string, data: ResetPasswordRequest): Promise<void> => {
    await apiService.post(`/auth/reset-password?token=${token}`, data);
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  }
};

// Export the API instance for other services to use
export default apiService;

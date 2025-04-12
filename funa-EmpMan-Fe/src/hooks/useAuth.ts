import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  updateAdmin,
  setLoading
} from '../store/slices/authSlice';
import { RootState } from '../store/store';
import { authService } from '../services/authService';
import { AdminLoginRequest } from '../types/admin';

/**
 * Custom hook for authentication functionality
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { admin, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Flag to prevent circular dependencies
  const [initialized, setInitialized] = useState(false);

  /**
   * Clear authentication state from localStorage and Redux
   */
  const clearAuthState = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(logoutAction());
  }, [dispatch]);

  /**
   * Login with credentials
   */
  const login = useCallback(
    async (credentials: AdminLoginRequest) => {
      try {
        dispatch(loginStart());
        const response = await authService.login(credentials);
        dispatch(
          loginSuccess({
            admin: response.admin,
            accessToken: response.accessToken
          })
        );
        return response;
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          'Login failed. Please check your credentials.';
        dispatch(loginFailure(errorMessage));
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      clearAuthState();
    } catch (error) {
      console.error('Logout error:', error);
      clearAuthState();
    }
  }, [clearAuthState]);

  /**
   * Get current admin information
   */
  const getCurrentAdmin = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      dispatch(setLoading(true));
      const adminData = await authService.getCurrentAdmin();
      dispatch(updateAdmin(adminData));
      return adminData;
    } catch (error: any) {
      console.error('Get current admin error:', error);

      if (error.message === 'Network Error') {
        // Don't logout on network errors
        return null;
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        // Clear auth state on authentication errors
        clearAuthState();
      }
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, clearAuthState]);

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (roles: string | string[]) => {
      if (!isAuthenticated || !admin) return false;

      const rolesToCheck = Array.isArray(roles) ? roles : [roles];
      return rolesToCheck.includes(admin.role);
    },
    [isAuthenticated, admin]
  );

  // Check for token in localStorage on initial load
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      const token = localStorage.getItem('accessToken');
      if (token && !admin) {
        getCurrentAdmin();
      }
    }
  }, [admin, getCurrentAdmin, initialized]);

  return {
    admin,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    getCurrentAdmin,
    hasRole
  };
};

export default useAuth;

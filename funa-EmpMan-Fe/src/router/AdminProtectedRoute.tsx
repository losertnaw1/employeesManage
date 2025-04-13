import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface AdminProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
}

const AdminProtectedRoute = ({
  children,
  requiredRoles = ['admin', 'superadmin', 'editor']
}: AdminProtectedRouteProps) => {
  const { isAuthenticated, loading, admin, hasRole } = useAuth();

  // Check if user is authenticated and has required role
  const isAuthorized = isAuthenticated && admin && hasRole(requiredRoles);

  // If still loading, return null
  if (loading) {
    return null;
  }

  // If not authorized, redirect to login
  if (!isAuthorized) {
    return <Navigate to="/admin/login" replace />;
  }

  // If authorized, render children
  return <>{children}</>;
};

export default AdminProtectedRoute;

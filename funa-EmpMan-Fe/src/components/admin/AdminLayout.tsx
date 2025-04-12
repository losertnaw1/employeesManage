import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import '../../styles/AdminLayout.css';

const AdminLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, loading, getCurrentAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated && !loading) {
      navigate('/admin/login');
    } else if (isAuthenticated) {
      // Get current admin info if authenticated
      getCurrentAdmin();
    }
  }, [isAuthenticated, loading, navigate, getCurrentAdmin]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>{t('loading')}</p>
      </div>
    );
  }
  
  // Only render layout if authenticated
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <AdminHeader toggleSidebar={toggleSidebar} />
        
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

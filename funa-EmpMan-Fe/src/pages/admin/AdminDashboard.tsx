import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { admin, hasRole } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    newEmployeesThisMonth: 0
  });
  
  useEffect(() => {
    // In a real app, you would fetch these stats from an API
    // For now, we'll use mock data
    setStats({
      totalEmployees: 125,
      activeEmployees: 118,
      newEmployeesThisMonth: 7
    });
  }, []);
  
  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>{t('adminDashboard')}</h1>
        <p>
          {t('welcomeAdmin', { name: admin?.fullName || admin?.username })}
        </p>
      </div>
      
      <div className="admin-stats-container">
        <div className="admin-stat-card">
          <div className="admin-stat-icon total-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="admin-stat-content">
            <h3>{t('totalEmployees')}</h3>
            <p className="admin-stat-value">{stats.totalEmployees}</p>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-icon active-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="admin-stat-content">
            <h3>{t('activeEmployees')}</h3>
            <p className="admin-stat-value">{stats.activeEmployees}</p>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-icon new-icon">
            <i className="fas fa-user-plus"></i>
          </div>
          <div className="admin-stat-content">
            <h3>{t('newEmployeesThisMonth')}</h3>
            <p className="admin-stat-value">{stats.newEmployeesThisMonth}</p>
          </div>
        </div>
      </div>
      
      {hasRole('superadmin') && (
        <div className="admin-actions-container">
          <h2>{t('adminActions')}</h2>
          <div className="admin-actions-grid">
            <div className="admin-action-card">
              <h3>{t('manageAdmins')}</h3>
              <p>{t('manageAdminsDescription')}</p>
              <button 
                className="admin-action-button"
                onClick={() => window.location.href = '/admin/manage'}
              >
                {t('manage')}
              </button>
            </div>
            
            <div className="admin-action-card">
              <h3>{t('systemSettings')}</h3>
              <p>{t('systemSettingsDescription')}</p>
              <button 
                className="admin-action-button"
                onClick={() => window.location.href = '/admin/settings'}
              >
                {t('settings')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

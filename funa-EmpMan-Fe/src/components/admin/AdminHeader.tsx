import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import LanguageSwitcher from '../LanguageSwitcher';
import '../../styles/AdminHeader.css';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };
  
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button className="admin-menu-toggle" onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="admin-header-title">{t('adminPanel')}</h1>
      </div>
      
      <div className="admin-header-right">
        <LanguageSwitcher />
        
        <div className="admin-user-menu">
          <button 
            className="admin-user-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="admin-user-avatar">
              {admin?.username.charAt(0).toUpperCase()}
            </div>
            <span className="admin-user-name">{admin?.username}</span>
          </button>
          
          {showDropdown && (
            <div className="admin-dropdown-menu">
              <div className="admin-dropdown-header">
                <p className="admin-dropdown-name">{admin?.fullName}</p>
                <p className="admin-dropdown-role">{t(admin?.role || '')}</p>
              </div>
              
              <ul className="admin-dropdown-list">
                <li>
                  <button onClick={() => navigate('/admin/profile')}>
                    {t('profile')}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/admin/settings')}>
                    {t('settings')}
                  </button>
                </li>
                <li className="admin-dropdown-divider"></li>
                <li>
                  <button onClick={handleLogout} className="admin-logout-button">
                    {t('logout')}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

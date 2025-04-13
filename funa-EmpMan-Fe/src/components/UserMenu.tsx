import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';
import '../styles/UserMenu.css';

const UserMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get first letter of name for avatar
  const getInitial = () => {
    if (admin?.fullName) {
      return admin.fullName.charAt(0).toUpperCase();
    }
    if (admin?.username) {
      return admin.username.charAt(0).toUpperCase();
    }
    return '?';
  };

  // If no admin data, don't render the menu
  if (!admin) {
    return null;
  }

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle menu item clicks
  const handleProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button
        className="user-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('userMenu') || 'User menu'}
        aria-expanded={isOpen}
      >
        <div className="user-avatar">
          {getInitial()}
        </div>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-info">
            <div className="user-avatar large">
              {getInitial()}
            </div>
            <div className="user-details">
              <div className="user-name">{admin?.fullName}</div>
              <div className="user-role">{t(admin?.role || '')}</div>
              <div className="user-email">{admin?.email}</div>
            </div>
          </div>

          <div className="menu-items">
            <button onClick={handleProfile} className="menu-item">
              <i className="menu-icon profile-icon">👤</i>
              <span>{t('userProfile')}</span>
            </button>

            <button onClick={handleChangePassword} className="menu-item">
              <i className="menu-icon password-icon">🔑</i>
              <span>{t('userChangePassword')}</span>
            </button>

            <button onClick={handleLogout} className="menu-item">
              <i className="menu-icon logout-icon">🚪</i>
              <span>{t('userLogout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

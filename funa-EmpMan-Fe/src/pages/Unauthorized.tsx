import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';
import '../styles/Unauthorized.css';

const Unauthorized = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">
          <i className="material-icons">lock</i>
        </div>
        
        <h1 className="unauthorized-title">{t('unauthorized') || 'Access Denied'}</h1>
        
        <p className="unauthorized-message">
          {t('unauthorizedMessage') || 'You do not have permission to access this page.'}
        </p>
        
        <div className="unauthorized-actions">
          <button 
            className="unauthorized-back-button"
            onClick={handleGoBack}
          >
            {t('back')}
          </button>
          
          <button 
            className="unauthorized-logout-button"
            onClick={handleLogout}
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;

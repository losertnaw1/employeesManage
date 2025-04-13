import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import '../styles/Profile.css';

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { admin, logout, getCurrentAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: ''
  });

  // Load admin data when component mounts
  useEffect(() => {
    if (admin) {
      setFormData({
        username: admin.username || '',
        email: admin.email || '',
        fullName: admin.fullName || '',
        role: admin.role || ''
      });
    } else {
      // If admin data is not available, fetch it
      getCurrentAdmin();
    }
  }, [admin, getCurrentAdmin]);

  // If admin data is still loading, show loading state
  if (!admin) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the profile data to the server here
    console.log('Profile data saved:', formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
  };

  // Get initial for avatar
  const getInitial = () => {
    if (formData.fullName) {
      return formData.fullName.charAt(0).toUpperCase();
    }
    if (formData.username) {
      return formData.username.charAt(0).toUpperCase();
    }
    return '?';
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">{t('profile')}</h1>

      <div className="profile-card">
        <div className="profile-card-header">
          <h2 className="profile-card-title">{t('profileInformation')}</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`profile-edit-button ${isEditing ? 'cancel' : ''}`}
          >
            {isEditing ? t('profileCancel') : t('editProfile')}
          </button>
        </div>

        <div className="profile-avatar">
          {getInitial()}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="profile-form-group">
              <label className="profile-label" htmlFor="username">
                {t('username')}
              </label>
              <input
                className="profile-input"
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                disabled={true} // Username cannot be changed
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label" htmlFor="email">
                {t('email')}
              </label>
              <input
                className="profile-input"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="profile-form-group">
              <label className="profile-label" htmlFor="fullName">
                {t('fullName')}
              </label>
              <input
                className="profile-input"
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="profile-save-button">
              {t('saveChanges')}
            </button>
          </form>
        ) : (
          <div>
            <div className="profile-info-item">
              <span className="profile-info-label">{t('username')}:</span>
              <span className="profile-info-value">{formData.username}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">{t('profileEmail')}:</span>
              <span className="profile-info-value">{formData.email}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">{t('profileFullName')}:</span>
              <span className="profile-info-value">{formData.fullName}</span>
            </div>
            <div className="profile-info-item">
              <span className="profile-info-label">{t('profileRole')}:</span>
              <span className="profile-info-value">{t(formData.role)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="profile-card">
        <h2 className="profile-card-title">{t('accountSettings')}</h2>

        <div className="profile-actions">
          <button
            onClick={() => navigate('/change-password')}
            className="profile-button primary"
          >
            {t('userChangePassword')}
          </button>

          <button
            onClick={handleLogout}
            className="profile-button danger"
          >
            {t('userLogout')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

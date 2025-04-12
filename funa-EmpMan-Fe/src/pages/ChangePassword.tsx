import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';
import '../styles/ChangePassword.css';

const ChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError(t('currentPasswordRequired'));
      return false;
    }

    if (!formData.newPassword) {
      setError(t('newPasswordRequired'));
      return false;
    }

    if (formData.newPassword.length < 8) {
      setError(t('passwordTooShort'));
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // This would be an API call in a real application
      // await authService.changePassword(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Redirect to profile after 2 seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || t('changePasswordError'));
    } finally {
      setLoading(false);
    }
  };

  // If admin data is still loading, show loading state
  if (!admin) {
    return (
      <div className="change-password-container">
        <div className="change-password-loading">
          <div className="loading-spinner"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="change-password-container">
      <h1 className="change-password-title">{t('changePassword')}</h1>

      <div className="change-password-card">
        {success ? (
          <div className="change-password-success">
            <div className="success-icon">✓</div>
            <h2>{t('passwordChanged')}</h2>
            <p>{t('redirectingToProfile')}</p>
          </div>
        ) : (
          <>
            <div className="user-info">
              <p>
                <strong>{t('username')}:</strong> {admin?.username}
              </p>
            </div>

            <form className="change-password-form" onSubmit={handleSubmit}>
              {error && <div className="change-password-error">{error}</div>}

              <div className="form-group">
                <label htmlFor="currentPassword">{t('currentPassword')}</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">{t('newPassword')}</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => navigate('/profile')}
                  disabled={loading}
                >
                  {t('cancel')}
                </button>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? t('changing') : t('changePassword')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;

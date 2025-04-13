import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get token and username from URL
    const tokenParam = searchParams.get('token');
    const usernameParam = searchParams.get('username');

    if (tokenParam) setToken(tokenParam);
    if (usernameParam) setUsername(usernameParam);

    if (!tokenParam || !usernameParam) {
      setError(t('invalidResetLink') || 'Invalid password reset link');
    }
  }, [searchParams, t]);

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError(t('passwordTooShort') || 'Password must be at least 8 characters long');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError(t('passwordsDoNotMatch') || 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await authService.resetPassword(token, {
        token,
        username,
        newPassword
      });

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(
        err.response?.data?.message ||
        t('resetError') ||
        'An error occurred while resetting your password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>{t('resetPassword')}</h1>
          <p>{t('resetPasswordSubtitle')}</p>
        </div>

        {success ? (
          <div className="reset-password-success">
            <div className="success-icon">✓</div>
            <h2>{t('passwordResetSuccess')}</h2>
            <p>{t('redirectingToLogin')}</p>
          </div>
        ) : (
          <form className="reset-password-form" onSubmit={handleSubmit}>
            {error && <div className="reset-password-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="username">{t('username')}</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">{t('newPassword')}</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password-button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? t('hide') : t('show')}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="reset-password-button"
              disabled={loading || !token || !username}
            >
              {loading ? t('resetting') : t('resetPassword')}
            </button>

            <div className="reset-password-links">
              <Link to="/login" className="back-link">
                {t('backToLogin')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../services/authService';
import '../styles/ForgotPassword.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setError(t('identifierRequired') || 'Please enter your username or email');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await authService.requestPasswordReset({ identifier: identifier.trim() });

      // Always show success message even if user doesn't exist (for security)
      setSuccess(true);
    } catch (err) {
      console.error('Password reset request error:', err);
      setError(t('resetRequestError') || 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>{t('forgotPassword')}</h1>
          <p>{t('forgotPasswordSubtitle')}</p>
        </div>

        {success ? (
          <div className="forgot-password-success">
            <div className="success-icon">✓</div>
            <h2>{t('checkYourEmail')}</h2>
            <p>{t('resetLinkSent')}</p>
            <Link to="/login" className="back-to-login-link">
              {t('backToLogin')}
            </Link>
          </div>
        ) : (
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            {error && <div className="forgot-password-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="identifier">{t('usernameOrEmail')}</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoFocus
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="forgot-password-button"
              disabled={loading}
            >
              {loading ? t('sending') : t('sendResetLink')}
            </button>

            <div className="forgot-password-links">
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

export default ForgotPassword;

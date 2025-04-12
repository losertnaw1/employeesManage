import React, { useState, useEffect } from 'react';
import Toast, { ToastType } from './Toast';
import '../styles/Toast.css';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Tạo một đối tượng toàn cục để quản lý toast
export const toast = {
  _addToast: null as ((message: string, type: ToastType, duration?: number) => void) | null,

  success(message: string, duration?: number) {
    if (this._addToast) {
      this._addToast(message, 'success', duration);
    }
  },

  error(message: string, duration?: number) {
    if (this._addToast) {
      this._addToast(message, 'error', duration);
    }
  },

  info(message: string, duration?: number) {
    if (this._addToast) {
      this._addToast(message, 'info', duration);
    }
  },

  warning(message: string, duration?: number) {
    if (this._addToast) {
      this._addToast(message, 'warning', duration);
    }
  }
};

const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    // Đăng ký hàm addToast với đối tượng toast toàn cục
    toast._addToast = (message: string, type: ToastType, duration?: number) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    return () => {
      toast._addToast = null;
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;

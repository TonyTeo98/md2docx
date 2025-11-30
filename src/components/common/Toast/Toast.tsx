import React, { useEffect } from 'react';
import { useStore, useToast } from '../../../store';
import styles from './Toast.module.css';

export const Toast: React.FC = () => {
  const toast = useToast();
  const hideToast = useStore((state) => state.hideToast);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <span className={styles.icon}>
        {toast.type === 'success' && '✓'}
        {toast.type === 'error' && '✕'}
        {toast.type === 'warning' && '⚠'}
        {toast.type === 'info' && 'ℹ'}
      </span>
      <span className={styles.message}>{toast.message}</span>
      <button className={styles.close} onClick={hideToast}>
        ×
      </button>
    </div>
  );
};

export default Toast;

import React from 'react';
import { useStore } from '../../../store';
import styles from './ThemeToggle.module.css';

export const ThemeToggle: React.FC = () => {
  const theme = useStore((state) => state.settings.theme);
  const setTheme = useStore((state) => state.setTheme);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className={`${styles.icon} ${theme === 'light' ? styles.active : ''}`}>
        ☀️
      </span>
      <span className={`${styles.icon} ${theme === 'dark' ? styles.active : ''}`}>
        🌙
      </span>
      <span
        className={styles.slider}
        style={{ transform: theme === 'dark' ? 'translateX(28px)' : 'translateX(0)' }}
      />
    </button>
  );
};

export default ThemeToggle;

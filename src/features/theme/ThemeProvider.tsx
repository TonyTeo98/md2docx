import React, { useEffect } from 'react';
import { useStore } from '../../store';
import { lightTheme, darkTheme } from './themes';
import type { ThemeColors } from '../../types';

function applyTheme(theme: 'light' | 'dark') {
  const colors: ThemeColors = theme === 'dark' ? darkTheme : lightTheme;
  const root = document.documentElement;

  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--foreground', colors.foreground);
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--secondary', colors.secondary);
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--border', colors.border);
  root.style.setProperty('--muted', colors.muted);
  root.style.setProperty('--muted-foreground', colors.mutedForeground);
  root.style.setProperty('--card', colors.card);
  root.style.setProperty('--card-foreground', colors.cardForeground);
  root.style.setProperty('--destructive', colors.destructive);
  root.style.setProperty('--success', colors.success);

  root.setAttribute('data-theme', theme);
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useStore((state) => state.settings.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;

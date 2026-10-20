import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // 'system' | 'dark' | 'light'
  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem('smarttheater_theme_mode') || 'system';
  });

  // The actual resolved theme: 'dark' | 'light'
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('smarttheater_theme_mode');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      let active = 'light';
      if (themePreference === 'system') {
        active = mediaQuery.matches ? 'dark' : 'light';
      } else {
        active = themePreference;
      }
      setResolvedTheme(active);
      document.documentElement.setAttribute('data-theme', active);
      document.documentElement.style.colorScheme = active;
    };

    updateResolvedTheme();

    // Listen for system theme changes in real-time
    const handleSystemChange = () => {
      if (themePreference === 'system') {
        updateResolvedTheme();
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemChange);
      return () => mediaQuery.removeListener(handleSystemChange);
    }
  }, [themePreference]);

  const setThemeMode = (mode) => {
    setThemePreference(mode);
    localStorage.setItem('smarttheater_theme_mode', mode);
  };

  const toggleTheme = () => {
    // Cycles: system -> dark -> light -> system
    if (themePreference === 'system') {
      setThemeMode(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else if (themePreference === 'dark') {
      setThemeMode('light');
    } else {
      setThemeMode('system');
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        resolvedTheme,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

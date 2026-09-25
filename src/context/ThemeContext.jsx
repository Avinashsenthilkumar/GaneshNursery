import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Light / dark / follow-the-system. The choice is written to a data-theme
// attribute on <html>, which the stylesheet keys off, and to localStorage so
// it survives a reload. The <meta name="theme-color"> is updated too, so the
// browser and Android task-switcher chrome match the page instead of flashing
// the wrong colour on every launch.
const ThemeContext = createContext(null);
const STORAGE_KEY = 'ganesh-theme';
const BAR = { light: '#FBF7EE', dark: '#0E1A11' };

function systemPrefersDark() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readStored() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(readStored);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  // Follow the OS while the preference is "system".
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = e => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);
    root.style.colorScheme = resolved;

    // Keep the browser chrome in step. Without this the address bar stays the
    // light colour declared in index.html even in dark mode.
    document.head
      .querySelectorAll('meta[name="theme-color"]')
      .forEach(el => el.remove());
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = BAR[resolved];
    document.head.appendChild(meta);

    try { localStorage.setItem(STORAGE_KEY, preference); } catch { /* private mode */ }
  }, [resolved, preference]);

  const setTheme = useCallback(next => setPreference(next), []);
  const toggle = useCallback(() => setPreference(resolved === 'dark' ? 'light' : 'dark'), [resolved]);

  const value = useMemo(
    () => ({ preference, resolved, setTheme, toggle, isDark: resolved === 'dark' }),
    [preference, resolved, setTheme, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

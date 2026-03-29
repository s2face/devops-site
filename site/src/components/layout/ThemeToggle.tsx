'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem('theme');
      const isDark = storedTheme === 'dark' || 
        (!storedTheme && document.documentElement.classList.contains('dark'));
      setDark(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      // localStorage может быть недоступен в режиме инкогнито
      console.warn('localStorage not available:', error);
    }
  }, []);

  const toggle = () => {
    const newDark = !dark;
    setDark(newDark);
    try {
      localStorage.setItem('theme', newDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newDark);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  // Избегаем гидратационного несоответствия
  if (!mounted) {
    return (
      <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800" aria-label="Toggle Theme" disabled>
        <Sun className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button onClick={toggle} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800" aria-label="Toggle Theme">
      {dark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle-btn"
      aria-label="Toggle Theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <div key={theme}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </div>
      </AnimatePresence>
    </button>
  );
}

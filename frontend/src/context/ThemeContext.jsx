import { createContext, useContext, useEffect, useState } from 'react';

// keep context internal to this file so the module only exports React components
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('gw-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove both, then add the current one
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    localStorage.setItem('gw-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// helper hook (kept internal and attached to the provider so this file
// only exports a React component — satisfying fast refresh requirements)
const useTheme = () => useContext(ThemeContext);

ThemeProvider.useTheme = useTheme;

export default ThemeProvider;

// components/ThemeToggle.js
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default is now true
  
  useEffect(() => {
    // Check if user has explicitly chosen light mode
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark-mode');
    }
  }, []);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };
  
  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

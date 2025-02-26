import Head from 'next/head';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children, title = 'The Pub - D&D 5e Homebrew' }) {
  const [contentWidth, setContentWidth] = useState('centered');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Map content width settings to percentage-based values
  const widthMap = {
    narrow: { width: '25%', maxWidth: '25%', margin: '0 auto' },
    centered: { width: '40%', maxWidth: '40%', margin: '0 auto' },
    wide: { width: '90%', maxWidth: '90%', margin: '0 auto' }
  };

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark-mode');
    }
    
    // Initialize content width
    const savedWidth = localStorage.getItem('contentWidth');
    if (savedWidth && widthMap[savedWidth]) {
      setContentWidth(savedWidth);
    }
    
    // Close sidebar when clicking outside on mobile
    const handleClickOutside = (event) => {
      const isMobile = window.innerWidth < 768;
      if (isMobile && sidebarOpen && !event.target.closest('.sidebar') && 
          !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen, widthMap]);

  const handleWidthChange = (newWidth) => {
    setContentWidth(newWidth);
    localStorage.setItem('contentWidth', newWidth);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`container ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="D&D 5e homebrew content - bestiary, spells, items" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>
      
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <div className="main-content-inner" style={widthMap[contentWidth]}>
          <div className="content-controls">
            <ThemeToggle />
            <div className="width-control">
              <div className="width-options">
                <label className={contentWidth === 'narrow' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="width"
                    value="narrow"
                    checked={contentWidth === 'narrow'}
                    onChange={() => handleWidthChange('narrow')}
                  />
                  Narrow
                </label>
                <label className={contentWidth === 'centered' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="width"
                    value="centered"
                    checked={contentWidth === 'centered'}
                    onChange={() => handleWidthChange('centered')}
                  />
                  Centered
                </label>
                <label className={contentWidth === 'wide' ? 'active' : ''}>
                  <input
                    type="radio"
                    name="width"
                    value="wide"
                    checked={contentWidth === 'wide'}
                    onChange={() => handleWidthChange('wide')}
                  />
                  Wide
                </label>
              </div>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}

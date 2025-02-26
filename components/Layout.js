import Head from 'next/head';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Layout({ children, title = 'The Pub - D&D 5e Homebrew' }) {
  const [contentWidth, setContentWidth] = useState('centered');
  
  // Map content width settings to actual CSS values
  const widthMap = {
    narrow: '600px',
    centered: '900px',
    wide: '90%'
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
  }, []);

  const handleWidthChange = (newWidth) => {
    setContentWidth(newWidth);
    localStorage.setItem('contentWidth', newWidth);
  };

  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <meta name="description" content="D&D 5e homebrew content - bestiary, spells, items" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Sidebar />
      
      <main className="main-content">
        <div className="main-content-inner" style={{ maxWidth: widthMap[contentWidth] }}>
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
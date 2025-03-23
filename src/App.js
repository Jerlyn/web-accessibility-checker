import React, { useState, useEffect } from 'react';
import AccessibilityChecker from './components/AccessibilityChecker';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Check for system preference on mount
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="theme-toggle">
        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle-button"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <main id="main-content">
        <AccessibilityChecker />
      </main>
      <footer>
        <div className="container">
          <p>
            Created with a commitment to making the web accessible to all.
          </p>
          <div className="footer-links">
            <a href="https://www.w3.org/WAI/WCAG22/quickref/?versions=2.2" target="_blank" rel="noopener noreferrer">WCAG 2.2 Guidelines</a>
            <a href="https://www.w3.org/WAI/tutorials/" target="_blank" rel="noopener noreferrer">W3C Tutorials</a>
            <a href="https://github.com/Jerlyn/web-accessibility-checker" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import './App.css';
import SignIn from './SignIn';

/**
 * PUBLIC_INTERFACE
 * App is the root component that sets up theme toggling and renders the SignIn screen.
 * Returns the Sign In UI matching the extracted Figma design, wrapped in a themed container.
 */
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <SignIn />
      </header>
    </div>
  );
}

export default App;

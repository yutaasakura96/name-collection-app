import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import NameForm from '@/components/NameForm';
import NamesList from '@/components/NameList';
import { useEffect } from 'react';

function App() {
  // Initialize theme from localStorage or default to 'light'
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  // Theme toggle functionality
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Add event listener for theme toggle buttons
  useEffect(() => {
    const themeToggleButtons = document.querySelectorAll('[data-toggle-theme]');
    themeToggleButtons.forEach(button => {
      button.addEventListener('click', toggleTheme);
    });

    return () => {
      themeToggleButtons.forEach(button => {
        button.removeEventListener('click', toggleTheme);
      });
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-base-200">
        <Navigation />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<NameForm />} />
            <Route path="/names" element={<NamesList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

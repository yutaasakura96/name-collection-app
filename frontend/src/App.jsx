import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import NameForm from '@/components/NameForm';
import NamesList from '@/components/NameList';
import LoginPage from '@/components/LoginPage';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ returnTo: location.pathname }} />;
  }

  return children;
};

function AppContent() {
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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <NameForm />
              </ProtectedRoute>
            } />
            <Route path="/names" element={
              <ProtectedRoute>
                <NamesList />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

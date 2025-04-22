// src/components/LoginPage.jsx
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      // Get the returnTo path from the location state or default to '/'
      const returnTo = location.state?.returnTo || '/';
      navigate(returnTo);
    }
  }, [isAuthenticated, navigate, location.state]);

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Name Collection App</h1>
          <p className="py-6">Welcome! Login to start managing your collection of names</p>
          <button onClick={() => login()} className="btn btn-primary">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

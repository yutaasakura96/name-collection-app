import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const returnTo = location.state?.returnTo || "/";
      navigate(returnTo);
    }
  }, [isAuthenticated, navigate, location.state]);

  return (
    <div className="hero min-h-screen bg-base-200 flex flex-col mt-40">
      <div className="hero-content text-center flex flex-col items-center justify-center">
        <div className="max-w-md space-y-8">
          <h1 className="text-6xl font-bold">Name Collection App</h1>
          <p className="text-xl">Welcome! Login to start managing your collection of names</p>
          <button onClick={() => login()} className="btn btn-primary btn-lg w-full">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

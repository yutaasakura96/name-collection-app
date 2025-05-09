import { useAuth } from "@/contexts/useAuth";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LoginPage = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const destination = location.state?.returnTo || "/";
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  return (
    <div className="hero min-h-screen bg-base-200 flex flex-col mt-40">
      <div className="hero-content text-center flex flex-col items-center justify-center">
        <div className="max-w-md space-y-8">
          <h1 className="text-6xl font-bold">Name Collection App</h1>
          <p className="text-xl">Welcome! Login to start managing your collection of names</p>
          <button onClick={login} className="btn btn-primary btn-lg w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

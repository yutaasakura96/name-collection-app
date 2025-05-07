import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import NamesList from "@/components/NameList";
import LoginPage from "@/components/LoginPage";
import NameFormModal from "@/components/NameFormModal";
import MockRoleSwitcher from "@/components/MockRoleSwitcher";
import RequirePermission from "@/components/common/RequirePermission";
// For testing purposes only
// import DebugAuth from '@/components/DebugAuth';
// import ConsoleDebugAuth from '@/components/ConsoleDebugAuth';

// Protected route component
const ProtectedRoute = ({
  children,
  permission = null,
  permissions = null,
  allPermissions = null,
  role = null,
}) => {
  const {
    isAuthenticated,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  } = useAuth();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);

  // This is a delay to avoid redirect loops during initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-xl"></div>
        {isAuthenticated && <p className="ml-2">Authenticating...</p>}
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ returnTo: location.pathname }} />;
  }

  // Check permissions
  if (permission && !hasPermission(permission)) {
    return <AccessDenied message={`You need '${permission}' permission to access this page.`} />;
  }

  if (permissions && !hasAnyPermission(...permissions)) {
    return (
      <AccessDenied
        message={`You need at least one of these permissions to access this page: ${permissions.join(
          ", "
        )}`}
      />
    );
  }

  if (allPermissions && !hasAllPermissions(...allPermissions)) {
    return (
      <AccessDenied
        message={`You need all of these permissions to access this page: ${allPermissions.join(
          ", "
        )}`}
      />
    );
  }

  // Check role
  if (role && !hasRole(role)) {
    return <AccessDenied message={`You need the '${role}' role to access this page.`} />;
  }

  // All checks passed, render children
  return children;
};

// Access denied component
const AccessDenied = ({ message }) => {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Access Denied</h1>
          <p className="py-6">{message || "You don't have permission to access this page."}</p>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [namesUpdated, setNamesUpdated] = useState(false);

  // Function to handle name addition
  const handleNameAdded = () => {
    setNamesUpdated((prev) => !prev);
  };

  // Initialize theme from localStorage or default to 'dark'
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-base-200">
        {isAuthenticated && (
          <Navigation
            onAddNameClick={() => document.getElementById("name-form-modal").showModal()}
          />
        )}

        {/* Name Form Modal - rendered globally */}
        <NameFormModal onNameAdded={handleNameAdded} />

        {/* Mock Role Switcher - only shown in development mode */}
        <MockRoleSwitcher />

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute permission="read:names">
                  <NamesList
                    key={namesUpdated ? "updated" : "initial"}
                    onAddNameClick={() => document.getElementById("name-form-modal").showModal()}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/names" element={<Navigate to="/" replace />} />

            {/* Add a route only accessible to admins */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <div className="hero min-h-screen bg-base-200">
                    <div className="hero-content text-center">
                      <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Admin Dashboard</h1>
                        <p className="py-6">This page is only accessible to administrators.</p>
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Catch-all route for pages that don't exist */}
            <Route
              path="*"
              element={
                <div className="hero min-h-screen bg-base-200">
                  <div className="hero-content text-center">
                    <div className="max-w-md">
                      <h1 className="text-5xl font-bold">404</h1>
                      <p className="py-6">The page you're looking for doesn't exist.</p>
                      <Link to="/" className="btn btn-primary">
                        Go Home
                      </Link>
                    </div>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      {/* For testing purposes only */}
      {/* <ConsoleDebugAuth /> */}
      <AppContent />
    </AuthProvider>
  );
}

export default App;

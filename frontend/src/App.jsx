import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import NamesList from "@/components/NameList";
import LoginPage from "@/components/LoginPage";
import NameFormModal from "@/components/NameFormModal";
// For testing purposes only
// import DebugAuth from '@/components/DebugAuth';
// import ConsoleDebugAuth from '@/components/ConsoleDebugAuth';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
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

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ returnTo: location.pathname }} />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isNameFormOpen, setIsNameFormOpen] = useState(false);
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
        {isAuthenticated && <Navigation onAddNameClick={() => setIsNameFormOpen(true)} />}
        {/* For testing purposes only */}
        {/* <DebugAuth /> */}
        {/* Name Form Modal */}
        <NameFormModal
          isOpen={isNameFormOpen}
          onClose={() => setIsNameFormOpen(false)}
          onNameAdded={handleNameAdded}
        />

        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <NamesList
                    key={namesUpdated ? "updated" : "initial"}
                    onAddNameClick={() => setIsNameFormOpen(true)}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/names" element={<Navigate to="/" replace />} />
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

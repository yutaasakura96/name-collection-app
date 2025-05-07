import { useState, useEffect } from "react";
import { setMockUserRole } from "@/services/mockService";

/**
 * A component for switching between mock roles in development mode
 * This is only shown in development mode with mock API enabled
 */
const MockRoleSwitcher = () => {
  const [currentRole, setCurrentRole] = useState(
    localStorage.getItem("mock_user_role") || "editor"
  );
  const [showSwitcher, setShowSwitcher] = useState(false);

  useEffect(() => {
    // Only show in development mode with mock API
    const isMockApiEnabled = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API === "true";
    setShowSwitcher(isMockApiEnabled);
  }, []);

  const handleRoleChange = (role) => {
    if (setMockUserRole(role)) {
      setCurrentRole(role);
      // Force reload to apply new role
      window.location.reload();
    }
  };

  if (!showSwitcher) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-3 bg-base-300 shadow-lg rounded-lg border border-base-content/10 z-50">
      <div className="font-semibold mb-2 flex items-center justify-between">
        <span>Mock Role:</span>
        <div className="badge badge-primary">{currentRole}</div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className={`btn btn-sm ${currentRole === "viewer" ? "btn-primary" : "btn-outline"}`}
          onClick={() => handleRoleChange("viewer")}
        >
          Viewer
        </button>
        <button
          className={`btn btn-sm ${currentRole === "editor" ? "btn-primary" : "btn-outline"}`}
          onClick={() => handleRoleChange("editor")}
        >
          Editor
        </button>
        <button
          className={`btn btn-sm ${currentRole === "admin" ? "btn-primary" : "btn-outline"}`}
          onClick={() => handleRoleChange("admin")}
        >
          Admin
        </button>
      </div>
      <div className="text-xs mt-2 opacity-70">For development testing only</div>
    </div>
  );
};

export default MockRoleSwitcher;

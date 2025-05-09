import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, Shield, LogOut, Settings, User } from "lucide-react";

const Navigation = () => {
  const { isAuthenticated, user, logout, userRoles, userPermissions, getHighestRole } = useAuth();
  const [showRoleInfo, setShowRoleInfo] = useState(false);

  // Get the user's highest role for display
  const highestRole = getHighestRole();

  // Function to get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "badge-primary";
      case "editor":
        return "badge-secondary";
      case "viewer":
        return "badge-accent";
      default:
        return "badge-neutral";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Settings className="h-4 w-4" />;
      case "editor":
        return <PlusCircle className="h-4 w-4" />;
      case "viewer":
        return <User className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const onLogoutClick = () => {
    logout();
  };

  return (
    <div className="navbar bg-base-100 shadow-lg mb-8">
      <div className="flex-1 ml-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Name Collection App
        </Link>

        {/* Role badge */}
        {isAuthenticated && highestRole !== "unauthenticated" && (
          <div
            className={`badge badge-sm ${getRoleBadgeColor(
              highestRole
            )} ml-2 gap-1 px-2 py-3 cursor-pointer`}
            onClick={() => setShowRoleInfo(!showRoleInfo)}
          >
            {getRoleIcon(highestRole)}
            <span className="capitalize">{highestRole}</span>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <div className="flex-none">
          <ul className="menu menu-horizontal px-5 gap-5">
            <li>
              <label className="swap swap-rotate">
                <input
                  type="checkbox"
                  data-toggle-theme="light,dark"
                  data-act-class="swap-active"
                  className="theme-controller"
                  value="light"
                />
                <svg
                  className="swap-on h-5 w-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>
                <svg
                  className="swap-off h-5 w-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
              </label>
            </li>
            <li className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt="User avatar" src={user?.picture} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <div className="font-semibold text-sm">{user?.name}</div>
                  <div className="text-xs">{user?.email}</div>
                </li>

                {showRoleInfo && (
                  <li>
                    <div className="p-2 my-1 bg-base-200 rounded-md text-xs">
                      <div className="font-semibold mb-1 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Your Access Level
                      </div>
                      <div className="mb-1">
                        Roles:{" "}
                        {userRoles.length > 0
                          ? userRoles.map((r) => (
                              <span key={r} className="badge badge-xs badge-outline ml-1">
                                {r}
                              </span>
                            ))
                          : "None"}
                      </div>
                      <div>
                        Permissions:
                        <div className="ml-1 mt-1 space-y-1">
                          {userPermissions.length > 0
                            ? userPermissions.map((p) => (
                                <div key={p} className="badge badge-xs badge-outline">
                                  {p}
                                </div>
                              ))
                            : "None"}
                        </div>
                      </div>
                    </div>
                  </li>
                )}

                <li>
                  <button onClick={onLogoutClick} className="flex items-center">
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navigation;

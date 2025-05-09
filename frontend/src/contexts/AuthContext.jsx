import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";
import AuthContext from "@/contexts/AuthContextObject";

export function AuthProvider({ children }) {
  const { isAuthenticated, loginWithRedirect, logout, user, getAccessTokenSilently, isLoading } =
    useAuth0();

  const [token, setToken] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [tokenError, setTokenError] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);

          // Decode the JWT token to extract roles and permissions
          const decodedToken = jwtDecode(accessToken);

          // Extract permissions
          const permissions = decodedToken.permissions || [];
          setUserPermissions(permissions);

          // Extract roles - Auth0 might use different claims for roles
          // Try the namespace format first, then fallback to 'roles'
          const namespacedRoles = decodedToken["https://name-collection-app/roles"];
          const roles = namespacedRoles || decodedToken.roles || [];
          setUserRoles(roles);

          setTokenError(null);
        } catch (error) {
          console.error("Error getting token", error);
          setTokenError(error.message);
        }
      } else {
        // Reset state when not authenticated
        setToken(null);
        setUserRoles([]);
        setUserPermissions([]);
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Helper function to check if the user has a specific permission
  const hasPermission = (permission) => {
    return userPermissions.includes(permission);
  };

  // Helper function to check if the user has a specific role
  const hasRole = (role) => {
    return userRoles.includes(role);
  };

  // Helper function to check if the user has any of the specified permissions
  const hasAnyPermission = (...permissions) => {
    return permissions.some((permission) => userPermissions.includes(permission));
  };

  // Helper function to check if the user has all of the specified permissions
  const hasAllPermissions = (...permissions) => {
    return permissions.every((permission) => userPermissions.includes(permission));
  };

  // Helper function to determine the highest role of the user
  const getHighestRole = () => {
    if (hasRole("admin")) return "admin";
    if (hasRole("editor")) return "editor";
    if (hasRole("viewer")) return "viewer";
    return "unauthenticated";
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    token,
    tokenError,
    userRoles,
    userPermissions,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
    getHighestRole,
    login: loginWithRedirect,
    logout: () => logout({ returnTo: window.location.origin }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

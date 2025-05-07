import { useAuth } from "@/contexts/AuthContext";

/**
 * RequirePermission component
 *
 * Conditionally renders children based on user permissions or roles
 *
 * @param {Object} props - Component props
 * @param {string} props.permission - Single permission to check
 * @param {Array} props.permissions - Array of permissions to check (any permission)
 * @param {Array} props.allPermissions - Array of permissions to check (all permissions)
 * @param {string} props.role - Role to check
 * @param {ReactNode} props.children - Children to render if permission check passes
 * @param {ReactNode} props.fallback - Fallback UI to render if permission check fails
 * @returns {ReactNode} Children or fallback depending on permission check
 */
const RequirePermission = ({
  permission,
  permissions,
  allPermissions,
  role,
  children,
  fallback = null,
}) => {
  const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions, isAuthenticated } =
    useAuth();

  // Not authenticated, return fallback
  if (!isAuthenticated) {
    return fallback;
  }

  // Check for a single permission
  if (permission && !hasPermission(permission)) {
    return fallback;
  }

  // Check for any of the permissions
  if (permissions && !hasAnyPermission(...permissions)) {
    return fallback;
  }

  // Check for all of the permissions
  if (allPermissions && !hasAllPermissions(...allPermissions)) {
    return fallback;
  }

  // Check for a role
  if (role && !hasRole(role)) {
    return fallback;
  }

  // All checks passed, render children
  return children;
};

export default RequirePermission;

package com.example.namecollection.util;

import java.util.Collection;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility class for checking user permissions
 */
@Component
public class PermissionUtil {

    /**
     * Check if the current user has a specific permission
     *
     * @param permission the permission to check for
     * @return true if the user has the permission, false otherwise
     */
    public boolean hasPermission(String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }

        String formattedPermission = "SCOPE_" + permission;
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(formattedPermission));
    }

    /**
     * Check if the current user has any of the specified permissions
     *
     * @param permissions the permissions to check for
     * @return true if the user has any of the permissions, false otherwise
     */
    public boolean hasAnyPermission(String... permissions) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }

        Collection<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toList());

        for (String permission : permissions) {
            String formattedPermission = "SCOPE_" + permission;
            if (authorities.contains(formattedPermission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the current user has all of the specified permissions
     *
     * @param permissions the permissions to check for
     * @return true if the user has all of the permissions, false otherwise
     */
    public boolean hasAllPermissions(String... permissions) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }

        Collection<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toList());

        for (String permission : permissions) {
            String formattedPermission = "SCOPE_" + permission;
            if (!authorities.contains(formattedPermission)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if the current user has a specific role
     *
     * @param role the role to check for
     * @return true if the user has the role, false otherwise
     */
    public boolean hasRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return false;
        }

        String formattedRole = "ROLE_" + role.toUpperCase();
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(formattedRole));
    }

    /**
     * Get all permissions for the current user
     *
     * @return the list of permissions
     */
    public Collection<String> getUserPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return java.util.Collections.emptyList();
        }

        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("SCOPE_"))
                .map(authority -> authority.substring(6)) // Remove "SCOPE_" prefix
                .collect(Collectors.toList());
    }

    /**
     * Get all roles for the current user
     *
     * @return the list of roles
     */
    public Collection<String> getUserRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return java.util.Collections.emptyList();
        }

        return authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .map(authority -> authority.substring(5)) // Remove "ROLE_" prefix
                .collect(Collectors.toList());
    }
}

# Role-Based Access Control (RBAC) Implementation Guide

This guide provides a comprehensive overview of the RBAC implementation in the Name Collection application.

## Table of Contents
1. [Overview](#overview)
2. [Role Structure](#role-structure)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Auth0 Configuration](#auth0-configuration)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## Overview

Role-Based Access Control (RBAC) is implemented to restrict user actions based on assigned roles. The application defines three roles:

- **Viewer**: Can only view names
- **Editor**: Can view, add, and edit names
- **Admin**: Can view, add, edit, and delete names

## Role Structure

Each role has specific permissions:

| Role | Permissions |
|------|------------|
| Viewer | `read:names` |
| Editor | `read:names`, `create:names`, `update:names` |
| Admin | `read:names`, `create:names`, `update:names`, `delete:names` |

## Backend Implementation

The backend enforces RBAC through:

1. **Security Configuration**: `SecurityConfig.java` configures Spring Security to verify JWT tokens and their permissions.
2. **JWT Authentication Converter**: `CustomJwtAuthenticationConverter.java` extracts roles and permissions from the Auth0 token.
3. **Method Security**: Controllers use `@PreAuthorize` annotations to secure endpoints based on permissions.
4. **Permission Utility**: `PermissionUtil.java` provides helper methods to check permissions programmatically.
5. **Error Handling**: Proper 403 Forbidden responses when permissions are missing.

### Key Files
- `src/main/java/com/example/namecollection/config/SecurityConfig.java`
- `src/main/java/com/example/namecollection/config/CustomJwtAuthenticationConverter.java`
- `src/main/java/com/example/namecollection/util/PermissionUtil.java`
- `src/main/java/com/example/namecollection/controller/NameController.java`

## Frontend Implementation

The frontend handles RBAC through:

1. **Auth Context**: `AuthContext.jsx` extracts and provides role/permission information from the JWT token.
2. **RequirePermission Component**: A reusable component to conditionally render UI based on permissions.
3. **Protected Routes**: The router checks permissions before allowing access to routes.
4. **Conditional UI**: Elements like edit/delete buttons only appear for users with proper permissions.
5. **Error Handling**: User-friendly messages when permission errors occur.

### Key Files
- `frontend/src/contexts/AuthContext.jsx`
- `frontend/src/components/common/RequirePermission.jsx`
- `frontend/src/App.jsx`
- `frontend/src/components/NameList.jsx`
- `frontend/src/components/NameFormModal.jsx`

## Auth0 Configuration

Auth0 is used for identity management and token issuance. Setup includes:

1. **Create Roles in Auth0**: Viewer, Editor, and Admin roles
2. **Define Permissions**: Create permissions that match those used in the application
3. **Assign Permissions to Roles**: Map permissions to each role in Auth0
4. **Custom Rules**: Create a rule to include permissions in the access token
5. **Assign Roles to Users**: Map users to appropriate roles

For detailed Auth0 setup instructions, see [Auth0-RBAC-Configuration-Guide.md](./Auth0-RBAC-Configuration-Guide.md).

## Testing

### Using Mock Mode in Development

For local development without Auth0, the application includes a mock mode:

1. Set `VITE_USE_MOCK_API=true` in `.env.development`
2. The `MockRoleSwitcher` component will appear in the bottom right corner
3. Use it to switch between different roles for testing

### Testing with Auth0

To test with actual Auth0 integration:

1. Set up Auth0 as described in the Auth0 configuration guide
2. Set `VITE_USE_MOCK_API=false` in `.env.development`
3. Create test users with different roles in Auth0
4. Log in with each user to test permission boundaries

### Expected Behavior by Role

**Viewer Role**:
- Can view the list of names
- Cannot add new names (Add button not visible)
- Cannot edit existing names (Edit button not visible)
- Cannot delete names (Delete button not visible)

**Editor Role**:
- Can view the list of names
- Can add new names
- Can edit existing names
- Cannot delete names (Delete button not visible)

**Admin Role**:
- Can view the list of names
- Can add new names
- Can edit existing names
- Can delete names
- Can access `/admin` route

## Troubleshooting

### Common Issues

**Token doesn't contain permissions**:
- Check Auth0 rule configuration
- Verify the API identifier in Auth0 matches `VITE_AUTH0_AUDIENCE`
- Ensure RBAC is enabled in Auth0 API settings

**403 Forbidden errors**:
- Verify the user has the required permissions in Auth0
- Check that the permissions are correctly extracted in `CustomJwtAuthenticationConverter`
- Ensure the token contains the expected scopes

**User can see action buttons but receives 403 when using them**:
- Ensure both frontend and backend use the same permission names
- Check that Auth0 permissions match those in the code
- Verify that the token contains all required permissions

### Debugging Tools

1. **JWT Decoder**: Use [jwt.io](https://jwt.io/) to inspect token contents
2. **Browser Console**: Auth state and permissions are logged
3. **Backend Logs**: Permission checks are logged at INFO level
4. **MockRoleSwitcher**: Use for testing in development

---

## Development Notes

### Adding New Permissions

To add a new permission:

1. Add it to Auth0 API permissions
2. Assign it to the appropriate roles in Auth0
3. Update the Auth0 rule to include it in tokens
4. Add appropriate `@PreAuthorize` annotations in backend
5. Update frontend permission checks

### Adding New Roles

To add a new role:

1. Create the role in Auth0
2. Define its permissions
3. Update the Auth0 rule
4. Adjust any role-specific UI or logic in the application

For further support, contact the development team.

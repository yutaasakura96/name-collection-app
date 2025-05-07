# Name Collection App - RBAC Implementation

This README provides an overview of the Role-Based Access Control (RBAC) implementation for the Name Collection application and steps to complete after implementing the code changes.

## Overview

The RBAC implementation for the Name Collection application provides three distinct roles:

- **Viewer**: Can only view the list of names
- **Editor**: Can view, add, and edit names
- **Admin**: Can view, add, edit, and delete names

Each role has specific permissions:
- `read:names`: View the list of names
- `create:names`: Add new names
- `update:names`: Edit existing names
- `delete:names`: Delete names

## Implemented Code Changes

The following files have been created or modified to implement RBAC:

### Backend
- `SecurityConfig.java`: JWT validation and endpoint security
- `CustomJwtAuthenticationConverter.java`: Extract roles and permissions from JWT
- `PermissionUtil.java`: Helper methods for permission checks
- `NameController.java`: Method-level security annotations
- `PublicController.java`: Public endpoints without authentication

### Frontend
- `AuthContext.jsx`: Extract and provide roles/permissions
- `RequirePermission.jsx`: Conditional UI rendering based on permissions
- `App.jsx`: Protected routes with permission checks
- `NameList.jsx`: Show/hide actions based on permissions
- `NameFormModal.jsx`: Permission-aware form for adding names
- `Navigation.jsx`: Role-based navigation items
- `MockRoleSwitcher.jsx`: Development tool for testing different roles

## Next Steps After Implementation

After implementing the RBAC code, follow these steps to complete the setup:

### 1. Auth0 Configuration

1. Create an Auth0 account if you don't have one
2. Create a new API with the following settings:
   - Name: Name Collection API
   - Identifier: `https://name-collection-api`
   - Enable RBAC: On
   - Add Permissions in Access Token: On
3. Create roles (viewer, editor, admin)
4. Add permissions:
   - `read:names`
   - `create:names`
   - `update:names`
   - `delete:names`
5. Assign permissions to roles according to the role structure
6. Create a rule for adding permissions to tokens (use `auth0-rules/add-permissions-to-token.js`)
7. Create test users and assign roles

For detailed Auth0 setup, refer to [Auth0-RBAC-Configuration-Guide.md](./Auth0-RBAC-Configuration-Guide.md).

### 2. Environment Configuration

1. Update the following environment files:

**Backend (.env)**:
```
AUTH0_AUDIENCE=https://name-collection-api
AUTH0_ISSUER_URI=https://{YOUR_AUTH0_DOMAIN}.auth0.com/
```

**Frontend (.env.development for local development)**:
```
VITE_API_URL=http://localhost:8080/api
VITE_USE_MOCK_API=true  # Set to false to use Auth0
VITE_AUTH0_DOMAIN={YOUR_AUTH0_DOMAIN}.auth0.com
VITE_AUTH0_CLIENT_ID={YOUR_AUTH0_CLIENT_ID}
VITE_AUTH0_AUDIENCE=https://name-collection-api
```

**Frontend (.env.production for production)**:
```
VITE_API_URL=/api
VITE_USE_MOCK_API=false
VITE_AUTH0_DOMAIN={YOUR_AUTH0_DOMAIN}.auth0.com
VITE_AUTH0_CLIENT_ID={YOUR_AUTH0_CLIENT_ID}
VITE_AUTH0_AUDIENCE=https://name-collection-api
```

### 3. Testing

1. Start the backend:
   ```
   cd backend
   ./gradlew bootRun
   ```

2. Start the frontend:
   ```
   cd frontend
   npm run dev
   ```

3. Testing in mock mode:
   - Ensure `VITE_USE_MOCK_API=true` in `.env.development`
   - Use the MockRoleSwitcher in the bottom-right corner to switch roles
   - Test functionality for each role

4. Testing with Auth0:
   - Set `VITE_USE_MOCK_API=false` in `.env.development`
   - Log in with different users assigned to different roles
   - Verify permissions work as expected

### 4. Adding NPM Packages

Install the required NPM packages for the frontend:

```bash
cd frontend
npm install jwt-decode
```

### 5. Updating Documentation

1. Update project documentation to reflect RBAC features
2. Document the permission model in the API documentation
3. Create user guides for different roles

## Development Workflow with RBAC

When developing new features:

1. Determine required permissions for the feature
2. Update controllers with appropriate `@PreAuthorize` annotations
3. Use `RequirePermission` component to conditionally render UI elements
4. Test with different roles using the MockRoleSwitcher

## Troubleshooting

If you encounter issues:

1. Check JWT token contents using [jwt.io](https://jwt.io/)
2. Verify Auth0 rule is adding permissions correctly
3. Check browser console logs for client-side permission errors
4. Examine backend logs for authorization failures

For more information, refer to the following documentation:
- [RBAC-Implementation-Guide.md](./RBAC-Implementation-Guide.md)
- [Auth0-RBAC-Configuration-Guide.md](./Auth0-RBAC-Configuration-Guide.md)

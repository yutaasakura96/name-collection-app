# Auth0 RBAC Configuration Guide for Name Collection App

This guide will walk you through the process of setting up Role-Based Access Control (RBAC) for the Name Collection Application using Auth0.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Configuring Auth0](#configuring-auth0)
   - [Create API and Enable RBAC](#create-api-and-enable-rbac)
   - [Create Roles](#create-roles)
   - [Define Permissions](#define-permissions)
   - [Assign Permissions to Roles](#assign-permissions-to-roles)
   - [Create Rule for Token Enhancement](#create-rule-for-token-enhancement)
4. [Assigning Roles to Users](#assigning-roles-to-users)
5. [Testing the Configuration](#testing-the-configuration)
6. [Troubleshooting](#troubleshooting)

## Overview

The Name Collection App uses three roles:
- **Viewer**: Can only view names
- **Editor**: Can view, add, and edit names
- **Admin**: Can view, add, edit, and delete names

Each role has specific permissions:
- `read:names`: View the list of names
- `create:names`: Add new names
- `update:names`: Edit existing names
- `delete:names`: Delete names

## Prerequisites

- An Auth0 account
- Access to the Auth0 Dashboard
- The Name Collection App repository

## Configuring Auth0

### Create API and Enable RBAC

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** > **APIs**
3. Click **Create API**
4. Enter the following details:
   - **Name**: Name Collection API
   - **Identifier**: `https://name-collection-api`
   - **Signing Algorithm**: RS256
5. Click **Create**
6. Go to the **Settings** tab of your newly created API
7. Scroll down to find **RBAC Settings**
8. Enable **Enable RBAC** and **Add Permissions in the Access Token**
9. Click **Save Changes**

### Create Roles

1. In the Auth0 Dashboard, navigate to **User Management** > **Roles**
2. Click **Create Role**
3. Create the following roles one by one:

**Viewer Role**
   - **Name**: viewer
   - **Description**: Can only view names
   - Click **Create**

**Editor Role**
   - **Name**: editor
   - **Description**: Can view, add, and edit names
   - Click **Create**

**Admin Role**
   - **Name**: admin
   - **Description**: Can view, add, edit, and delete names
   - Click **Create**

### Define Permissions

1. Go to **Applications** > **APIs** and select your Name Collection API
2. Navigate to the **Permissions** tab
3. Add the following permissions:

   - **Permission Name**: `read:names`
   - **Description**: Can view the list of names
   - Click **Add**

   - **Permission Name**: `create:names`
   - **Description**: Can add new names
   - Click **Add**

   - **Permission Name**: `update:names`
   - **Description**: Can edit existing names
   - Click **Add**

   - **Permission Name**: `delete:names`
   - **Description**: Can delete names
   - Click **Add**

### Assign Permissions to Roles

1. Go to **User Management** > **Roles**
2. Click on the **viewer** role
3. Navigate to the **Permissions** tab
4. Click **Add Permissions**
5. Select your API (Name Collection API)
6. Check the box for `read:names`
7. Click **Add Permissions**

8. Go back to **User Management** > **Roles**
9. Click on the **editor** role
10. Navigate to the **Permissions** tab
11. Click **Add Permissions**
12. Select your API (Name Collection API)
13. Check the boxes for:
    - `read:names`
    - `create:names`
    - `update:names`
14. Click **Add Permissions**

15. Go back to **User Management** > **Roles**
16. Click on the **admin** role
17. Navigate to the **Permissions** tab
18. Click **Add Permissions**
19. Select your API (Name Collection API)
20. Check the boxes for:
    - `read:names`
    - `create:names`
    - `update:names`
    - `delete:names`
21. Click **Add Permissions**

### Create Rule for Token Enhancement

To ensure roles and permissions are included in the token, create a custom rule:

1. In the Auth0 Dashboard, navigate to **Actions** > **Library**
2. Click **Create Action**
3. Choose **Build from scratch**
4. Name it "Add Roles and Permissions to Access Token"
5. Trigger should be "Login / Post Login"
6. Choose your runtime e.g. "Node 22"
7. Replace the code with the following:

```javascript
// @ts-nocheck
/**
 * @param {Event} event - Details about the user and the context.
 * @param {API} api - Used to modify tokens.
 */
exports.onExecutePostLogin = async (event, api) => {
  const applicationIdentifier = "https://name-collection-api";
  const namespacedRoleClaim = "https://name-collection-app/roles";

  let roles = [];
  let permissions = [];

  if (event.authorization && event.authorization.roles) {
    roles = event.authorization.roles;
  }

  const rolePermissions = {
    admin: ["read:names", "create:names", "update:names", "delete:names"],
    editor: ["read:names", "create:names", "update:names"],
    viewer: ["read:names"],
  };

  if (roles.length > 0) {
    roles.forEach((role) => {
      if (rolePermissions[role]) {
        permissions = permissions.concat(rolePermissions[role]);
      }
    });
    permissions = [...new Set(permissions)];
  } else {
    roles.push("viewer");
    permissions.push("read:names");
  }

  api.idToken.setCustomClaim(namespacedRoleClaim, roles);
  api.idToken.setCustomClaim("roles", roles);
  api.idToken.setCustomClaim("permissions", permissions);

  if (event.accessToken) {
    api.accessToken.setCustomClaim(namespacedRoleClaim, roles);
    api.accessToken.setCustomClaim("roles", roles);
    api.accessToken.setCustomClaim("permissions", permissions);
  }
};

```

8. Click **Deploy**
9. Go to **Actions** > **Triggers** > **post-login**
10. Find and drag your "Add Roles and Permissions to Access Token" action into the flow
11.	Click **Save**

## Assigning Roles to Users

1. In the Auth0 Dashboard, navigate to **User Management** > **Users**
2. Find and click on the user you want to assign a role to
3. Navigate to the **Roles** tab
4. Click **Assign Roles**
5. Select the role(s) you want to assign to the user
6. Click **Assign**

For testing purposes, consider creating at least 3 users, each with a different role:
- A user with the "viewer" role
- A user with the "editor" role
- A user with the "admin" role

## Testing the Configuration

1. Launch the Name Collection App
2. Log in with different user accounts (with different roles)
3. Verify that:
   - Viewer users can only view the list of names
   - Editor users can view, add, and edit names
   - Admin users can view, add, edit, and delete names

## Troubleshooting

### Invalid Token Claims

If permissions are not showing up in the token:
1. Verify that the rule is properly configured
2. Ensure that the API identifier in the rule matches your actual API identifier
3. Check that RBAC and "Add Permissions in the Access Token" are enabled in the API settings

### Permissions Not Being Applied

If the permissions are in the token but not being applied correctly:
1. Use a tool like [jwt.io](https://jwt.io/) to inspect the token
2. Check that the permissions are correctly included in the token
3. Verify that the backend is properly extracting and validating the permissions
4. Check browser console logs for any errors related to token validation

### Role Assignment Issues

If roles are not being assigned to users:
1. Verify that the user is properly authenticated
2. Check that the roles are correctly assigned in the Auth0 dashboard
3. Ensure that the rule for adding permissions to tokens is working correctly

For any other issues, consult the [Auth0 Documentation](https://auth0.com/docs) or contact Auth0 support.

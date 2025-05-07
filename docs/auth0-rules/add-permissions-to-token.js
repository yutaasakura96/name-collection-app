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

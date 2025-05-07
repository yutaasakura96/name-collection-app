import { mockNames } from "@/services/mockData.js";
import { v4 as uuidv4 } from "uuid";

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulate API errors, 10% chance of error
const simulateError = () => {
  if (Math.random() < 0.1) {
    throw new Error("Simulated API error");
  }
};

// Mock user roles and permissions for development
const mockRoles = {
  viewer: {
    permissions: ["read:names"],
  },
  editor: {
    permissions: ["read:names", "create:names", "update:names"],
  },
  admin: {
    permissions: ["read:names", "create:names", "update:names", "delete:names"],
  },
};

// Get the role from local storage or default to editor
const getMockUserRole = () => {
  const storedRole = localStorage.getItem("mock_user_role") || "editor";
  return storedRole;
};

// Set the mock user role in local storage
export const setMockUserRole = (role) => {
  if (mockRoles[role]) {
    localStorage.setItem("mock_user_role", role);
    return true;
  }
  return false;
};

// Get the permissions for the current mock user role
const getMockUserPermissions = () => {
  const role = getMockUserRole();
  return mockRoles[role]?.permissions || [];
};

// Check if the mock user has a specific permission
const hasMockPermission = (permission) => {
  const permissions = getMockUserPermissions();
  return permissions.includes(permission);
};

// Helper function to sort by field
const sortBy = (array, field, direction) => {
  return [...array].sort((a, b) => {
    let valueA = a[field];
    let valueB = b[field];

    // Handle special cases for dates
    if (field === "createdAt") {
      valueA = new Date(valueA);
      valueB = new Date(valueB);
    }

    if (valueA < valueB) {
      return direction === "ASC" ? -1 : 1;
    }
    if (valueA > valueB) {
      return direction === "ASC" ? 1 : -1;
    }
    return 0;
  });
};

// Helper function to filter array
const filterNames = (array, criteria) => {
  return array.filter((item) => {
    if (!criteria.searchTerm) return true;

    const searchTerm = criteria.searchTerm.toLowerCase();
    return (
      item.firstName.toLowerCase().includes(searchTerm) ||
      item.lastName.toLowerCase().includes(searchTerm)
    );
  });
};

// Helper function to paginate array
const paginate = (array, page, size) => {
  const startIndex = page * size;
  const endIndex = startIndex + size;
  return array.slice(startIndex, endIndex);
};

const mockService = {
  getAllNames: async () => {
    await delay(500);
    simulateError();

    // Check if user has permission to view names
    if (!hasMockPermission("read:names")) {
      throw {
        response: {
          status: 403,
          data: {
            message: "You don't have permission to view names.",
          },
        },
      };
    }

    return [...mockNames];
  },

  searchNames: async (criteria) => {
    await delay(500);
    simulateError();

    // Check if user has permission to view names
    if (!hasMockPermission("read:names")) {
      throw {
        response: {
          status: 403,
          data: {
            message: "You don't have permission to view names.",
          },
        },
      };
    }

    // Apply filters
    let filteredNames = filterNames(mockNames, criteria);

    // Apply sorting
    filteredNames = sortBy(filteredNames, criteria.sortBy, criteria.sortDirection);

    // Get total count before pagination
    const totalElements = filteredNames.length;

    // Apply pagination
    const pagedNames = paginate(filteredNames, criteria.page, criteria.size);

    return {
      content: pagedNames,
      pageNumber: criteria.page,
      pageSize: criteria.size,
      totalElements: totalElements,
      totalPages: Math.ceil(totalElements / criteria.size),
      first: criteria.page === 0,
      last: (criteria.page + 1) * criteria.size >= totalElements,
    };
  },

  addName: async (firstName, lastName) => {
    await delay(500);
    simulateError();

    // Check if user has permission to add names
    if (!hasMockPermission("create:names")) {
      throw {
        response: {
          status: 403,
          data: {
            message: "You don't have permission to add names.",
          },
        },
      };
    }

    const newName = {
      uuid: uuidv4(),
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
    };
    mockNames.push(newName);
    return newName;
  },

  updateName: async (uuid, firstName, lastName) => {
    await delay(500);
    simulateError();

    // Check if user has permission to update names
    if (!hasMockPermission("update:names")) {
      throw {
        response: {
          status: 403,
          data: {
            message: "You don't have permission to update names.",
          },
        },
      };
    }

    const index = mockNames.findIndex((name) => name.uuid === uuid);
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Name not found",
          },
        },
      };
    }
    mockNames[index] = {
      ...mockNames[index],
      firstName,
      lastName,
    };
    return mockNames[index];
  },

  deleteName: async (uuid) => {
    await delay(500);
    simulateError();

    // Check if user has permission to delete names
    if (!hasMockPermission("delete:names")) {
      throw {
        response: {
          status: 403,
          data: {
            message: "You don't have permission to delete names.",
          },
        },
      };
    }

    const index = mockNames.findIndex((name) => name.uuid === uuid);
    if (index === -1) {
      throw {
        response: {
          status: 404,
          data: {
            message: "Name not found",
          },
        },
      };
    }
    mockNames.splice(index, 1);
    return uuid;
  },

  // Get user permissions and roles
  getUserPermissions: async () => {
    await delay(300);

    const role = getMockUserRole();
    const permissions = getMockUserPermissions();

    return {
      roles: [role],
      permissions: permissions,
    };
  },
};

export default mockService;

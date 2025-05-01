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
    return [...mockNames];
  },

  searchNames: async (criteria) => {
    await delay(500);
    simulateError();

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
    const index = mockNames.findIndex((name) => name.uuid === uuid);
    if (index === -1) {
      throw new Error("Name not found");
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
    const index = mockNames.findIndex((name) => name.uuid === uuid);
    if (index === -1) {
      throw new Error("Name not found");
    }
    mockNames.splice(index, 1);
    return uuid;
  },
};

export default mockService;

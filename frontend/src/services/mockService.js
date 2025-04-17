import { mockNames } from "@/services/mockData.js";

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulate API errors
const simulateError = () => {
  if (Math.random() < 0.1) {
    // 10% chance of error
    throw new Error("Simulated API error");
  }
};

const mockService = {
  getAllNames: async () => {
    await delay(500); // Simulate network delay
    simulateError();
    return [...mockNames];
  },

  addName: async (firstName, lastName) => {
    await delay(500);
    simulateError();
    const newName = {
      id: mockNames.length + 1,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
    };
    mockNames.push(newName);
    return newName;
  },

  updateName: async (id, firstName, lastName) => {
    await delay(500);
    simulateError();
    const index = mockNames.findIndex((name) => name.id === id);
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

  deleteName: async (id) => {
    await delay(500);
    simulateError();
    const index = mockNames.findIndex((name) => name.id === id);
    if (index === -1) {
      throw new Error("Name not found");
    }
    mockNames.splice(index, 1);
    return id;
  },
};

export default mockService;

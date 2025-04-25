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

const mockService = {
  getAllNames: async () => {
    await delay(500);
    simulateError();
    return [...mockNames];
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

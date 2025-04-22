import axios from "axios";
import mockService from "@/services/mockService";

// Default values as fallbacks
const DEFAULT_DEV_API_URL = "http://localhost:8080/api";
const DEFAULT_PROD_API_URL = "/api";

// Use environment variables if provided, otherwise use defaults
const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || DEFAULT_PROD_API_URL
  : import.meta.env.VITE_API_URL || DEFAULT_DEV_API_URL;

// Create an axios instance with the given token
const createApiClient = (token) => {
  return axios.create({
    baseURL: API_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    timeout: 10000,
  });
};

// Use mock service in development mode if VITE_USE_MOCK_API is true
const useMockService =
  !import.meta.env.PROD && import.meta.env.VITE_USE_MOCK_API === "true";

// Service methods using either the axios instance or mock service
const apiService = {
  getAllNames: async (token) => {
    if (useMockService) {
      return mockService.getAllNames();
    }
    try {
      const apiClient = createApiClient(token);
      const response = await apiClient.get("/names");
      return response.data;
    } catch (error) {
      console.error("Error fetching names:", error);
      throw error;
    }
  },

  addName: async (firstName, lastName, token) => {
    if (useMockService) {
      return mockService.addName(firstName, lastName);
    }
    try {
      const apiClient = createApiClient(token);
      const response = await apiClient.post("/names", {
        firstName,
        lastName,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding name:", error);
      throw error;
    }
  },

  updateName: async (id, firstName, lastName, token) => {
    if (useMockService) {
      return mockService.updateName(id, firstName, lastName);
    }
    try {
      const apiClient = createApiClient(token);
      const response = await apiClient.put(`/names/${id}`, {
        firstName,
        lastName,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating name:", error);
      throw error;
    }
  },

  deleteName: async (id, token) => {
    if (useMockService) {
      return mockService.deleteName(id);
    }
    try {
      const apiClient = createApiClient(token);
      await apiClient.delete(`/names/${id}`);
      return id;
    } catch (error) {
      console.error("Error deleting name:", error);
      throw error;
    }
  },
};

export default apiService;

import axios from "axios";
import mockService from "@/services/mockService";

// Use environment variables if provided, otherwise use defaults fallbacks
const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "/api"
  : import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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
const useMockService = !import.meta.env.PROD && import.meta.env.VITE_USE_MOCK_API === "true";

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

  searchNames: async (criteria, token) => {
    if (useMockService) {
      return mockService.searchNames(criteria);
    }
    try {
      const apiClient = createApiClient(token);
      const queryParams = new URLSearchParams();

      if (criteria.firstName) queryParams.append("firstName", criteria.firstName);
      if (criteria.lastName) queryParams.append("lastName", criteria.lastName);
      queryParams.append("page", criteria.page.toString());
      queryParams.append("size", criteria.size.toString());
      queryParams.append("sortBy", criteria.sortBy);
      queryParams.append("sortDirection", criteria.sortDirection);

      const response = await apiClient.get(`/names/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error searching names:", error);
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

  updateName: async (uuid, firstName, lastName, token) => {
    if (useMockService) {
      return mockService.updateName(uuid, firstName, lastName);
    }
    try {
      const apiClient = createApiClient(token);
      const response = await apiClient.put(`/names/${uuid}`, {
        firstName,
        lastName,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating name:", error);
      throw error;
    }
  },

  deleteName: async (uuid, token) => {
    if (useMockService) {
      return mockService.deleteName(uuid);
    }
    try {
      const apiClient = createApiClient(token);
      await apiClient.delete(`/names/${uuid}`);
      return uuid;
    } catch (error) {
      console.error("Error deleting name:", error);
      throw error;
    }
  },
};

export default apiService;

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

// Create error handler for permissions
const handleApiError = (error) => {
  if (error.response) {
    // Handle specific error status codes
    switch (error.response.status) {
      case 401:
        console.error("Authentication error:", error);
        return Promise.reject({
          message: "You are not authenticated. Please log in again.",
          status: 401,
          response: error.response,
        });
      case 403:
        console.error("Permission denied:", error);
        return Promise.reject({
          message: "You don't have permission to perform this action.",
          status: 403,
          response: error.response,
        });
      case 404:
        console.error("Resource not found:", error);
        return Promise.reject({
          message: "The requested resource was not found.",
          status: 404,
          response: error.response,
        });
      default:
        console.error("API error:", error);
        return Promise.reject({
          message: error.response.data?.message || "An unexpected error occurred.",
          status: error.response.status,
          response: error.response,
        });
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Network error:", error);
    return Promise.reject({
      message: "Network error. Please check your connection.",
      status: 0,
    });
  } else {
    // Something happened in setting up the request
    console.error("Request error:", error);
    return Promise.reject({
      message: "Failed to send request.",
      status: 0,
    });
  }
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
      return handleApiError(error);
    }
  },

  searchNames: async (criteria, token) => {
    if (useMockService) {
      return mockService.searchNames(criteria);
    }
    try {
      const apiClient = createApiClient(token);
      const queryParams = new URLSearchParams();

      if (criteria.searchTerm) queryParams.append("searchTerm", criteria.searchTerm);
      queryParams.append("page", criteria.page.toString());
      queryParams.append("size", criteria.size.toString());
      queryParams.append("sortBy", criteria.sortBy);
      queryParams.append("sortDirection", criteria.sortDirection);

      const response = await apiClient.get(`/names/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
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
      return handleApiError(error);
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
      return handleApiError(error);
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
      return handleApiError(error);
    }
  },

  // Get user permissions from API
  getUserPermissions: async (token) => {
    if (useMockService) {
      return {
        permissions: ["read:names", "create:names", "update:names"],
        roles: ["editor"],
      };
    }
    try {
      const apiClient = createApiClient(token);
      const response = await apiClient.get("/names/permissions");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get public application info
  getAppInfo: async () => {
    if (useMockService) {
      return {
        name: "Name Collection App",
        version: "1.0.0",
        description: "A simple application to collect and manage names",
        roles: {
          viewer: "Can view names",
          editor: "Can create and edit names",
          admin: "Can delete names and manage the application",
        },
      };
    }
    try {
      const apiClient = createApiClient();
      const response = await apiClient.get("/public/info");
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default apiService;

import axios from "axios";

// Default values as fallbacks
const DEFAULT_DEV_API_URL = "http://localhost:8080/api";
const DEFAULT_PROD_API_URL = "/api";

// Use environment variables if provided, otherwise use defaults
const API_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || DEFAULT_PROD_API_URL
  : import.meta.env.VITE_API_URL || DEFAULT_DEV_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add request interceptor for logging or auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add auth tokens here in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for common error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (like 401, 403, 500, etc.)
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

// Service methods using the axios instance
const apiService = {
  getAllNames: async () => {
    try {
      const response = await apiClient.get("/names");
      return response.data;
    } catch (error) {
      console.error("Error fetching names:", error);
      throw error;
    }
  },

  addName: async (firstName, lastName) => {
    try {
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
};

export default apiService;

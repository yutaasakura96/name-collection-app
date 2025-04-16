import axios from "axios";

// When served by nginx, the /api path is proxied
// const API_URL =
//   window.location.hostname === "localhost"
//     ? "http://localhost:8080/api"
//     : "/api";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const API_URL = import.meta.env.PROD
  ? "/api" // In production (Docker/nginx), the /api path is handled by nginx proxy
  : "http://localhost:8080/api"; // Development (running with vite dev server)

const apiService = {
  getAllNames: async () => {
    try {
      const response = await axios.get(`${API_URL}/names`);
      return response.data;
    } catch (error) {
      console.error("Error fetching names:", error);
      throw error;
    }
  },

  addName: async (firstName, lastName) => {
    try {
      const response = await axios.post(`${API_URL}/names`, {
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

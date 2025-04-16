import axios from "axios";

const API_URL = "http://localhost:8080/api";

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

import { useAuth0 } from "@auth0/auth0-react";

export const useAuthService = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getToken = async () => {
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error("Error getting access token:", error);
      throw error;
    }
  };

  return {
    getToken,
  };
};

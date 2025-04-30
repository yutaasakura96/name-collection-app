import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

function ConsoleDebugAuth() {
  const auth = useAuth0();

  useEffect(() => {
    console.log("Auth0 Debug:", {
      isLoading: auth.isLoading,
      isAuthenticated: auth.isAuthenticated,
      error: auth.error
        ? {
            name: auth.error.name,
            message: auth.error.message,
            stack: auth.error.stack,
          }
        : null,
      user: auth.user,
      env: {
        apiUrl: import.meta.env.VITE_API_URL,
        domain: import.meta.env.VITE_AUTH0_DOMAIN,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      },
    });
  }, [auth.isLoading, auth.isAuthenticated, auth.error, auth.user]);

  return null;
}

export default ConsoleDebugAuth;

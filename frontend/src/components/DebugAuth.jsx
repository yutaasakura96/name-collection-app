import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const DebugAuth = () => {
  const { isLoading, isAuthenticated, error, user, getAccessTokenSilently } = useAuth0();
  const [tokenError, setTokenError] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          console.log("Token obtained successfully:", token.substring(0, 10) + "...");
        } catch (err) {
          console.error("Token error:", err);
          setTokenError(err.message);
        }
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div className="p-4 border rounded bg-base-200 my-4">
      <h2 className="text-lg font-bold">Auth0 Debug Info</h2>
      <pre className="text-sm bg-base-300 p-2 rounded overflow-auto my-2">
        isLoading: {isLoading.toString()}
        {"\n"}
        isAuthenticated: {isAuthenticated.toString()}
        {"\n"}
        error: {error ? error.message : "none"}
        {"\n"}
        tokenError: {tokenError || "none"}
        {"\n"}
        user: {user ? JSON.stringify(user, null, 2) : "none"}
      </pre>
    </div>
  );
};

export default DebugAuth;

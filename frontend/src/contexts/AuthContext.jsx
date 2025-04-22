import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {
    isAuthenticated,
    loginWithRedirect,
    logout,
    user,
    getAccessTokenSilently,
    isLoading
  } = useAuth0();

  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
        } catch (error) {
          console.error('Error getting token', error);
        }
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  const value = {
    isAuthenticated,
    isLoading,
    user,
    token,
    login: loginWithRedirect,
    logout: () => logout({ returnTo: window.location.origin }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

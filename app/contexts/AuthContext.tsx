// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  getAccessToken,
  storeTokens,
  storeUserData,
  getUserData,
  clearTokens,
} from "../utils/authUtils";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = await getAccessToken();
        const userData = await getUserData();

        if (token && userData) {
          setUser({ ...userData, token });
        }
      } catch (error) {
        console.error("Error during auth bootstrap:", error);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (accessToken, refreshToken, userInfo) => {
    try {
      // Store tokens and user data separately
      await storeTokens(accessToken, refreshToken);
      await storeUserData(userInfo);

      // Update state
      setUser({ ...userInfo, token: accessToken });
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearTokens();
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

type User = { email: string };
type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync("user").then((data) => {
      if (data) setUser(JSON.parse(data));
    });
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    await SecureStore.setItemAsync("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

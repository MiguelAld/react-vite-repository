import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("auth_token") || null;
  });

  const login = (data) => {
    setUser(data.user);
    setToken(data.token);

    localStorage.setItem("auth_user", JSON.stringify(data.user));
    localStorage.setItem("auth_token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("auth_user");
    localStorage.removeItem("auth_token");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
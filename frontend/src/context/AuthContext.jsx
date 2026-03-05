import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async ({ dni, password }) => {
    // De momento (demo). Luego lo conectamos al backend.
    // Ejemplo: si DNI empieza por "A" lo tratamos como ADMIN.
    const role = dni?.toUpperCase().startsWith("A") ? "ADMIN" : "VECINO";

    setUser({ dni, role });
    return { ok: true, role };
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth() debe usarse dentro de <AuthProvider>.");
  }
  return ctx;
}
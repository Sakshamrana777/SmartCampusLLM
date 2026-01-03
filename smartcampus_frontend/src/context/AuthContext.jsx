import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  const login = (data) => {
    // ✅ role is mandatory
    if (!data || !data.role) {
      console.error("Invalid auth payload", data);
      return;
    }

    // ✅ user_id may be null for faculty/admin
    setAuth({
      role: data.role,
      user_id: data.user_id || null,
      display_id: data.display_id || data.user_id || "N/A",
    });
  };

  const logout = () => {
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

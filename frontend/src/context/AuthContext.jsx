import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);

  const login = (data) => {
    if (!data || !data.role) {
      console.error("Invalid auth payload", data);
      return;
    }

    // Backend gives: role, user_id, department
    setAuth({
      role: data.role,
      user_id: data.user_id || null,     // student only
      department: data.department || null, // faculty/admin only

      // BEST display ID handling
      display_id: data.user_id             // student = S001
                || data.department         // faculty = CSE/CE/BBA
                || "N/A",
    });
  };

  const logout = () => setAuth(null);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

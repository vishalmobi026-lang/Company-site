import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("user") || localStorage.getItem("user");
      if (!storedUser) return null;
      
      const userData = JSON.parse(storedUser);
      
      // Check for token expiration if possible
      if (userData.access_token) {
        try {
          const base64Url = userData.access_token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp && payload.exp < now) {
            // Token expired
            localStorage.removeItem("user");
            sessionStorage.removeItem("user");
            return null;
          }
        } catch (e) {
          // If decoding fails, treat as invalid
          return null;
        }
      }
      
      return userData;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(user);

  const login = (userData, remember = false) => {
    setUser(userData);
    if (remember) {
      localStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

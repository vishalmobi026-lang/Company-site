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

  // --- AUTO LOGOUT LOGIC ---
  useEffect(() => {
    if (!user || !user.access_token) return;

    try {
      // Decode token to get expiration time
      const base64Url = user.access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      
      if (payload.exp) {
        const expirationTime = payload.exp * 1000; // Convert to ms
        const currentTime = Date.now();
        const timeLeft = expirationTime - currentTime;

        if (timeLeft <= 0) {
          // Already expired
          logout();
        } else {
          // Set a timer to logout exactly when it expires
          const timer = setTimeout(() => {
            console.log("Session expired. Logging out automatically.");
            logout();
            alert("Your session has expired. Please login again.");
          }, timeLeft);

          return () => clearTimeout(timer);
        }
      }
    } catch (e) {
      console.error("Token decoding error in auto-logout:", e);
    }
  }, [user]);

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

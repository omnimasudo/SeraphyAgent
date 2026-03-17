"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Simplified auth: user is null by default, login sets a dummy user
  const [user, setUser] = useState<User | null>(null);

  const login = () => {
    setUser({ id: "1", name: "Demo User", email: "demo@example.com" });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  // Default to a dummy user if context is missing for simplicity in this demo
  if (context === undefined) {
    return {
      user: { id: "1", name: "Guest", email: "guest@example.com" }, // Dummy user just to make the page work
      login: () => {},
      logout: () => {}
    };
  }
  return context;
}
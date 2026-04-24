"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type AuthType = {
  user: boolean;
  setUser: (val: boolean) => void;
};

const AuthContext = createContext<AuthType | null>(null);

export const AuthProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: boolean; // ⚠️ THIS MUST EXIST
}) => {
  const [user, setUser] = useState<boolean>(initialUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
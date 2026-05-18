import {
  createContext,
  useContext,
  useMemo,
} from "react";

import type { ReactNode } from "react";

import { useAuth as useAuthHook } from "../hooks/useAuth";

type AuthContextType = ReturnType<typeof useAuthHook>;

const AuthContext = createContext<AuthContextType | null>(
  null
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const auth = useAuthHook();

  // Prevent unnecessary rerenders
  const value = useMemo(() => auth, [auth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};
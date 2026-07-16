import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { User } from "../types";
import * as authService from "../services/auth.service";
import { clearToken, getToken, setToken } from "../services/api";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    authService
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      async signIn(email, password) {
        const { user, token } = await authService.login(email, password);
        setToken(token);
        setUser(user);
      },
      async signUp(name, email, password) {
        const { user, token } = await authService.register(name, email, password);
        setToken(token);
        setUser(user);
      },
      signOut() {
        clearToken();
        setUser(null);
      },
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return context;
}

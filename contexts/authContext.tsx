import { LoginResult, User, UserRole } from "@/features/auth/types/auth.types";
import {
  AuthSession,
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from "@/features/auth/utils/auth-session";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextValue = {
  session: AuthSession | null;
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  startSession: (loginResult: LoginResult) => void;
  endSession: () => void;
  syncSession: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const storedSession = getAuthSession();

    setSession(storedSession);
    setIsAuthReady(true);
  }, []);

  const startSession = useCallback((loginResult: LoginResult) => {
    saveAuthSession(loginResult);
    const storedSession = getAuthSession();
  }, []);

  const endSession = useCallback(() => {
    clearAuthSession();
  }, []);

  const syncSession = useCallback(() => {
    const storedSession = getAuthSession();

    setSession(storedSession);
  }, []);

  const user = session?.user ?? null;
  const role = user?.role ?? null;
  const isAuthenticated = session !== null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role,
        isAuthenticated,
        isAuthReady,
        startSession,
        endSession,
        syncSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

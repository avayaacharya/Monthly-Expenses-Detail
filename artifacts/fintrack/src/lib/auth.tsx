import { createContext, useContext, useState, useEffect } from "react";

export interface AuthUser {
  employeeId: string;
  name: string;
  role: string;
}

const MOCK_USERS: Record<string, AuthUser> = {
  EMP001: { employeeId: "EMP001", name: "Ravi Shankar", role: "EMPLOYEE" },
  EMP002: { employeeId: "EMP002", name: "Priya Menon", role: "EMPLOYEE" },
  EMP003: { employeeId: "EMP003", name: "Arjun Das", role: "EMPLOYEE" },
};

interface AuthContextValue {
  user: AuthUser | null;
  login: (employeeId: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('ft_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem('ft_user', JSON.stringify(user));
    else localStorage.removeItem('ft_user');
  }, [user]);

  const login = async (employeeId: string, password: string) => {
    await new Promise(r => setTimeout(r, 1000));
    const u = MOCK_USERS[employeeId.toUpperCase()];
    if (u && password === "1234") {
      setUser(u);
      return { ok: true };
    }
    return { ok: false, error: "Invalid Employee ID or password. Please try again." };
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

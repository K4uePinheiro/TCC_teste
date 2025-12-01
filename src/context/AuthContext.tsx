import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import type { User, JwtPayload } from "../services/auth";

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const USER_KEY = "user";

// -------------------- Helpers --------------------

const extractUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    const user: User = {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      roles: decoded.roles,
    };

    return user;
  } catch (e) {
    console.error("Erro ao decodificar o token JWT:", e);
    return null;
  }
};

const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem(USER_KEY);
};

// -------------------- Provider --------------------

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      return;
    }

    const userFromToken = extractUserFromToken(token);
    setUser(userFromToken);
  };

  useEffect(() => {
    loadUserFromToken();
    setLoading(false);
  }, []);

  // ---------------- Login ----------------

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { accessToken, refreshToken } = res.data;

      if (!accessToken)
        throw new Error("Resposta inválida do backend: token não encontrado.");

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      loadUserFromToken();

      return true;
    } catch (err) {
      console.error("Erro no login:", err);
      clearAuthData();
      setUser(null);
      return false;
    }
  };

  // ---------------- Logout REAL (API + local) ----------------

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Erro ao deslogar no servidor:", err);
    }

    clearAuthData();
    setUser(null);

    window.location.href = "/login";
  };

  const token = localStorage.getItem("access_token");

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../services/api";

export interface User {
  [x: string]: any;
  roles: never[];
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const USER_KEY = "user";

const saveUser = (user: User) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));
const getUser = (): User | null => {
  try {
    const data = localStorage.getItem("user");
    if (!data) return null; // protege caso seja null ou undefined
    return JSON.parse(data);
  } catch (e) {
    console.error("Erro ao ler user do localStorage:", e);
    return null;
  }
};
const clearUser = () => localStorage.removeItem(USER_KEY);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getUser());
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // RESTAURA USUÁRIO LOGADO
  // -------------------------------
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        const apiUser = res.data.user || res.data; // fallback
        setUser(apiUser);
        saveUser(apiUser);
        console.log("Usuário carregado:", apiUser);
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
        localStorage.removeItem("access_token");
        clearUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // -------------------------------
  // LOGIN COM API
  // -------------------------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });

      // caso o backend não retorne user dentro de res.data
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      const apiUser = res.data.user || res.data; // fallback seguro

      if (!accessToken || !apiUser)
        throw new Error("Resposta do backend inválida");

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      setUser(apiUser);
      saveUser(apiUser);
      return true;
    } catch (err) {
      console.error("Erro no login:", err);
      return false;
    }
  };

  // -------------------------------
  // LOGOUT
  // -------------------------------
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    clearUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

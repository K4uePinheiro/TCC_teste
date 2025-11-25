import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../services/api";

export interface User {
  uid: any;
  id: string;
  name: string;
  email: string;
  picture?: string;
  roles?: any[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const USER_KEY = "user";

// Helpers -------------------------------------
const saveUser = (user: User) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

const getUser = (): User | null => {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.error("Erro ao ler user do localStorage:", e);
    return null;
  }
};

const clearUser = () => localStorage.removeItem(USER_KEY);

// Provider -------------------------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getUser());
  const [loading, setLoading] = useState(!getUser()); // carrega só se não tiver user salvo

  // Função extraída: carrega user pela API
  const loadUserFromApi = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await api.get("/auth/me");
      const apiUser = res.data.user || res.data;

      setUser(apiUser);
      saveUser(apiUser);
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      clearUser();
      setUser(null);
    }
  };

  // Carrega usuário quando a aplicação abre
  useEffect(() => {
    const init = async () => {
      await loadUserFromApi();
      setLoading(false);
    };

    init();
  }, []);

  // Login --------------------------------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { accessToken, refreshToken } = res.data;
      const apiUser = res.data.user || res.data;

      if (!accessToken || !apiUser)
        throw new Error("Resposta inválida do backend");

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Agora carregamos o usuário corretamente
      await loadUserFromApi();

      return true;
    } catch (err) {
      console.error("Erro no login:", err);
      return false;
    }
  };

  // Logout -------------------------------------
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    clearUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token: localStorage.getItem("access_token"), user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

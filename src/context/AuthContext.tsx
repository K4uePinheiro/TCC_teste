import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";
import type { User, JwtPayload } from "../services/auth"; // Importando as novas interfaces
 // Importando as novas interfaces

// -------------------------------------------------------------------
// 1. Definição do Contexto e Tipos
// -------------------------------------------------------------------

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const USER_KEY = "user"; // Mantido para compatibilidade, mas não será mais usado para armazenar o objeto User

// -------------------------------------------------------------------
// 2. Funções Auxiliares (Helpers)
// -------------------------------------------------------------------

// Função para extrair dados do usuário a partir do payload do JWT
const extractUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Mapeia os campos do payload do JWT para a interface User
    const user: User = {
      id: decoded.sub, // Assumindo que 'sub' é o ID do usuário
      name: decoded.name,
      email: decoded.email,
      roles: decoded.roles,
      // Adicione outros campos conforme necessário
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
  localStorage.removeItem(USER_KEY); // Limpa o USER_KEY por segurança/compatibilidade
};

// -------------------------------------------------------------------
// 3. Provider
// -------------------------------------------------------------------

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true para carregar o estado inicial

  // NOVA LÓGICA: Carrega o usuário decodificando o token
  const loadUserFromToken = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      return;
    }

    const userFromToken = extractUserFromToken(token);
    setUser(userFromToken);
  };

  // Carrega usuário quando a aplicação abre (substitui o loadUserFromApi)
  useEffect(() => {
    loadUserFromToken();
    setLoading(false);
  }, []);

  // Login --------------------------------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { accessToken, refreshToken } = res.data;

      if (!accessToken)
        throw new Error("Resposta inválida do backend: token não encontrado.");

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Carrega o usuário decodificando o token recém-obtido
      loadUserFromToken();

      return true;
    } catch (err) {
      console.error("Erro no login:", err);
      clearAuthData();
      setUser(null);
      return false;
    }
  };

  // Logout -------------------------------------
  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  const token = localStorage.getItem("access_token");

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
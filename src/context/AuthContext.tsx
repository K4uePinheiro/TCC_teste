import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { User, JwtPayload } from "../services/auth"; // Importando as novas interfaces
 // Importando as novas interfaces
import api from "../services/api"; // Importa o serviço de API para configurar o callback de logout

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

// Variável para armazenar a função de logout para o interceptor
let onLogoutCallback: (() => void) | null = null;

// Exporta a função para que o interceptor possa chamá-la
export const setOnLogoutCallback = (callback: () => void) => {
  onLogoutCallback = callback;
};

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

// Função que o interceptor chamará para deslogar
const handleLogout = () => {
  clearAuthData();
  if (onLogoutCallback) {
    onLogoutCallback();
  }
};

// Configura o callback de logout no interceptor
// Isso é necessário porque o interceptor não tem acesso direto ao estado do React
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o erro 401 ocorreu APÓS a tentativa de renovação (indicado por _retry)
    // ou se a renovação falhou (o interceptor de resposta do api.ts deve cuidar disso)
    if (error.response?.status === 401 && error.config?.url !== '/auth/refresh' && error.config?._retry) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

// -------------------------------------------------------------------
// 3. Provider
// -------------------------------------------------------------------

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Começa como true para carregar o estado inicial

  // Configura o callback de logout para o interceptor
  useEffect(() => {
    setOnLogoutCallback(() => {
      setUser(null);
    });
  }, []);

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

  // Efeito para monitorar o token e decodificar o usuário após a renovação
  // Isso garante que o estado do usuário seja atualizado quando o token for renovado pelo interceptor
  useEffect(() => {
    const currentToken = localStorage.getItem("access_token");
    
    // Se o token foi removido (pelo interceptor em caso de falha na renovação), desloga
    if (!currentToken && user) {
        setUser(null);
        // Opcional: Adicione aqui a lógica de redirecionamento para /login
        // Ex: window.location.href = "/login";
    } else if (currentToken) {
        loadUserFromToken();
    }
  }, [localStorage.getItem("access_token")]); // Monitora a mudança do token no localStorage

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

      // O interceptor do Axios agora é responsável por manter o token atualizado.
      // Não é necessário um temporizador aqui.

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
    <AuthContext.Provider value={{ token: localStorage.getItem("access_token"), user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { auth, provider } from "../services/firebase";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import api from "../services/api";

// ========================================
// TIPOS
// ========================================
export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  email_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// ========================================
// LOCALSTORAGE
// ========================================
const USER_KEY = "user";

const saveUser = (user: User) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

const getUser = (): User | null => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const clearUser = () => localStorage.removeItem(USER_KEY);

// ========================================
// PROVIDER
// ========================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getUser());
  const [loading, setLoading] = useState(true);

  // ------------------------------------------------
  // VERIFICA LOGIN AUTOMÁTICO
  // ------------------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      const access = localStorage.getItem("access_token");

      // Se existe token da API, NÃO sobrescreve com Firebase
      if (access) {
        setLoading(false);
        return;
      }

      // Se não há token da API e não existe usuário Firebase → desloga tudo
      if (!firebaseUser) {
        setUser(null);
        clearUser();
        setLoading(false);
        return;
      }

      // Firebase logou, MAS você precisa de um user real da API
      // Aqui NÃO vamos criar o user automaticamente,
      // apenas avisar que precisa implementar o endpoint /auth/firebase
      console.warn(
        "%cATENÇÃO: Firebase logou, mas não existe token da API. É necessário implementar a rota POST /auth/firebase no backend.",
        "color: yellow; font-weight: bold"
      );

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // ------------------------------------------------
  // LOGIN COM GOOGLE  (Firebase + API DEPOIS)
  // ------------------------------------------------
  const loginWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // 1) Pega ID token do Firebase
      const idToken = await firebaseUser.getIdToken();

      // 2) Envia para sua API (PRECISA CRIAR ESSA ROTA)
      // -----------------------------------------------
      // ❗❗❗
      // Aqui você ainda NÃO tem essa rota.
      // Depois eu escrevo pra você o endpoint completo em Java.
      // ❗❗❗
      // -----------------------------------------------
      const res = await api.post("/auth/firebase", { idToken });

      const { accessToken, refreshToken, user: apiUser } = res.data;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      setUser(apiUser);
      saveUser(apiUser);
    } catch (e) {
      console.error("Erro no loginWithGoogle:", e);
      throw e;
    }
  };

  // ------------------------------------------------
  // LOGIN TRADICIONAL (API)
  // ------------------------------------------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/login", { email, password });

      const { accessToken, refreshToken, user: apiUser } = res.data;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      setUser(apiUser);
      saveUser(apiUser);

      return true;
    } catch (err) {
      return false;
    }
  };

  // ------------------------------------------------
  // LOGOUT
  // ------------------------------------------------
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    clearUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

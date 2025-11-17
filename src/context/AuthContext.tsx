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
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { db } from "../services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import api from "../services/api";

// -------------------
// Tipos
// -------------------
export interface User {
  uid?: string;
  name: string;
  email: string;
  picture?: string;
  email_verified?: boolean;
  loginDate?: string;
  cart?: any[];
  favorites?: any[];
  orders?: any[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// -------------------
// Helpers LocalStorage
// -------------------
const USER_STORAGE_KEY = "user";

const saveUserToStorage = (userData: User) => {
  try {
    const merged = {
      ...userData,
      loginDate: new Date().toISOString(),
      cart: userData.cart || [],
      favorites: userData.favorites || [],
      orders: userData.orders || [],
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(merged));
  } catch {}
};

const getUserFromStorage = (): User | null => {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const clearUserFromStorage = () => localStorage.removeItem(USER_STORAGE_KEY);

// -------------------
// Provider
// -------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getUserFromStorage());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Define persistência
    (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch {
        try {
          await setPersistence(auth, browserSessionPersistence);
        } catch {}
      }
    })();

    // Firebase Observer
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!mounted) return;

      // ❗ IMPORTANTE:
      // Se o usuário logou via API, NÃO sobrescrever.
      const accessToken = localStorage.getItem("access_token");
      if (accessToken && !firebaseUser) {
        setLoading(false);
        return;
      }

      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          picture: firebaseUser.photoURL || "",
          email_verified: firebaseUser.emailVerified,
        };

        setUser(userData);
        saveUserToStorage(userData);
      } else {
        setUser(null);
        clearUserFromStorage();
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // --------------------------
  // LOGIN COM GOOGLE (Firebase)
  // --------------------------
  const loginWithGoogle = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const userData: User = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || "",
        email: firebaseUser.email || "",
        picture: firebaseUser.photoURL || "",
        email_verified: firebaseUser.emailVerified,
        cart: [],
        favorites: [],
        orders: [],
      };

      await setDoc(
        doc(db, "users", firebaseUser.uid),
        {
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          picture: firebaseUser.photoURL,
          email_verified: firebaseUser.emailVerified,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setUser(userData);
      saveUserToStorage(userData);
    } catch (err) {
      console.error("Erro no loginWithGoogle:", err);
      throw err;
    }
  };

  // --------------------------
  // LOGIN TRADICIONAL (API)
  // --------------------------
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Altere aqui se sua rota for "/user/login"
      const response = await api.post("/auth/login", { email, password });

      const access = response.data.accessToken;
      const refresh = response.data.refreshToken;
      const userData = response.data.user;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      setUser(userData);
      saveUserToStorage(userData);

      return true;
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      return false;
    }
  };

  // --------------------------
  // LOGOUT
  // --------------------------
  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    clearUserFromStorage();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { auth, provider } from "../services/firebase.ts";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  type User as FirebaseUser,
} from "firebase/auth";
import { db } from "../services/firebase.ts";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Interface do usuário
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

// Interface do contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// localStorage helpers
const USER_STORAGE_KEY = "user";

const saveUserToStorage = (userData: User) => {
  const dataToSave = {
    ...userData,
    loginDate: new Date().toISOString(),
    cart: userData.cart || [],
    favorites: userData.favorites || [],
    orders: userData.orders || [],
  };
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (err) {
    console.warn("Não foi possível salvar user no localStorage:", err);
  }
};

const getUserFromStorage = (): User | null => {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const clearUserFromStorage = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (err) {
    console.warn("Erro ao limpar localStorage:", err);
  }
};

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // quick init from storage (sync)
    return getUserFromStorage();
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // define persistência global ao montar — tenta local; se falhar, usa session
    (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        if (mounted)
          console.debug("[Auth] setPersistence: browserLocalPersistence");
      } catch (err) {
        // fallback: sessão (por exemplo, se browser bloquear localStorage)
        try {
          await setPersistence(auth, browserSessionPersistence);
          if (mounted)
            console.debug(
              "[Auth] setPersistence: browserSessionPersistence (fallback)"
            );
        } catch (err2) {
          console.warn("[Auth] Não foi possível setPersistence:", err2);
        }
      }
    })();

    // observer para mudanças de autenticação
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: FirebaseUser | null) => {
        if (!mounted) return;
        try {
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
            console.debug(
              "[Auth] onAuthStateChanged: usuário logado",
              userData.email
            );
          } else {
            // sem usuário no Firebase — limpamos storage e estado
            setUser(null);
            clearUserFromStorage();
            console.debug("[Auth] onAuthStateChanged: usuário deslogado");
          }
        } catch (err) {
          console.error("[Auth] erro no onAuthStateChanged:", err);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Login com Google
  const loginWithGoogle = async () => {
    try {
      // garante persistência antes do login — redundante com o set do useEffect, mas seguro
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

      //salva atualiza no firestore
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

      console.debug("[Auth] loginWithGoogle: FIreStore OK", userData.email);
    } catch (err: any) {
      console.error("[Auth] Erro no loginWithGoogle:", err);
      // se for popup closed by user ou blocked, trate apropriadamente aqui
      throw err;
    }
  };

  // Login tradicional (mock)
  const login = (email: string, password: string): boolean => {
    const mockUsers = [
      {
        email: "teste@email.com",
        password: "123456",
        name: "Kaue",
        picture: "",
      },
    ];
    const found = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      const userData: User = {
        name: found.name,
        email: found.email,
        picture: found.picture,
        email_verified: true,
      };
      setUser(userData);
      saveUserToStorage(userData);
      return true;
    }
    return false;
  };

  // Logout
  const logout = async () => {
    await signOut(auth);

    localStorage.removeItem("cart");
    localStorage.removeItem("favorites");

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

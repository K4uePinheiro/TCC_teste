import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext"; // <--- IMPORTANTE
import { db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";


interface Product {
  id: number;
  name: string;
  price: number;
  discount?: number;
  imgUrl: string;
  description?: string;
  categories?: { id: number; name: string }[];
}

interface FavoritesContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);

  // Carregar favoritos do Firestore quando o usuário loga
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.uid) return;
      const ref = doc(db, "favorites", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setFavorites(snap.data().items || []);
      }
    };

    loadFavorites();
  }, [user]);

  // Salvar favoritos no Firestore
  const saveFavorites = async (updated: Product[]) => {
    if (!user?.uid) return;
    await setDoc(doc(db, "favorites", user.uid), { items: updated });
  };

  const toggleFavorite = (product: Product) => {
  if (!user?.uid) {
    alert("Você precisa estar logado para favoritar itens.");
    return;
  }

  setFavorites((prev) => {
    const exists = prev.some((p) => p.id === product.id);
    const updated = exists
      ? prev.filter((p) => p.id !== product.id)
      : [...prev, product];

    saveFavorites(updated);
    return updated;
  });
};

  const isFavorite = (id: number) => favorites.some((p) => p.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites deve ser usado dentro do FavoritesProvider");
  return context;
};

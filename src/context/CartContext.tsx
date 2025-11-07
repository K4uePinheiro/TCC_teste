import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { useAuth } from "../context/AuthContext"; // ✅ pega usuário logado
import { db } from "../services/firebase"; // ✅ seu firebase config
import { doc, setDoc, getDoc } from "firebase/firestore";

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  seller: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  updateQuantity: (id: number, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  // ✅ Função para salvar no Firestore
  const saveCartToFirebase = async (updatedCart: CartItem[]) => {
    if (!user?.uid) return; // se não estiver logado, não salva
    await setDoc(doc(db, "carts", user.uid), { items: updatedCart });
  };

  // ✅ Carrega carrinho quando o usuário loga
  useEffect(() => {
    const loadCart = async () => {
      if (!user?.uid) return; // se não estiver logado, não carrega

      const ref = doc(db, "carts", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCart(snap.data().items);
      }
    };

    loadCart();
  }, [user]);

  // ✅ Adicionar ao carrinho
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      const updated = exists
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];

      saveCartToFirebase(updated);
      return updated;
    });
  };

  // ✅ Remover item
  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveCartToFirebase(updated);
      return updated;
    });
  };

  // ✅ Limpar carrinho
  const clearCart = () => {
    setCart([]);
    saveCartToFirebase([]);
  };

  // ✅ Atualizar quantidade
  const updateQuantity = (id: number, quantity: number) => {
    setCart((prev) => {
      const updated = prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
        )
        .filter((item) => item.quantity > 0); // remove item zerado

      saveCartToFirebase(updated);
      return updated;
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart deve ser usado dentro do CartProvider");
  return context;
};

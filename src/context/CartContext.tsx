import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  seller: string;
}

interface OrderResponse {
  id: number;
  items: CartItem[];
}

interface CartContextType {
  cart: CartItem[];
  orderId: number | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Carregar carrinho da API
  async function fetchCart() {
    if (!token) return;

    try {
      const res = await api.get("/orders/shopping-cart");
      const order: OrderResponse = res.data;

      setCart(order.items);
      setOrderId(order.id);
    } catch (err) {
      console.log("Carrinho vazio.");
      setCart([]);
      setOrderId(null);
    }
  }

  // Adicionar produto ao carrinho
  async function addToCart(productId: number) {
    const payload = [
      {
        productId,
        quantity: 1,
      },
    ];

    const res = await api.post("/orders", payload);
    const order: OrderResponse = res.data;

    setCart(order.items);
    setOrderId(order.id);
  }

  async function updateQuantity(productId: number, quantity: number) {
    if (!orderId) return;

    const payload = [
      {
        productId,
        quantity,
      },
    ];

    const res = await api.patch(`/orders/${orderId}`, payload);
    const order: OrderResponse = res.data;

    setCart(order.items);
  }

  async function removeItem(productId: number) {
    if (!orderId) return;

    await api.delete(`/orders/${orderId}/item/${productId}`);
    fetchCart();
  }

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  return (
    <CartContext.Provider
      value={{ cart, orderId, fetchCart, addToCart, updateQuantity, removeItem }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

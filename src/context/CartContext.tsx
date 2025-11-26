import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

// 🔹 Tipos do backend
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  discount: number;
  imgUrl: string;
  supplierId: number;
  supplierName: string;
  categories: any[];
}

interface OrderItem {
  itemId: number;
  quantity: number;
  product: Product;
}

interface OrderResponse {
  id: number;
  status: string;
  totalAmount: number;
  orderItems: OrderItem[];
}

// 🔹 Tipos internos do carrinho no frontend
interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  seller: string;
}

// 🔹 Tipos do contexto
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

  // 🔹 Carregar carrinho da API
  async function fetchCart() {
    if (!token) return;

    try {
      const res = await api.get("/orders"); // retorna todos os pedidos
      const orders: OrderResponse[] = res.data;

      const pendingOrder = orders.find(o => o.status === "PENDING");

      if (pendingOrder) {
        const mappedCart: CartItem[] = pendingOrder.orderItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          name: item.product.name,
          price: item.product.price,
          image: item.product.imgUrl,
          seller: item.product.supplierName,
        }));

        setCart(mappedCart);
        setOrderId(pendingOrder.id);
      } else {
        setCart([]);
        setOrderId(null);
      }
    } catch (err) {
      console.log("Erro ao carregar carrinho.", err);
      setCart([]);
      setOrderId(null);
    }
  }

  // 🔹 Adicionar produto ao carrinho
  async function addToCart(productId: number) {
  if (!orderId) {
    const res = await api.post("/orders", [{ productId, quantity: 1 }]);
    const order: OrderResponse = res.data;
    setCart(order.orderItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      name: item.product.name,
      price: item.product.price,
      image: item.product.imgUrl,
      seller: item.product.supplierName,
    })));
    setOrderId(order.id);
    return;
  }

  const res = await api.get(`/orders/${orderId}`);
  const order: OrderResponse = res.data;

  const payload = order.orderItems.map(item => ({
    productId: item.product.id,
    quantity: item.quantity,
  }));

  const existing = payload.find(p => p.productId === productId);
  if (existing) existing.quantity += 1;
  else payload.push({ productId, quantity: 1 });

  const updateRes = await api.patch(`/orders/${orderId}`, payload);
  const updatedOrder: OrderResponse = updateRes.data;

  setCart(updatedOrder.orderItems.map(item => ({
    productId: item.product.id,
    quantity: item.quantity,
    name: item.product.name,
    price: item.product.price,
    image: item.product.imgUrl,
    seller: item.product.supplierName,
  })));
}


  // 🔹 Atualizar quantidade
  async function updateQuantity(productId: number, quantity: number) {
    if (!orderId) return;

    const payload = cart.map(item => ({
      productId: item.productId,
      quantity: item.productId === productId ? quantity : item.quantity,
    }));

    const res = await api.patch(`/orders/${orderId}`, payload);
    const order: OrderResponse = res.data;

    const mappedCart: CartItem[] = order.orderItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      name: item.product.name,
      price: item.product.price,
      image: item.product.imgUrl,
      seller: item.product.supplierName,
    }));

    setCart(mappedCart);
  }

  // 🔹 Remover item do carrinho
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

// services/cartService.ts
import api from "./api";

export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

// 🔹 Buscar carrinho pendente
export async function getShoppingCart() {
  const res = await api.get("/orders/shopping-cart");
  return res.data;
}

// 🔹 Criar carrinho pendente
export async function createCart(items: OrderItemRequest[]) {
  const res = await api.post("/orders", items);
  return res.data;
}

// 🔹 Atualizar carrinho pendente
export async function updateCart(orderId: number, items: OrderItemRequest[]) {
  const res = await api.patch(`/orders/${orderId}`, items);
  return res.data;
}

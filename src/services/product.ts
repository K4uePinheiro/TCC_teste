// src/types/product.ts

export interface Product {
  id: string;
  name: string;
  price: number; // Preço em formato numérico para facilitar a formatação
  category: string;
  quantity: number; // Qtd. Estoque
  code: string; // Código
  // Adicione outros campos que a API do produto possa retornar
}

export interface ProductApiResponse {
  products: Product[];
  total: number;
  // Adicione metadados de paginação se a API retornar
}

// Interface para as métricas do Dashboard
export interface DashboardMetrics {
  activeProducts: number;
  monthlyRevenue: number; // Lucro Mensal
  totalSales: number; // Vendas Totais
  // Adicione outras métricas
}
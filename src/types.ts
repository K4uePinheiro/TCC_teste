// types.ts
export interface Category {
  id: number;
  name: string;
  subCategories?: Category[];
}

export interface Product {
  id: number;
  name: string;
  description?: string; // ✅ opcional
  price: number;
  oldPrice?: number;
  discount?: number;
  imgUrl: string;
  stock?: number;
  categories?: Category[];
}

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import { productsMock } from "../../mocks/productsMocks";
import type { Product } from "../../types";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("q")?.toLowerCase() || "";
  const categoryId = queryParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch {
        // fallback para mock local se API falhar
        const mockData = productsMock.map((p) => ({
          ...p,
          oldPrice: p.price,
        }));
        setProducts(mockData);
      }
    };
    fetchProducts();
  }, []);

  // filtra produtos por busca e categoria
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search);
    const matchesCategory = categoryId
      ? p.categories?.some((c) => c.id === Number(categoryId)) ?? false
      : true;
    return matchesSearch && matchesCategory;
  });

  // pega o nome da categoria
  const categoryName =
    categoryId &&
    products
      .flatMap((p) => p.categories || [])
      .find((c) => c.id === Number(categoryId))?.name;

  return (
    <div className="products-page">
      <h2>
        {search
          ? `Resultados para "${search}"`
          : categoryId
          ? `Categoria: ${categoryName || "Carregando..."}`
          : "Todos os produtos"}
      </h2>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>Nenhum produto encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

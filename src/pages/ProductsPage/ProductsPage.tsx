import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import type { Product } from "../../types";
import "./ProductsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();

  // 🔍 Lê parâmetros da URL
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("q")?.toLowerCase() || "";
  const categoryId = queryParams.get("category");
  const subCategoryId = queryParams.get("subcategory");

  // 🔹 Buscar produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product");
        setProducts(res.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        alert("Erro ao buscar produtos.");
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Filtrar produtos por busca, categoria e subcategoria
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search);

    // Verifica se o produto pertence à categoria principal
    const matchesCategory = categoryId
      ? p.categories?.some((c) => c.id === Number(categoryId)) ?? false
      : true;
    const hasSubcategory = (category: any, subCategoryId: number): boolean => {
      if (!category?.subCategories) return false;
      for (const sub of category.subCategories) {
        if (sub.id === subCategoryId) return true;
        if (hasSubcategory(sub, subCategoryId)) return true;
      }
      return false;
    };

    // Verifica se o produto pertence a uma subcategoria
    const matchesSubcategory = subCategoryId
      ? p.categories?.some((c) => hasSubcategory(c, Number(subCategoryId))) ?? false
      : true;


    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // 🔹 Nome da categoria/subcategoria para o título
  const categoryName =
    categoryId &&
    products
      .flatMap((p) => p.categories || [])
      .find((c) => c.id === Number(categoryId))?.name;

  const subCategoryName =
    subCategoryId &&
    products
      .flatMap((p) =>
        p.categories?.flatMap((c) => c.subCategories || []) || []
      )
      .find((sub) => sub.id === Number(subCategoryId))?.name;

  return (
    <div className="products-page">
      <h2>
        {search
          ? `Resultados para "${search}"`
          : subCategoryId
            ? `Subcategoria: ${subCategoryName || "Carregando..."}`
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

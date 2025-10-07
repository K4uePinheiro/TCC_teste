import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // precisa estar aqui
import api from "../services/api";
import ProductCard from "./ProductCard";
import "../components/ProductsPage.css";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  seller: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  // pega o parâmetro "search" da URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search")?.toLowerCase() || "";

    useEffect(() => {
  api
    .get("products")
    .then((res) => {
      console.log("Produtos recebidos:", res.data); // 👈 loga os produtos
      setProducts(res.data);
    })
    .catch((err) => console.error(err));
}, []);

  
 const filteredProducts = products.filter((p) =>
  p.name.toLowerCase().includes(search)
);

  return (
    <div className="products-page">
      <h2>Todos os produtos</h2>
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

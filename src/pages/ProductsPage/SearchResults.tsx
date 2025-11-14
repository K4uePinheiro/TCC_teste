import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import "./SearchResults.css";
import { productsMock } from "../../mocks/productsMocks";
import type { Product } from "../../types";

// Função para detectar API online
async function checkApiStatus() {
  try {
    await api.get("/health"); // troque caso não exista /health
    return true;
  } catch {
    return false;
  }
}

const SearchResults = () => {
  const location = useLocation();
  const searchTerm = location.state?.searchTerm || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      setLoading(true);

      const apiOnline = await checkApiStatus();

      if (apiOnline) {
        // Busca na API
        api
          .get(`/product/search?query=${searchTerm}`)
          .then((res) => setResults(res.data))
          .catch(() => setResults([]));
      } else {
        // Busca no mock local
        const filtered = productsMock.filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filtered);
      }

      setLoading(false);
    }

    loadResults();
  }, [searchTerm]);

  return (
    <div className="search-results">
      <h2>Resultados da busca</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : results.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <div className="results-grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

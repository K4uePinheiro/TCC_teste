import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import "./SearchResults.css";
import type { Product } from "../../types";
import { productsMock } from "../../mocks/productsMocks";



const SearchResults = () => {
  const location = useLocation();
  const searchTerm = location.state?.searchTerm || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. LÊ A VARIÁVEL DE AMBIENTE
  const useApi = import.meta.env.VITE_USE_API === 'true';

  useEffect(() => {
    async function loadResults() {
      setLoading(true);

      const query = searchTerm.trim();
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      // 2. SUBSTITUÍDO: A condição agora usa a variável 'useApi'
      if (useApi) {
        // Busca na API (Corrigido para /product/name/)
        try {
          const response = await api.get(`/product/name/${encodeURIComponent(query)}`);
          setResults(response.data);
        } catch (error) {
          // Em caso de erro, caímos no mock ou mostramos erro.
          console.error("Erro na busca da API. Tentando mock...", error);
          
          // 💡 SUGESTÃO: Se a API falhar, você pode optar por cair no mock, 
          // ou simplesmente zerar os resultados (mantendo o comportamento anterior):
          setResults([]); 
        }
      } else {
        // Fallback no mock local (VITE_USE_API não é 'true')
        const filtered = productsMock.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      }

      setLoading(false);
    }

    loadResults();
  }, [searchTerm, useApi]); // 3. ADICIONADO: useApi no array de dependências (boa prática)

  return (
    <div className="search-results">
      <h2>Resultados da busca</h2>

      {/* Exibição do status */}
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
      
      {/* Informação extra para debug, se desejar */}
      {/* <p>Status: {useApi ? 'API ativada' : 'Mock ativado'}</p> */}

    </div>
  );
};

export default SearchResults;
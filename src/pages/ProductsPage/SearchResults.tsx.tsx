import { useLocation } from "react-router-dom";
import type { Product } from "../types";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const results = (location.state?.results || []) as Product[];

  return (
    <div className="search-results">
      <h2>Resultados da busca</h2>
      {results.length === 0 ? (
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

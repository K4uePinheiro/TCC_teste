import { Link } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import "./FavoritesPage.css";
import { useFavorites } from "../../context/FavoritesContex";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
 const { favorites } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user?.uid) {
    return (
      <div className="favorites-login-required">
        <h2>Você precisa estar logado para ver seus favoritos  </h2>
        <button onClick={() => navigate("/login")} className="login-btna">
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>
          <img src="/heart.png" alt="Coração" /> Seus itens favoritos
        </h2>
      </div>

      {favorites.length === 0 ? (
        <div className="no-favorites-message">Nenhum produto favoritado ainda</div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="favorites-actions">
        <Link to="/" className="btn-continue-shopping">
          Continuar comprando
        </Link>
      </div>
    </div>
  );
};

export default FavoritesPage;

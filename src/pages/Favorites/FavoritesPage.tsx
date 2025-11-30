import { Link } from "react-router-dom";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import "./FavoritesPage.css";
import { useFavorites } from "../../context/FavoritesContex"; // Importação do novo Context
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const FavoritesPage = () => {
  // Agora o useFavorites fornece os favoritos da API e o estado de carregamento
  const { favorites, isLoading, error, fetchFavorites } = useFavorites(); 
  const { user } = useAuth();
  const navigate = useNavigate();

  // Garante que os favoritos sejam carregados ao entrar na página
  useEffect(() => {
    if (user) {
        fetchFavorites();
    }
  }, [user, fetchFavorites]);
  
  if (!user) {
    return (
      <div className="favorites-login-required">
        <h2>Você precisa estar logado para ver seus favoritos</h2>
        <button onClick={() => navigate("/login")} className="login-btna">
          Fazer Login
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
        <div className="favorites-container">
            <h2>Carregando favoritos...</h2>
        </div>
    );
  }

  if (error) {
    return (
        <div className="favorites-container">
            <h2 style={{color: 'red'}}>Erro ao carregar favoritos: {error}</h2>
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
          {/* Os produtos vêm da API, via FavoritesContext */}
          {favorites.map((product) => (
            // cast to any to satisfy ProductCard prop type when shapes differ
            <ProductCard key={product.id} product={product as any} />
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
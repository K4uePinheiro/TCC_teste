import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import "../components/FavoritesPage.css";
import  type { Product } from "../types";

const FavoritesPage = () => {
  // Usuário logado (simulação, poderia vir do contexto ou API)
  const user = true; // true = logado, false = não logado
  const navigate = useNavigate()
  // Estado de favoritos (isso poderia vir do contexto ou API)
  const [favorites, setFavorites] = useState<Product[]>([
    // Adicione mais produtos se quiser testar
  ]);

  const handleAddToFavorites = (product: Product) => {
    if(!user) {
      alert("Você precisa estar logado para adicionar produtos aos favoritos.");
      navigate("/login");
      return;
    }

    const alreadyFavorited = favorites.some((fav) => fav.id === product.id);
    if (alreadyFavorited) {
      alert("Produto já está nos favoritos.");
      return;
    }

    setFavorites((prevFavorites) => [...prevFavorites, product]);
  };

  const removeAll = () => setFavorites([]);

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2><img src="/heart.png" alt="Coração" />Seus itens favoritos</h2>
        {user && (
          <Link to="/account" className="btn-back-account">
            <p>← Voltar à conta</p>
          </Link>
        )}
        {favorites.length > 0 && user && (
          <button className="remove-all" onClick={removeAll}>
            Remover todos os produtos
          </button>
        )}
      </div>

      {!user ? (
        <div className="no-favorites-message">
          Você precisa estar logado para adicionar produtos aos favoritos.
        </div>
      ) : favorites.length === 0 ? (
        <div className="no-favorites-message">Não há produtos favoritos.</div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} 
            product={product}
            onAddToFavorites={handleAddToFavorites} />
          ))}
        </div>
      )}

      <div className="favorites-actions">
        <Link to="/" className="btn-continue-shopping">
          Continuar comprando
        </Link>
        {favorites.length > 0 && user && (
          <Link to="/cart" className="btn-go-cart">
            Continuar pro carrinho
          </Link>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

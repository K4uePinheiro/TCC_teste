import type { FC } from "react";
import "../components/ProductCard.css";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

interface Category {
  id: number;
  name: string;
}
interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  discount?: number;
  imgUrl: string;
  categories?: Category[];
}

interface Props {
  product: Product;
  onAddToFavorites?: (product: Product) => void; // 👈 essa prop é opcional
}

const ProductCard: FC<Props> = ({ product, onAddToFavorites }) => {
  const newPrice =
    product.price !== undefined
      ? product.price - product.price * ((product.discount ?? 0) / 100)
      : undefined;

  const newPriceFormatted = newPrice?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const oldPrice = product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <img src={product.imgUrl} alt={product.name} className="product-img" />
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="old-price">{oldPrice}</p>
          <div className="price-row">
            <p className="price">
              {newPrice !== undefined ? newPriceFormatted : "--"}
            </p>
            <span className="discount">-{product.discount}%</span>
          </div>
        </div>
      </Link>

      {onAddToFavorites && (
        <button
          className="favorite-button"
          onClick={() => onAddToFavorites(product)}
        >
          <FaHeart color="red" /> Adicionar aos favoritos
        </button>
      )}
    </div>
  );
};

export default ProductCard;

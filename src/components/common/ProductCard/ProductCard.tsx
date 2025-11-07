import type { FC } from "react";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import { useFavorites } from "../../../context/FavoritesContex";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; 

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


const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(product.id);
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

      <button
        className={`favorite-button ${favorite ? "active" : ""}`}
        onClick={() => toggleFavorite(product)}
      >
        
        {favorite ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>
    </div>
  );
};

export default ProductCard;

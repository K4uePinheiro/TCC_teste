import type { FC } from "react";
import "../components/ProductCard.css";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: number;
  image: string;
  seller: string;
}

const ProductCard: FC<{ product: Product }> = ({ product }) => {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <img src={product.image} alt={product.name} className="product-img" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="seller">Vendido por: {product.seller}</p>
        <p className="old-price">R$ {product.oldPrice.toFixed(2)}</p>
        <div className="price-row">
          <p className="price">R$ {product.price.toFixed(2)}</p>
          <span className="discount">-{product.discount}%</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

import type { FC } from "react";
import "../components/ProductCard.css";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  discount?: number;
  imgUrl: string;
  //seller: string;
  categories?: [{}];
}

const ProductCard: FC<{ product: Product }> = ({ product }) => {
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
    <Link to={`/product/${product.id}`} className="product-card">
      <img src={product.imgUrl} alt={product.name} className="product-img" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {/*<p className="seller">Vendido por: {product.seller}</p>*/}
        <p className="old-price">{oldPrice}</p>
        {/* <p className="old-price">R$ {product.oldPrice.toFixed(2)}</p> */}
        <div className="price-row">
          <p className="price">
          {newPrice !== undefined ? newPriceFormatted : "--"}
          </p>
          <span className="discount">-{product.discount}%</span>
        </div>
      </div>
    </Link>
  );
};
export default ProductCard;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../components/ProductPage.css";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  displayPrice: string;
  imgUrl: string;
  images?: string[]; // pode ter várias imagens
  seller?: string;   // opcional
  category?: string;
  oldPrice?: number; // opcional
}


function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { addToCart } = useCart();

  const oldPrice = product?.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const newPrice =
    product && product.price !== undefined
      ? product.price - product.price * ((product.discount ?? 0) / 100)
      : undefined;
  const newPriceFormatted = newPrice?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/product/id/${id}`);
          const data: Product = res.data;

          const formattedProduct = {
            ...data,
            displayPrice: new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(data.price),
          };

          setProduct(formattedProduct);
          setSelectedImage(data.imgUrl);
        } catch (err) {
          console.error("Erro ao buscar produto:", err);
          setProduct(null);
        }
      };

      fetchProduct();
    }
  }, [id]);

  // Função para buscar CEP na API ViaCEP
  const calcularFrete = async () => {
    if (cep.length !== 8) {
      setFrete("Digite um CEP válido.");
      return;
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (data.erro) {
        setFrete("CEP não encontrado.");
      } else {
        // Frete fixo fake só de exemplo
        setFrete(
          `Entrega para ${data.localidade} - ${data.uf}: R$ 20,00 (5 dias úteis)`
        );
      }
    } catch (err) {
      setFrete("Erro ao buscar o CEP.");
    }
  };

  if (!product) return <h2> Produto não encontrado</h2>;

  return (
    <div className="product-page">
      <div className="gallery">
        <div className="breadcrumb">
          <span>Você está em:</span>
          <Link to="/"> Página Inicial</Link>
          <span> &gt; </span>
          <Link to={`/product?category=${product.category || "Todos"}`}>
            {product.category || "Produtos "}
          </Link>
          <span> &gt; </span>
          <span className="current">{product.name}</span>
        </div>

        <div className="image-gallery">
          <div className="thumbnails">
            {[product.imgUrl, ...(product.images || [])].map((img, idx) => (
              <div
                key={idx}
                className={`thumb ${img === selectedImage ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`${product.name} ${idx + 1}`} />
              </div>
            ))}
            {product.images && product.images.length > 3 && (
              <div className="more">+{product.images.length - 3}</div>
            )}
          </div>
          <div className="main-image-wrapper">
            <img
              src={selectedImage || product.imgUrl}
              alt={product.name}
              className="main-image"
            />
          </div>
        </div>
      </div>
      <div className="detils">
        <h1>{product.name}</h1>
        {oldPrice && <p className="old-price">De: {oldPrice}</p>}
        <h2 className="price">Por: {newPriceFormatted}</h2>
        <span className="discount">-{product.discount}%</span>
        <p className="seller">Fornecedor: {product.seller}</p>
        <button className="buy-btn">Comprar 🛒</button>
        <button
          className="cart-btn"
          onClick={() =>
            product &&
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              oldPrice: product.oldPrice ?? product.price,
              discount: product.discount,
              image: product.imgUrl,
              seller: product.seller ?? "Fornecedor desconhecido",
            })
          }

        >
          Adicionar ao carrinho
        </button>

        <div className="frete">
          <p>Consultar Frete:</p>
          <input
            type="text"
            placeholder="Digite seu CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
          <button onClick={calcularFrete}>Calcular</button>
          {frete && <p className="frete-result">{frete}</p>}
        </div>
      </div>
    </div>
  );
}
export default ProductPage;

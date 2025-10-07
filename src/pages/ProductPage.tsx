import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../components/ProductPage.css";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface Product {
  id: number;
  name: string;
  displayPrice: string | null;
  price: number;
  displayOldPrice: string | null;
  oldPrice: number;
  discount: number;
  image: string;
  images?: string[];
  seller: string;
  category?: string;
}

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { addToCart } = useCart();
  

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3001/products/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Erro ao buscar produto");
          return res.json();
        })
        .then((data: Product) => {
          const formattedProduct = {
            ...data,
            displayPrice: new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(data.price),
            displayOldPrice: new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(data.oldPrice),
          };
          setProduct(formattedProduct);
          setSelectedImage(data.image);
        })
        .catch(() => setProduct(null));
    }
  }, [id]);

  // Função para buscar CEP na API ViaCEP
  const calcularFrete = async () => {
    if (cep.length !== 8) {
      setFrete("Digite um CEP válido.");
      return;
    }

    try {
      const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (res.data.erro) {
        setFrete("CEP não encontrado.");
      } else {
        // Frete fake fixo só para exemplo
        setFrete(
          `Entrega para ${res.data.localidade} - ${res.data.uf}: R$ 20,00 (5 dias úteis)`
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
          <Link to={`/products?category=${product.category || "Todos"}`}>
            {product.category || "Produtos "}
          </Link>
          <span> &gt; </span>
          <span className="current">{product.name}</span>
        </div>

        <div className="image-gallery">
          <div className="thumbnails">
            {[product.image, ...(product.images || [])].map((img, idx) => (
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
              src={selectedImage || product.image}
              alt={product.name}
              className="main-image"
            />
          </div>
        </div>
      </div>
      <div className="detils">
        <h1>{product.name}</h1>
        <p className="old-price">De: R${product.displayOldPrice}</p>
        <h2 className="price">Por: R${product.displayPrice}</h2>
        <span className="discount">-{product.discount}%</span>
        <p className="seller">Fornecedor: {product.seller}</p>
        <button className="buy-btn">Comprar 🛒</button>
         <button className="cart-btn"onClick={() => addToCart(product)}>Adicionar ao carrinho</button>

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

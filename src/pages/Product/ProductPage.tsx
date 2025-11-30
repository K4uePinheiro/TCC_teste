import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import "./ProductPage.css";
import { useCart } from "../../context/CartContext";
import { productsMock } from "../../mocks/productsMocks";
import type { ProductMock } from "../../mocks/productsMocks";
// import { addToCart as addToCartFirestore } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // ❤️ Ícones
import { useFavorites } from "../../context/FavoritesContex"; // Importação do novo Context

interface Product extends ProductMock {
  displayPrice: number;
  category: string;
  seller?: string;
  images?: string[];
  oldPrice?: number;
}

// Interface para os dados de endereço da ViaCEP
interface CepData {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<string | null>(null);
  const [endereco, setEndereco] = useState<string | null>(null); 
  const [selectedImage, setSelectedImage] = useState<string>("");
  const { user } = useAuth();
  const { addToCart } = useCart();
  // O useFavorites agora fornece a lógica de API
  const { toggleFavorite, isFavorite } = useFavorites(); 

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const useApi = import.meta.env.VITE_USE_API === "true";
          if (useApi) {
            const res = await api.get(`/product/id/${id}`);
            const data = res.data;
            const finalPrice =
              data.price - (data.price * (data.discount ?? 0)) / 100;
            setProduct({
              ...data,
              displayPrice: finalPrice,
              category: data.categories?.[0]?.name || "Sem categoria",
            });
          } else {
            const mockProduct = productsMock.find(
              (p: ProductMock) => p.id === Number(id)
            );
            if (mockProduct) {
              const finalPrice =
                mockProduct.price -
                (mockProduct.price * (mockProduct.discount ?? 0)) / 100;
              const productConverted: Product = {
                ...mockProduct,
                displayPrice: finalPrice,
                category: mockProduct.categories?.[0]?.name || "Sem categoria",
              };
              setProduct(productConverted);
            } else {
            }
          }
        } catch (err) {
          console.error("Erro ao buscar produto:", err);
          setProduct(null);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const calcularFrete = async () => {
    setFrete(null);
    setEndereco(null); 
    
    const cleanCep = cep.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      setFrete("Digite um CEP válido (8 dígitos).");
      return;
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: CepData = await res.json();

      if (data.erro) {
        setFrete("CEP não encontrado.");
      } else {
        // 1. Formata o endereço completo
        const enderecoCompleto = `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
        setEndereco(enderecoCompleto);
        
        // 2. Define a mensagem de frete
        setFrete(
          `Frete: R$ 20,00 (5 dias úteis)`
        );
      }
    } catch {
      setFrete("Erro ao buscar o CEP.");
    }
  };

  if (!product) return <h2>Produto não encontrado</h2>;

  const oldPrice = product.price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  const newPriceFormatted = product.displayPrice.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // O isFavorite agora usa o ID do produto para verificar no estado do Context
  const favoriteActive = isFavorite(product.id);

  return (
    <div className="product-page">
      <div className="gallery">
        <div className="breadcrumb">
          <span>Você está em:</span>
          <Link to="/"> Página Inicial</Link>
          <span> &gt; </span>
          <Link to={`/product?category=${product.category}`}>
            {product.category}
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
          </div>

          <div className="main-image-wrapper">
            <img
              src={selectedImage || product.imgUrl}
              alt={product.name}
              className="main-image"
            />

            {/* ❤️ Botão de Favorito - Usa a função toggleFavorite do Context */}
            <button
              className={`favorite-button ${favoriteActive ? "active" : ""}`}
              // A função toggleFavorite agora recebe o objeto product completo
              onClick={() => toggleFavorite(product)} 
            >
              {favoriteActive ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
          </div>
        </div>
      </div>

      <div className="detils">
        <h1>{product.name}</h1>
        <p className="old-price">De: {oldPrice}</p>
        <h2 className="price">Por: {newPriceFormatted}</h2>
        <span className="discount">-{product.discount}%</span>
        <p className="seller">Fornecedor: {product.seller || "Desconhecido"}</p>

        <button className="buy-btn">Comprar 🛒</button>
        <button
          className="cart-btn"
          onClick={async () => {
            if (!user) return alert("Você precisa estar logado!");

            await addToCart(product.id);

            alert("Adicionado ao carrinho!");
          }}
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
          
          {/* NOVO: Exibe o endereço completo */}
          {endereco && <p className="endereco-result">{endereco}</p>}
          
          {/* Exibe a mensagem de frete/erro */}
          {frete && <p className="frete-result">{frete}</p>}
        </div>
      </div>
      <div className="description-section">
        <h3 className="desc-title">Descrição</h3>

        <div className="desc-box">
          <p>{product.description || "Nenhuma descrição disponível."}</p>
        </div>
      </div>
      
    </div>
  );
}

export default ProductPage;
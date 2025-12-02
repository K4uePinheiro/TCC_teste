import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import "./HomePage.css";
import { productsMock } from "../../mocks/productsMocks";
import type { Product } from "../../types";
import { suppliersMock } from "../../mocks/suppliers";

interface Supplier {
  id: number;
  name: string;
  imgUrl: string;
}

// muda para false para usar a API real
const USE_LOCAL_DATA = false;

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Product[]>([]);
  
  // ✅ NOVO ESTADO: Para a página do carrossel de promoções
  const [promoPage, setPromoPage] = useState(0); 
  
  // O estado 'page' original será usado para o carrossel "Mais Vendidos"
  const [page, setPage] = useState(0); 
  
  const perPage = 4;

  // Lógica de ordenação por desconto
  const sortPromotions = (allProducts: Product[]) => {
    const discountedProducts = allProducts.filter((p) => p.discount && p.discount > 0);

    discountedProducts.sort((a, b) => {
      return (b.discount || 0) - (a.discount || 0);
    });

    setPromotions(discountedProducts);
  };

  useEffect(() => {
    if (USE_LOCAL_DATA) {
      setProducts(productsMock);
      sortPromotions(productsMock);
    } else {
      api
        .get<Product[]>("product")
        .then((res) => {
          setProducts(res.data);
          sortPromotions(res.data);
        })
        .catch((err) => console.error("Erro ao buscar produtos:", err));
    }
  }, []);

  const partnersSectionRef = useRef<HTMLDivElement>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    if (USE_LOCAL_DATA) {
      setSuppliers(suppliersMock);
    } else {
      // se sua API ainda não tiver fornecedores, comenta essa parte
      api
        .get("/suppliers")
        .then((res) => setSuppliers(res.data))
        .catch((err) => console.error("Erro ao buscar fornecedores", err));
    }
  }, []);

  // Produtos paginados para o carrossel "Mais Vendidos"
  const paginatedProducts = products.slice(
    page * perPage,
    page * perPage + perPage
  );

  // ✅ NOVO: Produtos paginados para o carrossel "Promoções"
  const paginatedPromotions = promotions.slice(
    promoPage * perPage,
    promoPage * perPage + perPage
  );

  return (
    <div className="homepage">
      {/* Banner */}
      <section className="promo-banner">
        <div className="promo-left">
          <h2>
            OFERTA DE LANÇAMENTO <span>IKOMMERCY</span>
          </h2>
          <p>
            <strong>Os menores preços</strong> <br />
            teste o nosso site e <strong>COMPRE JÁ!</strong>
          </p>
        </div>
        <div className="promo-center">
          IK <span style={{ fontWeight: 300 }}>ommercy</span>
        </div>
        <div className="promo-right">
          <div className="promo-box-a">
            Produtos com até <span>70%</span> de desconto
          </div>
          <div className="promo-box-b">
            Produtos com até <span>20%</span> de desconto
          </div>
        </div>
      </section>

      {/* Produtos - Mais Vendidos */}
      <section className="products-section">
        <h2>Mais Vendidos</h2>
        <div className="carousel-container">
          {products.length === 0 ? (
            <div className="no-products-message">Não há produtos</div>
          ) : (
            <>
              {page > 0 && (
                <button
                  className="carousel-btn prev"
                  onClick={() => setPage(page - 1)}
                >
                  <img src="/arrow_back.png" alt="voltar" />
                </button>
              )}

              <div className="carousel">
                {paginatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {(page + 1) * perPage < products.length && (
                <button
                  className="carousel-btn next"
                  onClick={() => setPage(page + 1)}
                >
                  <img src="/arrow_forward.png" alt="avançar" />
                </button>
              )}
            </>
          )}
        </div>
      </section>

      {/* Promoções - AGORA COM CARROSSEL E ORDENAÇÃO */}
      <section className="promotions-section">
        <h2>Promoções</h2>
        <div className="carousel-container">
          {promotions.length === 0 ? (
            <div className="no-products-message">Sem promoções</div>
          ) : (
            <>
              {/* ✅ BOTÃO DE VOLTAR PARA PROMOÇÕES */}
              {promoPage > 0 && (
                <button
                  className="carousel-btn prev"
                  onClick={() => setPromoPage(promoPage - 1)}
                >
                  <img src="/arrow_back.png" alt="voltar" />
                </button>
              )}

              <div className="carousel">
                {paginatedPromotions.map((promo) => (
                  <ProductCard key={promo.id} product={promo} />
                ))}
              </div>

              {/* ✅ BOTÃO DE AVANÇAR PARA PROMOÇÕES */}
              {(promoPage + 1) * perPage < promotions.length && (
                <button
                  className="carousel-btn next"
                  onClick={() => setPromoPage(promoPage + 1)}
                >
                  <img src="/arrow_forward.png" alt="avançar" />
                </button>
              )}
            </>
          )}
        </div>
      </section>

      {/* Fornecedores */}
      <section className="partners-section" ref={partnersSectionRef}>
        <h2>Fornecedores</h2>
        <div className="partners-grid">
          {suppliers.length === 0 ? (
            <div className="no-suppliers-message">Sem fornecedores</div>
          ) : (
            suppliers.map((supplier) => (
              <div className="partner-card" key={supplier.id}>
                <img src="../../../public/forncedor.png" alt={supplier.name} />
                <h3>{supplier.name}</h3>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
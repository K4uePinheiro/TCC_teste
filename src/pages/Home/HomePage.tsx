import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import "./HomePage.css";
import { productsMock } from "../../mocks/productsMocks";
import type { Product } from "../../types";
import { suppliersMock } from "../../mocks/suppliers";
import { div } from "framer-motion/client";

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
  const [page, setPage] = useState(0);
  const perPage = 4;

  useEffect(() => {
    if (USE_LOCAL_DATA) {
      setProducts(productsMock);
      setPromotions(productsMock.filter((p) => p.discount));
    } else {
      api
        .get<Product[]>("product")
        .then((res) => setProducts(res.data))
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

  const paginatedProducts = products.slice(
    page * perPage,
    page * perPage + perPage
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
            Produtos com até <span>35%</span> de desconto
          </div>
          <div className="promo-box-b">
            Produtos com até <span>65%</span> de desconto
          </div>
        </div>
      </section>

      {/* Produtos */}
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

      {/* Promoções */}
      <section className="promotions-section">
        <h2>Promoções</h2>
        <div className="carousel-container">
          {promotions.length === 0 ? (
            <div className="no-products-message">Sem promoções</div>
          ) : (
            <div className="carousel">
              {promotions.map((promo) => (
                <ProductCard key={promo.id} product={promo} />
              ))}
            </div>
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

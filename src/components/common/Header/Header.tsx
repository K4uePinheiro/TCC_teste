import {
  FaSun,
  FaHeart,
  FaShoppingCart,
  FaTags,
  FaUsers,
  FaGift,
  FaHeadphones,
  FaBars,
  FaSearch,
  FaMoon,
  FaUser,
  FaBoxOpen,
} from "react-icons/fa";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../../../context/CartContext";
import { useAuth } from "../../../context/AuthContext";
import { productsMock, type Category } from "../../../mocks/productsMocks";
import api from "../../../services/api";

const Header = () => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  const { cart } = useCart();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const promoSectionRef = useRef<HTMLDivElement>(null);
  const partnersSectionRef = useRef<HTMLDivElement>(null);

  // DEBUG: ver estrutura vinda da API
  useEffect(() => {
    console.log("Header: categorias atuais:", categories);
  }, [categories]);

  // Buscar categorias — API ou fallback mock
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const useApi = import.meta.env.VITE_USE_API === "false";
        if (useApi) {
          console.log("📡 Buscando categorias da API...");
          const res = await api.get("/categories"); // endpoint do backend
          console.log("📦 Resposta /categories:", res.data);
          setCategories(res.data);
        } else {
          console.log("🧩 Usando categorias do mock...");
          // monta a lista a partir do mock (igual ao seu)
          const allCategories: Category[] = [];
          productsMock.forEach((product) => {
            product.categories?.forEach((cat) => {
              const existingCat = allCategories.find((c) => c.id === cat.id);
              if (existingCat) {
                cat.subCategories?.forEach((sub) => {
                  const alreadyExists = existingCat.subCategories?.some(
                    (s) => s.id === sub.id
                  );
                  if (!alreadyExists) {
                    existingCat.subCategories = [
                      ...(existingCat.subCategories || []),
                      sub,
                    ];
                  }
                });
              } else {
                allCategories.push({
                  ...cat,
                  subCategories: cat.subCategories || [],
                });
              }
            });
          });
          setCategories(allCategories);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  // Tema escuro
  const toggleTheme = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsDarkMode((prev) => !prev);
      setIsAnimating(false);
    }, 300);
  };
  useEffect(() => {
    if (isDarkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [isDarkMode]);

  // Responsividade
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // hover/clique menu
  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      setIsOpen(true);
    }
  };
  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutId.current = setTimeout(() => setIsOpen(false), 200);
    }
  };
  const handleClick = () => {
    if (isMobile) setIsOpen((prev) => !prev);
  };

  // Busca por texto
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    try {
      const response = await api.get(`/product/name/${encodeURIComponent(query)}`);
      navigate("/search", { state: { results: response.data } });
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      alert("Produto não encontrado ou erro na busca.");
    }
  };

  const scrollToPromotions = () =>
    promoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToPartners = () =>
    partnersSectionRef.current?.scrollIntoView({ behavior: "smooth" });

  // =========================
  // RENDERIZAÇÃO RECURSIVA
  // =========================
  // componente recursivo para categorias/subcategorias
  const CategoryList = ({ cats, level = 0 }: { cats: Category[]; level?: number }) => {
    if (!cats || cats.length === 0) return null;
    return (
      <ul className={`dropdown-menu level-${level}`}>
        {cats.map((cat) => (
          <li key={cat.id} className="dropdown-item">
            {/* clique na categoria principal */}
            <Link to={`/products?category=${cat.id}`} className="cat-link">
              {cat.name}
            </Link>

            {/* subcategorias: geram ?subcategory=id e também suportam níveis */}
            {cat.subCategories && cat.subCategories.length > 0 && (
              <div className="submenu">
                <CategoryList cats={cat.subCategories} level={level + 1} />
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <header className="header">
        <div className="top-bar">
          <Link to="/">
            <div className="logo">
              <img src="/ikommerce.png" alt="Logo" className="logo" />
            </div>
          </Link>

          <form onSubmit={handleSearch} className="search-box">
            <input
              type="text"
              className="input-busca"
              placeholder="Buscar Produtos"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <FaSearch />
            </button>
          </form>

          <div className="top-icons">
            <button
              className={`icon-btn ${isAnimating ? "animating" : ""}`}
              onClick={toggleTheme}
            >
              {isDarkMode ? <FaMoon className="icon" /> : <FaSun className="icon" />}
            </button>

            <Link to="/favorites" className="icon-btn">
              <FaHeart className="icon" />
            </Link>

            <Link to="/cart" className="icon-btn">
              <FaShoppingCart className="icon" />
              {cart.length > 0 && <span>{cart.length}</span>}
            </Link>

            {user ? (
              <Link to="/account" className="profile-btn">
                <img
                  src={user.picture || "/default-avatar.png"}
                  alt={user.name}
                  className="user-avatar"
                />
                <span>
                  Bem-vindo, <br /> {user.name.split(" ")[0]}
                </span>
              </Link>
            ) : (
              <Link to="/login" className="login-btn">
                <FaUser /> Entrar
              </Link>
            )}
          </div>
        </div>

        <nav className="bottom-bar">
          <div
            className="nav-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="nav-btn" onClick={handleClick}>
              <FaBars />
              Categorias
            </button>

            {/* mostra o menu apenas quando aberto */}
            {isOpen && categories.length > 0 && (
              <div className="dropdown-root">
                {/* CategoryList renderiza todos os níveis */}
                <CategoryList cats={categories} />
              </div>
            )}
          </div>

          <Link to="/products" className="nav-btn">
            <FaBoxOpen />
            Todos os Produtos
          </Link>

          <button className="nav-btn" onClick={scrollToPromotions}>
            <FaTags />
            Promoções
          </button>

          <button className="nav-btn" onClick={scrollToPartners}>
            <FaUsers />
            Fornecedores
          </button>

          <a
            href="https://ikommercylanding.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-btn"
          >
            <FaGift />
            Sobre Nós
          </a>

          <Link to="/support" className="nav-btn">
            <FaHeadphones />
            Atendimento
          </Link>
        </nav>
      </header>

      <div ref={promoSectionRef} />
      <div ref={partnersSectionRef} />
    </>
  );
};

export default Header;

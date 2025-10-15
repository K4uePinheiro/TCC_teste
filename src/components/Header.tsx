import {
  FaSun,
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaTags,
  FaUsers,
  FaGift,
  FaHeadphones,
  FaBars,
  FaSearch,
  FaMoon,
} from "react-icons/fa";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const Header = () => {
  type Category = {
    id: number;
    name: string;
    subCategories: Category[];
  };
  // state da busca. Substituir isso depois pelo java samu
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  //category
  const [categories, setCategories] = useState<Category[]>([]);
  const renderCategories = (cats: Category[]) => {
    return (
      <ul className="dropdown-menu">
        {cats.map((cat) => (
          <li key={cat.id}>
            <Link to={`/product?category=${cat.id}`}>{cat.name}</Link>

            {/* Se tiver subcategorias, renderiza dentro */}
            {cat.subCategories && cat.subCategories.length > 0 && (
              <ul className="dropdown-submenu">
                {renderCategories(cat.subCategories)}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  //handlemouse
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { cart } = useCart();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const promoSectionRef = useRef<HTMLDivElement>(null);
  const partnersSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Erro ao buscar categorias", err);
      }
    };
    fetchCategories();
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsDarkMode((prev) => !prev);
      setIsAnimating(false);
    }, 300); // Duração da animação
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // detectar se está em mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // chama uma vez ao montar
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!isMobile) {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      timeoutId.current = setTimeout(() => {
        setIsOpen(false);
      }, 200); // delay de 200ms
    }
  };

  const handleClick = () => {
    if (isMobile) {
      setIsOpen((prev) => !prev);
    }
  };

  // função para enviar a busca
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      try {
        const res = await api.get("/product/name/", {
          params: { search },
        });
        console.log("Produtos encontrados:", res.data);
        navigate(`/product?search=${encodeURIComponent(search)}`);
      } catch (err) {
        console.error("Erro na busca:", err);
      }
    }
  };


  const scrollToPromotions = () => {
    promoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPartners = () => {
    if (partnersSectionRef.current) {
      partnersSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
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

          {/* Conectar com Java */}
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
            <button className="icon-btn">
              <FaHeart className="icon" />
            </button>
            <Link to="/cart" className="icon-btn">
              <FaShoppingCart className="icon" />
              {cart.length > 0 && <span>{cart.length}</span>}
            </Link>

            <Link to="/login" className="login-btn">
              <FaUser /> Entrar
            </Link>
          </div>
        </div>

        <nav className="bottom-bar">
          {/*cattegorias*/}
          <div
            className="nav-dropdown"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="nav-btn" onClick={handleClick}>
              <FaBars />
              Categorias
            </button>

              {isOpen && categories.length > 0 && renderCategories(categories)}
            </div>

            <button className="nav-btn" onClick={scrollToPromotions}>
              <FaTags />
              Promoções
            </button>
            <button className="nav-btn" onClick={scrollToPartners}>
              <FaUsers />
              Fornecedores
            </button>

            <button className="nav-btn">
              <FaGift />
              Sobre Nós
            </button>
            <button className="nav-btn">
              <FaHeadphones />
              Atendimento
            </button>
        </nav>
      </header>

      {/* Referência para a seção de promoções */}
      <div ref={promoSectionRef} />
      <div ref={partnersSectionRef} />
    </>
  );
};

export default Header;

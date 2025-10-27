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
} from "react-icons/fa";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // 🔹 importa o contexto de autenticação

const Header = () => {
  type Category = {
    id: number;
    name: string;
    subCategories: Category[];
  };

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const renderCategories = (cats: Category[]) => {
    return (
      <ul className="dropdown-menu">
        {cats.map((cat) => (
          <li key={cat.id}>
            <Link to={`/product?category=${cat.id}`}>{cat.name}</Link>
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

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { cart } = useCart();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const promoSectionRef = useRef<HTMLDivElement>(null);
  const partnersSectionRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth(); // 🔹 pega o usuário logado

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
    }, 300);
  };

  useEffect(() => {
    if (isDarkMode) document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
  }, [isDarkMode]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      try {
        await api.get(`/product/name/${encodeURIComponent(search)}`);
        navigate(`/product/name/${encodeURIComponent(search)}`);
      } catch (err) {
        console.error("Erro na busca:", err);
      }
    }
  };

  const scrollToPromotions = () =>
    promoSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToPartners = () =>
    partnersSectionRef.current?.scrollIntoView({ behavior: "smooth" });

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
              {isDarkMode ? (
                <FaMoon className="icon" />
              ) : (
                <FaSun className="icon" />
              )}
            </button>

              <Link to="/favorites" className="icon-btn">
              <FaHeart className="icon" />
              </Link>

            <Link to="/cart" className="icon-btn">
              <FaShoppingCart className="icon" />
              {cart.length > 0 && <span>{cart.length}</span>}
            </Link>

            {/* 🔹 Se o usuário estiver logado, mostra o avatar + perfil */}
            {user ? (
              <Link to="/account" className="profile-btn">
                <img
                  src={user.picture || "/default-avatar.png"}
                  alt={user.name}
                  className="user-avatar"
                />
                <span>Bem Vindo {user.name}</span>{" "}
                {/* 🔹 Aqui está a mudança */}
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

           <Link to="/support"className="nav-btn">
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

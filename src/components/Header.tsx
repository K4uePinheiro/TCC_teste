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
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { productsMock, type Category, } from "../mocks/productsMocks";

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

  // 🧠 Renderiza categorias recursivamente
  const renderCategories = (cats: Category[]) => (
    <ul className="dropdown-menu">
      {cats.map((cat) => (
        <li key={cat.id}>
          <Link to={`/produtos?category=${cat.id}`}>{cat.name}</Link>
          {cat.subCategories?.length > 0 && (
            <ul className="dropdown-submenu">
              {renderCategories(cat.subCategories)}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  // 🟢 Buscar categorias — tenta API, senão usa mock
  useEffect(() => {
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
  }, []);

  // 🌙 Tema escuro
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

  // 📱 Responsividade
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🧭 Hover e clique menu
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

  // 🔎 Busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/produtos?q=${encodeURIComponent(search.trim())}`);
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
                <span>Bem-vindo, <br></br> {user.name.split(" ")[0]}</span>
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
            <a href="https://ikommercylanding.netlify.app/">Sobre Nós</a>
          </button>

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

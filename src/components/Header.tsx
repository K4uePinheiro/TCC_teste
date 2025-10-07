import type { FC } from "react";
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
} from "react-icons/fa";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Header: FC = () => {
  type Categories = {
    idCategory: number;
    nameCategory: string;
  };
  // state da busca. Substituir isso depois pelo java samu
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  //category
  const [categories, setCategories] = useState<Categories[]>([]);

  //handlemouse
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { cart } = useCart();

  useEffect(() => {
    axios
      .get("http://localhost:3001/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Erro ao buscar categorias", err));
  }, []);

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
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
    }
  };

  return (
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
          <button className="icon-btn">
            <FaSun className="icon" />
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

          {isOpen && (
            <ul className="dropdown-menu">
              {categories.map((cat) => (
                <li key={cat.idCategory}>
                  <Link to={`/products?category=${cat.idCategory}`}>
                    {cat.nameCategory}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button className="nav-btn">
          <FaTags />
          Promoções
        </button>
        <button className="nav-btn">
          <FaUsers />
          Parcerias
        </button>
        <button className="nav-btn">
          <FaGift />
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
  );
};

export default Header;

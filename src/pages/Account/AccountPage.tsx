import { type FC, type JSX } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebase";
import "./AccountPage.css";
import {
  ShoppingCart,
  Heart,
  Package,
  Headphones,
  Shield,
  LogOut,
  Store,
} from "lucide-react";

interface Card {
  icon: JSX.Element;
  title: string;
  action?: () => void;
  path?: string;
}

const AccountPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem("cart");
      localStorage.removeItem("favorites");
      window.location.reload();
    });
  };

  const cards: Card[] = [
    { icon: <ShoppingCart size={36} />, title: "Carrinho", path: "/cart" },
    { icon: <Heart size={36} />, title: "Favoritos", path: "/favorites" },
    { icon: <Package size={36} />, title: "Seus Pedidos", path: "/orders" },
    { icon: <Store size={36} />, title: "Área do Fornecedor", path: "/supplier" },
    { icon: <Headphones size={36} />, title: "Atendimento", path: "/support" },
    { icon: <Shield size={36} />, title: "Privacidade", path: "/privacy" },
    { icon: <LogOut size={36} />, title: "Sair da conta", action: handleLogout },
  ];

  return (
    <div className="account-container">
      <div className="account-header">
        <h2>Sua conta</h2>
        <p>Bem vindo ao seu perfil {user?.name || user?.email || "Usuário"}</p>
      </div>

      <div className="account-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className="account-card"
            onClick={() => {
              if (card.action) card.action();
              else if (card.path) navigate(card.path);
            }}
          >
            <div className="icon">{card.icon}</div>
            <p>{card.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountPage;
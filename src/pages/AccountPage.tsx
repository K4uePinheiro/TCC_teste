import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../components/AccountPage.css";
import {
  ShoppingCart,
  Heart,
  Package,
  Headphones,
  Shield,
  LogOut
} from "lucide-react";

const AccountPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cards = [
    { icon: <ShoppingCart size={36} />, title: "Carrinho" },
    { icon: <Heart size={36} />, title: "Favoritos" },
    { icon: <Package size={36} />, title: "Seus Pedidos" },
    { icon: <Headphones size={36} />, title: "Atendimento" },
    { icon: <Shield size={36} />, title: "Privacidade" },
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
            onClick={card.action ? card.action : undefined}
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

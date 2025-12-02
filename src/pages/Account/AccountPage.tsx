import { type FC, type JSX } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { auth } from "../../services/firebase";
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
  const { user, loading, logout } = useAuth(); // supondo que você tenha um loading
  const navigate = useNavigate();

 

  // Se o usuário ainda não carregou, exibe loading
  if (loading || !user) {
    return <div className="account-container">Carregando perfil...</div>;
  }

  const roles: string[] = user.roles ?? [];

  const isSupplier = roles.includes("ROLE_SUPPLIER") || roles.includes("ROLE_SUPPLIER_PRIMARY");

  const cards: Card[] = [
    { icon: <ShoppingCart size={36} />, title: "Carrinho", path: "/cart" },
    { icon: <Heart size={36} />, title: "Favoritos", path: "/favorites" },
    { icon: <Package size={36} />, title: "Seus Pedidos", path: "/orders" },
    ...(isSupplier
      ? [{ icon: <Store size={36} />, title: "Área do Fornecedor", path: "/supplier" }]
      : []),
    { icon: <Headphones size={36} />, title: "Atendimento", path: "/support" },
    { icon: <Shield size={36} />, title: "Privacidade", path: "/priv" },
    { icon: <LogOut size={36} />, title: "Sair da conta", action: logout },
  ];

  return (
    <div className="account-container">
      <div className="account-header">
        <h2>Sua conta</h2>
        <p>Bem vindo ao seu perfil {user.name || user.email || "Usuário"}</p>
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



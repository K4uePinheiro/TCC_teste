import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import "../components/UserPageLayout.css";

interface UserPageLayoutProps {
  title: string;
  children: ReactNode;
}

const UserPageLayout = ({ title, children }: UserPageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="user-page-container">
      <div className="user-page-header">
        <button className="back-btn" onClick={() => navigate("/account")}>
          ← Voltar à conta
        </button>
        <h2>{title}</h2>
      </div>
      <div className="user-page-content">{children}</div>
    </div>
  );
};

export default UserPageLayout;

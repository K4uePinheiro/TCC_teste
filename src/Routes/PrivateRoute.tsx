// PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  // Evita piscar a tela enquanto verifica o estado de autenticação
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-lg">
        Carregando...
      </div>
    );
  }

  // Se não estiver logado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

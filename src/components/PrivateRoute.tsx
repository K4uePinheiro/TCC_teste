// PrivateRoute.tsx
import type { JSX } from "react";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import RegisterForm from "./pages/Register/RegisterForm";
import LoginForm from "./pages/Login/LoginForm";
import Header from "./components/common/Header/Header";
import ErrorBoundary from "./components/common/Error/Error.Boundary";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import ProductPage from "./pages/Product/ProductPage";
import Footer from "./components/common/Footer/Footer";
import CartPage from "./pages/Cart/CartPage";
import AccountPage from "./pages/Account/AccountPage";
import PrivateRoute from "./Routes/PrivateRoute";
import OrdersPage from "./pages/Orders/OrdersPage"
import FavoritesPage from "./pages/Favorites/FavoritesPage"
import PrivacyPage from "./pages/Orders/PrivacyPage"
import SupportPage from "./pages/Support/SupportPage"
import TermoUso from "./pages/Politicas/TermoUso"
import PoliticaDevolucao from "./pages/Politicas/PoliticaDevolucao";
import PoliticaPrivacidade from "./pages/Politicas/PoliticaPrivacidade";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContex";
import "./App.css";



import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId="587997109351-ro6laoog3jm33rfc6h6rmsl40mm8m90e.apps.googleusercontent.com">
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/cadastro" element={<RegisterForm />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/TermoUso" element={<TermoUso />} />
              <Route path="/PoliticaDevolucao" element={<PoliticaDevolucao />} />
              <Route path="/PoliticaPrivacidade" element={<PoliticaPrivacidade />} />

              {/* 🔒 Rota protegida */}
              <Route
                path="/account"
                element={
                  <PrivateRoute>
                    <AccountPage />
                  </PrivateRoute>
                }
              />
            </Routes>
            <Footer />
          </Router>
          </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
};

export default App;

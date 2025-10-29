import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import Header from "./components/Header";
import ErrorBoundary from "./components/Error.Boundary";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import Footer from "./components/Footer";
import CartPage from "./pages/CartPage";
import AccountPage from "./pages/AccountPage";
import PrivateRoute from "./components/PrivateRoute";
import OrdersPage from "./pages/OrdersPage"
import FavoritesPage from "./pages/FavoritesPage"
import PrivacyPage from "./pages/PrivacyPage"
import SupportPage from "./pages/SupportPage"
import "./App.css";

import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId="587997109351-ro6laoog3jm33rfc6h6rmsl40mm8m90e.apps.googleusercontent.com">
        <AuthProvider>
          <Router>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/produtos" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/cadastro" element={<RegisterForm />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />




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
        </AuthProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
};

export default App;

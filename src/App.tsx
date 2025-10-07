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


const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products" element={<ProductsPage />}/>
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/cadastro" element={<RegisterForm />} />
        </Routes>
        <Footer />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
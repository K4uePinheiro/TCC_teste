import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { CartProvider } from "./context/CartContext"; // importa o provider

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento root não encontrado!");
}

createRoot(rootElement).render(
  <StrictMode>
    <CartProvider>  
      <App />
    </CartProvider>
  </StrictMode>
);

import { useCart } from "../context/CartContext";
import { FiTrash2 } from "react-icons/fi"; // ícone de lixeira
import "../components/CartPage.css";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Produtos no carrinho</h1>
        {cart.length > 0 && (
          <button className="clear-btn" onClick={clearCart}>
            <FiTrash2 /> Remover todos os produtos
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />

              <div className="cart-info">
                <h3>{item.name}</h3>
                <p>
                  Preço à vista: <span className="price">R$ {item.price.toFixed(2)}</span>
                </p>
                <p>Parcelas de 12x sem juros de {(item.price / 12).toFixed(2)}</p>
                <p className="seller">Fornecedor: <span>{item.seller}</span></p>
                <p className="delivery">Entregue por: <span>RRR entregas.</span></p>
              </div>

              <div className="cart-actions">
                <p>Quantidade</p>
                <div className="quantity-control">
                  <button onClick={() => removeFromCart(item.id)} className="trash-btn">
                    <FiTrash2 />
                  </button>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="cart-summary">
          <h2>Resumo</h2>
          <p>Total de produtos: {cart.length}</p>
          <p>
            Total a pagar: <span className="price">R$ {total.toFixed(2)}</span>
          </p>
          <button className="continue-btn">Continuar</button>
          <button className="back-btn">Voltar</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;

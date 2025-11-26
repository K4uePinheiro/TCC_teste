import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { FiTrash2 } from "react-icons/fi";
import "./CartPage.css";
import { useNavigate } from "react-router-dom";
import { getAllAddresses } from "../../services/userService";
import CheckoutProgress from "./Checkout/CheckoutProgress";

const CartPage: React.FC = () => {
  // ✅ ATUALIZAÇÃO: Adicionando removeItem e deleteOrder
  const { cart, updateQuantity, removeItem, deleteOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ========================================================
  // 1. Proteção contra cart undefined (fix do erro)
  // ========================================================
  if (!cart) {
    return (
      <div className="cart-container">
        <h1>Carregando carrinho...</h1>
      </div>
    );
  }

  // ========================================================
  // 2. Se o usuário não estiver logado
  // ========================================================
  if (!user) {
    return (
      <div className="cart-containera">
        <h1>
          <img src="/shoppingcart.png" alt="shopping_cart" />
          Carrinho
        </h1>
        <p>Você precisa estar logado para acessar o carrinho.</p>
        <button onClick={() => navigate("/login")} className="continuer-btn">
          Fazer login
        </button>
      </div>
    );
  }

  // ========================================================
  // 3. Cálculo seguro do total (previne erro do reduce)
  // ========================================================
  const total =
    cart?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;

  return (
    <div className="cart-container">
      <CheckoutProgress currentStep="carrinho" />

      <div className="cart-header">
        <h1>
          <img src="/shoppingcart.png" alt="shopping_cart" />
          Produtos no carrinho
        </h1>

        {cart.length > 0 && (
          // ✅ CORREÇÃO: Habilitando e conectando o botão de remover todos
          <button className="clear-btn" onClick={deleteOrder}>
            <FiTrash2 /> Remover todos os produtos
          </button>
        )}
      </div>

      <div className="linhas">
        {/* Carrinho vazio */}
        {cart.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.productId} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>
                    Preço à vista:{" "}
                    <span className="price">
                      R$ {item.price.toFixed(2)}
                    </span>
                  </p>
                  <p>
                    Parcelas de 12x sem juros de{" "}
                    {(item.price / 12).toFixed(2)}
                  </p>
                  <p className="seller">
                    Fornecedor: <span>{item.seller}</span>
                  </p>
                  <p className="delivery">
                    Entregue por: <span>RRR entregas.</span>
                  </p>
                </div>

                <div className="cart-actions">
                  <p>Quantidade</p>
                  <div className="quantity-control">
                    {/* ✅ CORREÇÃO: Habilitando e conectando o botão de remover item */}
                    <button className="trash-btn" onClick={() => removeItem(item.productId)}>
                      <FiTrash2 />
                    </button>

                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resumo */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <h2>Resumo</h2>
            <p>Total de produtos: {cart.length}</p>
            <p>
              Total a pagar:{" "}
              <span className="price">R$ {total.toFixed(2)}</span>
            </p>

            <button
              type="button"
              className="continue-btn"
              onClick={async () => {
                const addresses = await getAllAddresses();

                if (addresses.length === 0) {
                  navigate("/address", {
                    state: { total, newAddress: true },
                  });
                } else {
                  navigate("/address", {
                    state: { cartTotal: total, autoSelect: true },
                  });
                }
              }}
            >
              Continuar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
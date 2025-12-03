import { Link } from "react-router-dom";
import "./FinalPage.css";
import CheckoutProgress from "../Checkout/CheckoutProgress";

export default function Confirm() {
  return (
    <>
    <CheckoutProgress currentStep="concluido" />
    <div className="bodyy">
    
   
      <div className="payment-confirmation-container">
        <div className="payment-success-header">
          <h1 className="payment-success-title">
            Seu pagamento foi efetuado
            <span className="payment-checkmark-icon"></span>
          </h1>
          <p className="payment-success-subtitle">
            Compre mais vezes com nossa loja
          </p>
        </div>

        <div className="ikommercy-logo-section">
          <div className="ikommercy-brand-logo">
            <img src="/logo_ik.svg" alt="Ikommercy logo" />
          </div>
        </div>

        <div className="order-tracking-card">
          <div className="order-tracking-header">
            <img
              className="order-tracking-icon"
              src="/truck.svg"
              alt="caminhãoo icon"
            />
            <span>Rastreie-já sua encomenda</span>
          </div>
          <button className="order-tracking-button">Rastrear pedido</button>
        </div>

        
        
          <div className="continue-shopping-button">
             <img
            className="shopping-bag-icon"
            src="/bag.svg"
            alt="sacola de compras icon"
          />
          
          <Link to="/" className="btn-continue-shopping">
                    Continuar comprando
                  </Link>
       </div>
      </div> 
      </div>
    </>
  );
}

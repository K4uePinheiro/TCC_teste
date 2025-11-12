import "./AddressPage.css";
import { useLocation } from "react-router-dom"; // 👈 importa o hook para receber o total

interface Address {
  nome: string;
  rua: string;
  numero: string;
  estado: string;
  bairro: string;
  cidade: string;
  cep: string;
}

interface ConfirmScreenProps {
  address: Address;
  onNewAddress: () => void;
  cartTotal: number; // 👈 recebido da AddressPage
  frete?: number;
}

export default function ConfirmScreen({
  address,
  onNewAddress,
  frete = 32.9,
}: ConfirmScreenProps) {
  const location = useLocation();

  // 💰 pega o total enviado via navigate("/confirm", { state: { total } })
  const cartTotal = Number(location.state?.total) || 0;

  // 💡 Calcula total geral (produtos + frete)
  const totalComFrete = cartTotal + frete;
  const descontoPix = totalComFrete * 0.9;
  const valorParcelado = totalComFrete / 12;

  return (
    <div className="confirm-screen" id="tela2">
      <div className="address-summary">
        <div className="cabeca">
          <h2>
            <img src="./caminhao.svg" alt="Ícone caminhão" width="24" />
            Endereço de entrega
          </h2>
          <button className="add-address-btn" onClick={onNewAddress}>
            + Endereço
          </button>
        </div>

        <div className="address-card">
          <div className="address-info">
            <span className="check-icon">✔</span>
            <div className="details">
              <h3>{address.nome}</h3>
              <p>
                {address.rua}, {address.numero} - {address.estado}
              </p>
              <p>
                {address.bairro} - {address.cidade} - {address.cep}
              </p>
            </div>
          </div>

          <div className="address-actions">
            <button className="edit-btn">
              <i className="fa fa-edit"></i> Editar
            </button>
            <button className="delete-btn">
              <i className="fa fa-trash"></i> Excluir
            </button>
          </div>
        </div>
      </div>

      <div className="payment-card">
        <p>
          <strong>
            12x de <span>R$ {valorParcelado.toFixed(2).replace(".", ",")}</span>
          </strong>
        </p>
        <div className="price-line"></div>

        <div className="pix-discount">
          <img src="./pix.svg" alt="Ícone Pix" width="24" />
          <div>
            <p>
              <strong>R$ {descontoPix.toFixed(2).replace(".", ",")}</strong>
            </p>
            <p>Desconto à vista no Pix ou boleto</p>
          </div>
        </div>

        <div className="price-line"></div>

        <div className="total">
          <div className="frete">
            <p>Frete</p>
            <p>R$ {frete.toFixed(2).replace(".", ",")}</p>
          </div>
          <div className="total">
            <p>Total</p>
            <p>R$ {totalComFrete.toFixed(2).replace(".", ",")}</p>
          </div>
        </div>

        <button className="continue-btn">Continuar</button>
      </div>
    </div>
  );
}

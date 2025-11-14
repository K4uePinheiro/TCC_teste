import "./AddressPage.css";
import { deleteAddress } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


interface Address {
  id: string;
  nome: string;
  rua: string;
  numero: string;
  estado: string;
  bairro: string;
  cidade: string;
  cep: string;
}

interface ConfirmScreenProps {
  onNewAddress: () => void;
  onEditAddress: (address: Address) => void;
  cartTotal: number;
  frete?: number;
  address?: Address;
  addressList: Address[];
  setAddressList: React.Dispatch<React.SetStateAction<Address[]>>;
}

export default function ConfirmScreen({
  onNewAddress,
  onEditAddress,
  cartTotal,
  frete = 32.9,
  addressList,
  setAddressList,
}: ConfirmScreenProps) {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [ativo, setAtivo] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este endereço?")) return;

    try {
      await deleteAddress(id);
      setAddressList((prev) => prev.filter((addr) => addr.id !== id));
    } catch (error) {
      console.error("Erro ao excluir endereço:", error);
      alert("Erro ao excluir endereço. Tente novamente.");
    }
  };

  const handleEdit = (address: Address) => {
    onEditAddress(address);
  };

  const totalComFrete = cartTotal + frete;
  const descontoPix = totalComFrete * 0.9;
  const valorParcelado = totalComFrete / 12;

  return (
    <>
    
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

        {addressList.length === 0 ? (
          <p>Nenhum endereço cadastrado ainda.</p>
        ) : (
          addressList.map((address) => (
            <div
              key={address.id}
              className={`address-card ${ativo === address.id ? "ativo" : ""}`}
              onClick={() => {
                setAtivo(address.id);
                setSelectedAddress(address);
              }}
            >
              <div className="address-info">
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
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(address)}
                >
                  <i className="fa fa-edit"></i> Editar
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(address.id)}
                >
                  <i className="fa fa-trash"></i> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ---- CARTÃO DE PAGAMENTO ---- */}
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
          <p>Frete</p>
          <p><span>R$ {frete.toFixed(2).replace(".", ",")}</span></p>
        </div>

        <div className="total">
          <p>Total</p>
          <p><span>R$ {totalComFrete.toFixed(2).replace(".", ",")}</span></p>
        </div>

        <button
          className="continue-btn"
          onClick={() => {
            if (!selectedAddress) {
              alert("Selecione um endereço antes de continuar.");
              return;
            }

            navigate("/pagamento", {
              state: {
                cartTotal,
                address: selectedAddress,
              },
            });
          }}
        >
          Continuar
        </button>
      </div>
    </div>
    </>
  );
}

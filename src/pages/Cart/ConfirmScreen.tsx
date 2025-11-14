import "./AddressPage.css";
import { useEffect, useState } from "react";
import { getAllAddresses, deleteAddress } from "../../services/userService";

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
  cartTotal: number;
  frete?: number;
  address?: Address;
}

export default function ConfirmScreen({
  onNewAddress,
  cartTotal,
  frete = 32.9,
}: ConfirmScreenProps) {

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar endereços do Firebase
  useEffect(() => {
    async function load() {
      const list = await getAllAddresses();
      setAddresses(list as Address[]);
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja excluir este endereço?")) return;

    await deleteAddress(id);

    // atualiza lista
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleEdit = (address: Address) => {
    // Pode abrir o form carregando este endereço
    // Passa para o AddressPage
    onNewAddress(); // abre o formulário
    // Aqui você deve ajustar o AddressPage para aceitar "editingAddress"
    localStorage.setItem("editAddress", JSON.stringify(address));
  };

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

        {/* 📌 LISTA DE ENDEREÇOS */}
        {loading ? (
          <p>Carregando endereços...</p>
        ) : addresses.length === 0 ? (
          <p>Nenhum endereço cadastrado ainda.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-info">
                <span className="check-icon">✔</span>
                <div className="details">
                  <h3>{address.nome}</h3>
                  <p>{address.rua}, {address.numero} - {address.estado}</p>
                  <p>{address.bairro} - {address.cidade} - {address.cep}</p>
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
            12x de{" "}
            <span>R$ {valorParcelado.toFixed(2).replace(".", ",")}</span>
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
          <p>R$ {frete.toFixed(2).replace(".", ",")}</p>
        </div>

        <div className="total">
          <p>Total</p>
          <p>R$ {totalComFrete.toFixed(2).replace(".", ",")}</p>
        </div>

        <button className="continue-btn">Continuar</button>
      </div>
    </div>
  );
}

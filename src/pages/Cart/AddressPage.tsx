import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddressForm from "./AddressForm";
import ConfirmScreen from "./ConfirmScreen";
import { saveAdress, getAllAddresses } from "../../services/userService";

export default function AddressPage() {
  const location = useLocation();

  const cartTotal = Number(location.state?.total) || 0;

  const autoSelect = location.state?.autoSelect || false;
  const newAddress = location.state?.newAddress || false;

  const [step, setStep] = useState<"loading" | "form" | "confirm">("loading");
  const [, setAddressList] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  // 🔥 Ao abrir a página, buscar endereços do Firebase
  useEffect(() => {
    async function load() {
      const addresses = await getAllAddresses(); // ← pega todos endereços

      setAddressList(addresses);

      // 🟦 Carrinho pediu para cadastrar um novo endereço
      if (newAddress) {
        setStep("form");
        return;
      }

      // 🟥 Não tem nenhum endereço → abrir formulário
      if (addresses.length === 0) {
        setStep("form");
        return;
      }

      // 🟩 Já tem endereço e carrinho pediu autoSelect
      if (autoSelect) {
        setSelectedAddress(addresses[0]); // pega o primeiro
        setStep("confirm");
        return;
      }

      // 🟧 Situação normal: ir para confirm com o primeiro
      setSelectedAddress(addresses[0]);
      setStep("confirm");
    }

    load();
  }, []);

  const handleConfirm = async (data: any) => {
    try {
      const id = await saveAdress(data); // salva no Firebase

      const newAddress = { id, ...data };

      // adiciona na lista local
      setAddressList((prev) => [...prev, newAddress]);

      // seleciona para confirmar
      setSelectedAddress(newAddress);

      setStep("confirm");
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
    }
  };

  const handleNewAddress = () => {
    setSelectedAddress(null);
    setStep("form");
  };

  if (step === "loading") {
    return <p>Carregando endereço...</p>;
  }

  return (
    <>
      {step === "form" ? (
        <AddressForm onConfirm={handleConfirm} />
      ) : (
        <ConfirmScreen
          address={selectedAddress}
          onNewAddress={handleNewAddress}
          cartTotal={cartTotal}
        />
      )}
    </>
  );
}

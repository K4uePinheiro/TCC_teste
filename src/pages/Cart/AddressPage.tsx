import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddressForm from "./AddressForm";
import ConfirmScreen from "./ConfirmScreen";
import { saveAdress, getAllAddresses, updateAddress } from "../../services/userService";
import './Checkout/CheckoutProgress.css';
import CheckoutProgress from "./Checkout/CheckoutProgress";

export default function AddressPage() {
  const location = useLocation();

  const cartTotal =
  location.state?.cartTotal ??
  location.state?.total ??
  0;
  const autoSelect = location.state?.autoSelect || false;
  const newAddress = location.state?.newAddress || false;

  const [step, setStep] = useState<"loading" | "form" | "confirm">("loading");
  const [addressList, setAddressList] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  // 🔥 Ao abrir a página, buscar endereços do Firebase
  useEffect(() => {
    async function load() {
      const addresses = await getAllAddresses();
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
        setSelectedAddress(addresses[0]);
        setStep("confirm");
        return;
      }

      // 🟧 Situação normal: ir para confirm com o primeiro
      setSelectedAddress(addresses[0]);
      setStep("confirm");
    }

    load();
  }, [autoSelect, newAddress]);



  const handleConfirm = async (data: any) => {
    try {
      // 🔥 EDITANDO
      if (editingAddress?.id) {

        const updatedData = { ...data, id: editingAddress.id };

        await updateAddress(editingAddress.id, updatedData);

        setAddressList((prev) =>
          prev.map((addr) => (addr.id === editingAddress.id ? updatedData : addr))
        );

        setSelectedAddress(updatedData);
        setEditingAddress(null);

      } else {
        // 🔥 NOVO ENDEREÇO
        const id = await saveAdress(data);
        const newAddressObj = { id, ...data };

        setAddressList((prev) => [...prev, newAddressObj]);
        setSelectedAddress(newAddressObj);
      }

      setStep("confirm");

    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      alert("Erro ao salvar endereço. Tente novamente.");
    }
  };


  const handleNewAddress = () => {
    setEditingAddress(null);
    setSelectedAddress(null);
    setStep("form");
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setStep("form");
  };

  if (step === "loading") {
    return <p>Carregando endereço...</p>;
  }

  return (
    <>
    <CheckoutProgress currentStep="entrega" />
      {step === "form" ? (
        <AddressForm onConfirm={handleConfirm} initialData={editingAddress}
        />
      ) : (
        <ConfirmScreen
          address={selectedAddress}
          onNewAddress={handleNewAddress}
          onEditAddress={handleEditAddress}
          cartTotal={cartTotal}
          addressList={addressList}
          setAddressList={setAddressList}
        />

      )}
    </>
  );
}
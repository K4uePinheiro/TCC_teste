import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddressForm from "./AddressForm";
import ConfirmScreen from "./ConfirmScreen";
import {
  saveAdress,
  getAllAddresses,
  updateAddress,
} from "../../services/userService";
import "./Checkout/CheckoutProgress.css";
import CheckoutProgress from "./Checkout/CheckoutProgress";

export default function AddressPage() {
  const location = useLocation();
  // const navigate = useNavigate();

  const cartTotal = location.state?.cartTotal ?? location.state?.total ?? 0;
  const autoSelect = location.state?.autoSelect || false;
  const newAddress = location.state?.newAddress || false;

  const [step, setStep] = useState<"loading" | "form" | "confirm">("loading");
  const [addressList, setAddressList] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  // 🔥 Ao abrir: carregar endereços
  useEffect(() => {
    async function load() {
      const addresses = await getAllAddresses();
      setAddressList(addresses);

      if (newAddress) {
        setStep("form");
        return;
      }

      if (addresses.length === 0) {
        setStep("form");
        return;
      }

      if (autoSelect) {
        setSelectedAddress(addresses[0]);
        setStep("confirm");
        return;
      }

      setSelectedAddress(addresses[0]);
      setStep("confirm");
    }

    load();
  }, [autoSelect, newAddress]);

  // 🔥 Salvar ou editar endereço
  const handleConfirm = async (data: any) => {
    try {
      if (editingAddress?.id) {
        const updatedData = { ...data, id: editingAddress.id };
        await updateAddress(editingAddress.id, updatedData);

        setAddressList((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress.id ? updatedData : addr
          )
        );

        setSelectedAddress(updatedData);
        setEditingAddress(null);
      } else {
        const id = await saveAdress(data);
        const newAddressObj = { id, ...data };

        setAddressList((prev) => [...prev, newAddressObj]);
        setSelectedAddress(newAddressObj);
      }

      setStep("confirm"); // 🔥 apenas volta para confirmar
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
        <AddressForm onConfirm={handleConfirm} initialData={editingAddress} />
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

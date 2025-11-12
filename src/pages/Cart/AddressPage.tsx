import { useState } from "react";
import { useLocation } from "react-router-dom";
import AddressForm from "./AddressForm";
import ConfirmScreen from "./ConfirmScreen";

export default function AddressPage() {
  const location = useLocation();
  const cartTotal = Number(location.state?.total) || 0; // 💰 pega o total vindo do carrinho

  const [step, setStep] = useState<"form" | "confirm">("form");
  const [address, setAddress] = useState<any>(null);

  const handleConfirm = (data: any) => {
    setAddress(data);
    setStep("confirm");
  };

  const handleNewAddress = () => {
    setAddress(null);
    setStep("form");
  };

  return (
    <>
      {step === "form" ? (
        <AddressForm onConfirm={handleConfirm} />
      ) : (
        <ConfirmScreen
          address={address}
          onNewAddress={handleNewAddress}
          cartTotal={cartTotal} // 👈 repassa o total aqui
        />
      )}
    </>
  );
}

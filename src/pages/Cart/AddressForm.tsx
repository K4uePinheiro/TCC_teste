import {
  useState,
  type FormEvent,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import "./AddressPage.css"

type Address = {
  nome: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

interface Props {
  onConfirm: (data: any) => void;
  initialData?: any; // ← ADICIONE ISTO
}

export default function AddressForm({ onConfirm }: Props) {
  const [form, setForm] = useState<Address>({
    nome: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const [loadingCep, setLoadingCep] = useState(false);

  // Atualiza os campos conforme o usuário digita
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id as keyof Address]: value }));

    // Se for o campo CEP e tiver 8 dígitos, busca na API
    if (id === "cep" && value.replace(/\D/g, "").length === 8) {
      fetchCep(value);
    }
  };

  // Busca informações do CEP usando a API ViaCEP
  const fetchCep = async (cep: string) => {
    try {
      setLoadingCep(true);
      const cleanCep = cep.replace(/\D/g, "");
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();

      if (data.erro) {
        alert("CEP não encontrado!");
        return;
      }

      // Atualiza os campos automaticamente
      setForm((prev) => ({
        ...prev,
        rua: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
      }));
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      alert("Erro ao buscar CEP. Tente novamente.");
    } finally {
      setLoadingCep(false);
    }
  };

  // Confirma o envio
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allFilled = Object.values(form).every((v) => v.trim() !== "");
    if (!allFilled) {
      alert("Preencha todos os campos!");
      return;
    }
    onConfirm(form);
  };

  const handleCancel = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setForm({
      nome: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    });
  };

  return (
    <div className="corpo">
      
      <div className="page" id="tela1">
        <div className="container">
          {/* Cabeçalho */}
          <div className="cabeca">
            <div className="left">
              <img src="/caminhao.svg" alt="Ícone caminhão" width="24" />
              <h1>Endereço de entrega</h1>
            </div>
            <button className="add-address-btn">+ Endereço</button>
          </div>
          {/* Corpo */}
          <div className="body">
            <form className="form" onSubmit={handleSubmit}>
              <div className="inputs">
                <div className="form-left">
                  <input
                    type="text"
                    id="nome"
                    placeholder="Nome do local (ex: Casa)"
                    value={form.nome}
                    onChange={handleChange}
                  />
                  <div className="cep-container">
                    <input
                      type="text"
                      id="cep"
                      placeholder="CEP"
                      value={form.cep}
                      onChange={handleChange}
                    />
                    {loadingCep && (
                      <span className="loading-text">Buscando...</span>
                    )}
                  </div>
                  <input
                    type="text"
                    id="rua"
                    placeholder="Rua"
                    value={form.rua}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    id="bairro"
                    placeholder="Bairro"
                    value={form.bairro}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-right">
                  <input
                    type="text"
                    id="cidade"
                    placeholder="Cidade"
                    value={form.cidade}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    id="estado"
                    placeholder="Estado"
                    value={form.estado}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    id="numero"
                    placeholder="Número"
                    value={form.numero}
                    onChange={handleChange}
                  />
                  <div className="botoes">
                    <button className="cancel-btn" onClick={handleCancel}>
                      Cancelar
                    </button>
                    <button id="confirmBtn" type="submit">
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
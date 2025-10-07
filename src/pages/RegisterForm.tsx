import {useState} from "react";
import type { ChangeEvent, FormEvent } from "react";


interface FormData {
  nome: string;
  nascimento: string;
  email: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
  aceitarTermos: boolean;
  receberNovidades: boolean;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    nascimento: "",
    email: "",
    cpf: "",
    senha: "",
    confirmarSenha: "",
    aceitarTermos: false,
    receberNovidades: false,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-9 rounded-x1 shadow-md w-full max-w-2xl"
      >
        <h2 className="text-center text-x1 font-semibold mb-6">
          Cadastre uma <span className="text-orange-500">Conta</span>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome Completo"
            value={formData.nome}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            name="nascimento"
            placeholder="Data de nascimento"
            value={formData.nascimento}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            name="email"
            placeholder="Digite seu email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded-md col-span-1"
          />
          <input
            type="text"
            name="cpf"
            placeholder="Digite seu CPF"
            value={formData.cpf}
            onChange={handleChange}
            className="border p-2 rounded-md col-span-1"
          />
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
          <input
            type="password"
            name="confirmarSenha"
            placeholder="Confirme sua senha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            className="border p-2 rounded-md"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">Continue com</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Botões de login social */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-2 border rounded-full py-2 px-4 text-sm font-medium text-gray-700 
               hover:bg-gray-100 cursor-pointer active:scale-95 transition duration-150"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continuar com Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 border rounded-full py-2 px-4 text-sm font-medium text-gray-700 
               hover:bg-gray-100 cursor-pointer active:scale-95 transition duration-150"
          >
            <img
              src="/microsoft.png" alt="microsoft" className="w-4 h-4"
            />
            Continuar com Microsoft
          </button>
        </div>

        {/* caixas de checagem */}
        <div className="mt-6 space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="aceitarTermos"
              checked={formData.aceitarTermos}
              onChange={handleChange}
            />
            Li e estou de acordo com os{" "}
            <a href="#" className="text-orange-500">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-orange-500">
              Políticas de privacidade
            </a>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="receberNovidades"
              checked={formData.receberNovidades}
              onChange={handleChange}
            />
            Quero receber novidades e ofertas por email
          </label>
        </div>

        <button
          type="submit"
          disabled={!formData.aceitarTermos}
          className={`w-full mt-4 py-2 rounded-2xl cursor-pointer active:scale-95 transition duration-150
                ${formData.aceitarTermos
                  ? "bg-orange-500 text-white hover:bg-orange-700"
                  : "bg-gray-300 text-gray-500 "}`}
        >
          Criar Conta
        </button>
      </form>
    </div>
  );
}


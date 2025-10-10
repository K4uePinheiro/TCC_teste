import { useState, useEffect } from "react";
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

  const [] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const body = document.body;

    if (!body.classList.contains("dark-mode") && storedTheme === "dark") {
      body.classList.add("dark-mode");
    } else if (body.classList.contains("dark-mode") && storedTheme !== "dark") {
      body.classList.remove("dark-mode");
    }

    const updateTheme = () => {
      if (body.classList.contains("dark-mode")) {
        body.style.setProperty("--bg-color", "#2e2e38");
        body.style.setProperty("--text-color", "#ffffff");
        body.style.setProperty("--input-bg", "#444444");
        body.style.setProperty("--input-border", "#555555");
        body.style.setProperty("--button-bg", "#555555");
        body.style.setProperty("--button-hover-bg", "#666666");
        body.style.setProperty("--placeholder-color", "#ff7300");
      } else {
        body.style.setProperty("--bg-color", "#f9f9f9");
        body.style.setProperty("--text-color", "#000000");
        body.style.setProperty("--input-bg", "#ffffff");
        body.style.setProperty("--input-border", "#dddddd");
        body.style.setProperty("--button-bg", "#ff6600");
        body.style.setProperty("--button-hover-bg", "#e65500");
        body.style.setProperty("--placeholder-color", "#ff6600");
      }
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = () => {
    if (formData.nome.length < 3) {
      alert("O nome deve ter pelo menos 3 caracteres.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Digite um email válido.");
      return false;
    }

    if (formData.cpf.length !== 11) {
      alert("O CPF deve ter 11 dígitos.");
      return false;
    }

    if (formData.senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Formulário válido", formData);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ backgroundColor: "var(--bg-color, #f9f9f9)", color: "var(--text-color, #000000)" }}
    >
      <form
        onSubmit={handleSubmit}
        className="p-9 rounded-x1 shadow-md w-full max-w-2xl"
        style={{ backgroundColor: "var(--input-bg, #ffffff)", color: "var(--text-color, #000000)", borderRadius: "12px" }}
      >
        <h2
          className="text-center text-x1 font-semibold mb-6"
          style={{ color: "var(--text-color, #000000)" }}
        >
          Cadastre uma <span style={{ color: "var(--button-bg, #ff6600)" }}>Conta</span>
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              className="border p-2 rounded-md"
              style={{ width: "100%" }}
              required
              minLength={3}
            />
          </div>

          <div>
            <input
              type="text"
              name="nascimento"
              placeholder="Data de nascimento"
              value={formData.nascimento}
              onChange={handleChange}
              className="border p-2 rounded-md"
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded-md col-span-1"
              style={{ width: "100%" }}
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="cpf"
              placeholder="Digite seu CPF"
              value={formData.cpf}
              onChange={handleChange}
              className="border p-2 rounded-md col-span-1"
              style={{ width: "100%" }}
              required
              pattern="\d{11}"
            />
          </div>

          <div>
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              className="border p-2 rounded-md"
              style={{ width: "100%" }}
              required
              minLength={6}
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmarSenha"
              placeholder="Confirme sua senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className="border p-2 rounded-md"
              style={{ width: "100%" }}
              required
            />
          </div>
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


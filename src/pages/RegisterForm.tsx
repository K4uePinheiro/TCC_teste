import { FcGoogle } from "react-icons/fc";
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "../components/RegisterForm.css";
import { useAuth } from "../context/AuthContext"; // ✅ usa o mesmo AuthContext

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

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordAnimating, setPasswordAnimating] = useState(false);
  const [confirmPasswordAnimating, setConfirmPasswordAnimating] = useState(false);

  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth(); // ✅ usa o mesmo método do login

  const togglePassword = () => {
    setPasswordAnimating(true);
    setTimeout(() => {
      setShowPassword(!showPassword);
      setPasswordAnimating(false);
    }, 150);
  };

  const toggleConfirmPassword = () => {
    setConfirmPasswordAnimating(true);
    setTimeout(() => {
      setShowConfirmPassword(!showConfirmPassword);
      setConfirmPasswordAnimating(false);
    }, 150);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const body = document.body;
    if (!body.classList.contains("dark-mode") && storedTheme === "dark") {
      body.classList.add("dark-mode");
    } else if (body.classList.contains("dark-mode") && storedTheme !== "dark") {
      body.classList.remove("dark-mode");
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (name === "nascimento") {
      const numbersOnly = value.replace(/\D/g, "");
      if (numbersOnly.length <= 2) processedValue = numbersOnly;
      else if (numbersOnly.length <= 4)
        processedValue = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
      else
        processedValue = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(
          2,
          4
        )}/${numbersOnly.slice(4, 8)}`;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }));
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    if (formData.nome.length < 3) return setError("O nome deve ter pelo menos 3 caracteres."), false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return setError("Digite um email válido."), false;
    if (formData.cpf.length !== 11) return setError("O CPF deve ter 11 dígitos."), false;
    if (formData.senha.length < 6) return setError("A senha deve ter pelo menos 6 caracteres."), false;
    if (formData.senha !== formData.confirmarSenha)
      return setError("As senhas não coincidem."), false;
    if (!formData.aceitarTermos)
      return setError("Você deve aceitar os termos para criar a conta."), false;
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          password: formData.senha,
          cpf: formData.cpf,
          phone: "",
          birthDate: formData.nascimento,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar conta.");
      }

      setSuccess("Conta criada com sucesso!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
    }
  };

  // ✅ botão de login com Google igual ao LoginForm
  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle(); // usa o mesmo método Firebase
      navigate("/account");
    } catch (err) {
      console.error("Erro no login com Google:", err);
      setError("Erro ao criar conta com o Google. Tente novamente.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">
          Cadastre uma <span className="register-title-highlight">Conta</span>
        </h2>

        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}

        <div className="register-grid">
          {/* campos padrão */}
          <div className="register-field">
            <input
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>
          <div className="register-field">
            <input
              type="text"
              name="nascimento"
              placeholder="DD/MM/AAAA"
              value={formData.nascimento}
              onChange={handleChange}
              className="register-input"
              maxLength={10}
            />
          </div>
          <div className="register-field">
            <input
              type="email"
              name="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>
          <div className="register-field">
            <input
              type="text"
              name="cpf"
              placeholder="Digite seu CPF"
              value={formData.cpf}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          <div className="register-field">
            <input
              type={showPassword ? "text" : "password"}
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
              className="register-input"
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              className={`password-toggle-btn ${passwordAnimating ? "animating" : ""}`}
            >
              {showPassword ? <img src="/olhos2.png" alt="Show password" /> : <img src="/olhos1.png" alt="Show password" />}
            </button>
          </div>

          <div className="register-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmarSenha"
              placeholder="Confirme sua senha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className="register-input"
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPassword}
              className={`confirm-password-toggle-btn ${
                confirmPasswordAnimating ? "animating" : ""
              }`}
            >
              {showPassword ? <img src="/olhos2.png" alt="Show password" /> : <img src="/olhos1.png" alt="Show password" />}
            </button>
          </div>
        </div>

        {/* Divider + Google */}
        <div className="register-divider">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">Continue com</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          type="button"
          className="googlee-btn"
          onClick={handleGoogleRegister}
        >
           <FcGoogle size={24} />Criar conta com Google
        </button>

        <div className="register-checkboxes">
          <label className="register-checkbox-label">
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

          <label className="register-checkbox-label">
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
          className={`register-submit-btn ${
            formData.aceitarTermos ? "enabled" : "disabled"
          }`}
        >
          Criar Conta
        </button>
      </form>
    </div>
  );
}

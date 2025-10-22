import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "../components/RegisterForm.css";
import { config } from "../config";

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
  const [, setErrors] = useState({ email: "", senha: "", auth: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordAnimating, setPasswordAnimating] = useState(false);
  const [confirmPasswordAnimating, setConfirmPasswordAnimating] = useState(false);

  const navigate = useNavigate();

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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    let processedValue = value;
    
    // Formatação automática da data de nascimento
    if (name === "nascimento") {
      // Remove caracteres não numéricos
      const numbersOnly = value.replace(/\D/g, '');
      
      // Adiciona barras automaticamente enquanto digita
      if (numbersOnly.length <= 2) {
        processedValue = numbersOnly;
      } else if (numbersOnly.length <= 4) {
        processedValue = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
      } else {
        processedValue = `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4, 8)}`;
      }
      
      // Converte para formato americano quando completo (DD/MM/AAAA -> AAAA-MM-DD)
      if (processedValue.length === 10) {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = processedValue.match(dateRegex);
        if (match) {
          const [, day, month, year] = match;
          // Armazena no formato americano para envio à API
          const americanFormat = `${year}-${month}-${day}`;
          setFormData((prev) => ({
            ...prev,
            [name]: americanFormat,
          }));
          setError(null);
          setSuccess(null);
          return;
        }
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }));
    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    if (formData.nome.length < 3) {
      setError("O nome deve ter pelo menos 3 caracteres.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Digite um email válido.");
      return false;
    }
    if (formData.cpf.length !== 11) {
      setError("O CPF deve ter 11 dígitos.");
      return false;
    }
    if (formData.senha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (formData.senha !== formData.confirmarSenha) {
      setError("As senhas não coincidem.");
      return false;
    }
    if (!formData.aceitarTermos) {
      setError("Você deve aceitar os termos para criar a conta.");
      return false;
    }
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

  // ✅ LOGIN COM GOOGLE
  const handleGoogleSuccess = (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (!token) {
      console.error("Token do Google não encontrado!");
      return;
    }

    const googleUser: any = jwtDecode(token);

    // Simula salvar no banco/localStorage
    localStorage.setItem("user", JSON.stringify(googleUser));

    console.log("Usuário logado com Google:", googleUser);

    // ✅ Redireciona para a página da conta
    navigate("/account");
  };

  const handleGoogleError = () => {
    console.error("Erro no login com Google");
    setErrors((prev) => ({
      ...prev,
      auth: "Erro ao fazer login com Google. Tente novamente.",
    }));
  };

  return (
    <div className="register-container">
      <form
        onSubmit={handleSubmit}
        className="register-form"
      >
        <h2 className="register-title">
          Cadastre uma{" "}
          <span className="register-title-highlight">Conta</span>
        </h2>

        {error && <div className="register-error">{error}</div>}
        {success && (
          <div className="register-success">{success}</div>
        )}

        <div className="register-grid">
          <div className="register-field">
            <input
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              className="register-input"
              required
              minLength={3}
            />
          </div>
          <div className="register-field">
            <input
              type="text"
              name="nascimento"
              placeholder="DD/MM/AAAA"
              value={formData.nascimento.includes('-') ? 
                formData.nascimento.split('-').reverse().join('/') : 
                formData.nascimento}
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
              pattern="\d{11}"
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
              minLength={6}
            />
            <button
              type="button"
              onClick={togglePassword}
              className={`password-toggle-btn ${passwordAnimating ? 'animating' : ''}`}
            >
              <span 
                className={`password-toggle-icon ${showPassword ? 'showing' : ''} ${passwordAnimating ? 'animating' : ''}`}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
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
              className={`confirm-password-toggle-btn ${confirmPasswordAnimating ? 'animating' : ''}`}
            >
              <span 
                className={`confirm-password-toggle-icon ${showConfirmPassword ? 'showing' : ''} ${confirmPasswordAnimating ? 'animating' : ''}`}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
            </button>
          </div>
        </div>

        <div className="register-divider">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">Continue com</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <GoogleOAuthProvider clientId={config.googleClientId}>
          <div className="google-container">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </GoogleOAuthProvider>

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
          className={`register-submit-btn ${formData.aceitarTermos ? 'enabled' : 'disabled'}`}
        >
          Criar Conta
        </button>
      </form>
    </div>
  );
}

import { useState } from "react"; 
import type { ChangeEvent, FormEvent, FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import "./login.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [errors, setErrors] = useState({ email: "", senha: "", auth: "" });

  const { login } = useAuth();
  const navigate = useNavigate();

  // ✅ validação simples de e-mail e senha
  const validateForm = () => {
    const newErrors = { email: "", senha: "", auth: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Digite um email válido.";
    }

    if (senha.trim() === "") {
      newErrors.senha = "A senha não pode estar vazia.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // ✅ login tradicional com verificação de sucesso
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const success = login(email, senha);
      if (success) {
        navigate("/account");
      } else {
        setErrors((prev) => ({
          ...prev,
          auth: "Email ou senha incorretos.",
        }));
      }
    }
  };

  // ✅ login com Google integrado ao AuthContext
  const handleGoogleSuccess = (credentialResponse: any) => {
    const token = credentialResponse.credential;
    if (!token) {
      console.error("Token do Google não encontrado!");
      return;
    }

    const googleUser: any = jwtDecode(token);

    const userData = {
      sub: googleUser.sub,
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
      email_verified: googleUser.email_verified,
    };

    const success = login(userData);
    if (success) navigate("/account");
  };

  const handleGoogleError = () => {
    console.error("Erro no login com Google");
    setErrors((prev) => ({
      ...prev,
      auth: "Erro ao fazer login com Google. Tente novamente.",
    }));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: "", auth: "" }));
  };

  const handleSenhaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value);
    setErrors((prev) => ({ ...prev, senha: "", auth: "" }));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Lado esquerdo */}
        <div className="login-form">
          <h2>
            Acesse sua <span className="highlight">Conta</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Digite seu Email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Digite sua senha:"
                value={senha}
                onChange={handleSenhaChange}
                required
              />
              {errors.senha && <p className="error-message">{errors.senha}</p>}
            </div>

            {errors.auth && <p className="error-message auth-error">{errors.auth}</p>}

            <button type="submit" className="btn-login">
              Entrar
            </button>
          </form>

          <p className="forgot-password">
            Esqueceu sua Senha? <a href="#">Clique aqui.</a>
          </p>

          <div className="divider">
            <span>Continuar com</span>
          </div>

          {/* Botão de login com Google */}
          <GoogleOAuthProvider clientId="587997109351-ro6laoog3jm33rfc6h6rmsl40mm8m90e.apps.googleusercontent.com">
            <div className="googlebtn">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </div>
          </GoogleOAuthProvider>

          <p className="terms text-sm">
            <a href="#" className="text-orange-500">
              Termos de Uso
            </a>{" "}
            |{" "}
            <a href="#" className="text-orange-500">
              Política de privacidade
            </a>
          </p>
        </div>

        {/* Lado direito */}
        <div className="login-banner">
          <div className="banner-content">
            <h2>
              Não Possui <span>Conta?</span>
            </h2>
            <Link to="/cadastro">
              <button className="btn-cadastrar">CADASTRAR-SE</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

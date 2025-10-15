import { useState } from "react"; 
import type { ChangeEvent, FormEvent, FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "/src/pages/login.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [errors, setErrors] = useState({ email: "", senha: "" });

  const {login} = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", senha: "" };

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      const success = login(email, senha);
      if (success) {
        navigate("/account"); // Redireciona para o dashboard após login bem-sucedido
    } else {
      setErrors((prev) => ({
        ...prev,
        auth: "Email ou senha incorretos.Tente novamente.",
      }));
    }
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handleSenhaChange = (e: ChangeEvent<HTMLInputElement>) =>
    setSenha(e.target.value);

  return (
    <div className="login-container">
      <div className="login-box">
        {/* lado esquerdo */}
        <div className="login-form">
          <h2>
            Acesse sua <span className="highlight">Conta</span>
          </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Digite seu email:"
                value={email}
                onChange={handleEmailChange}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Digite sua senha:"
                value={senha}
                onChange={handleSenhaChange}
                required
              />
              {errors.senha && <p className="text-red-500 text-sm">{errors.senha}</p>}
            </div>

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

          {/* Botões de login social */}
        <GoogleOAuthProvider
          clientId="587997109351-ro6laoog3jm33rfc6h6rmsl40mm8m90e.apps.googleusercontent.com">
          <div className="googlebtn">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const token = credentialResponse.credential;
                if (!token) {
                  console.error("Token do Google não encontrado!");
                  return;
                }

                const user = jwtDecode(token);
                console.log("Usuário:", user);
              }}
              onError={() => {
                console.error("Erro no login com Google");
              }}
            />
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

        {/* lado direito */}
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
}

export default LoginForm;

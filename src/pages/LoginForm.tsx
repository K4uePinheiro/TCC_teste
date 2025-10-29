import { useState, type ChangeEvent, type FormEvent, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css";
import { FcGoogle } from "react-icons/fc";

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [errors, setErrors] = useState({ email: "", senha: "", auth: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordAnimating, setPasswordAnimating] = useState(false);

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const togglePassword = () => {
    setPasswordAnimating(true);
    setTimeout(() => {
      setShowPassword(!showPassword);
      setPasswordAnimating(false);
    }, 150);
  };

  const validateForm = () => {
    const newErrors = { email: "", senha: "", auth: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) newErrors.email = "Digite um email válido.";
    if (senha.trim() === "") newErrors.senha = "A senha não pode estar vazia.";

    setErrors(newErrors);
    return Object.values(newErrors).every(err => err === "");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const success = login(email, senha);
    if (success) {
      navigate("/account");
    } else {
      setErrors(prev => ({ ...prev, auth: "Email ou senha incorretos" }));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/account");
    } catch (err) {
      console.error(err);
      setErrors(prev => ({ ...prev, auth: "Erro ao fazer login com Google" }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Formulário */}
        <div className="login-form">
          <h2>Acesse sua <span className="highlight">Conta</span></h2>

          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Digite seu Email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

            <div className="password-field-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
                required
                style={{ paddingRight: "40px" }}
              />
              <button
                type="button"
                onClick={togglePassword}
                className={`password-toggle-btn ${passwordAnimating ? 'animating' : ''}`}
              >
                {showPassword ? <img src="../public/olhos2.png" alt="Show password" /> : <img src="../public/olhos1.png" alt="Show password" />}
              </button>
              {errors.senha && <p className="error-message">{errors.senha}</p>}
            </div>

            {errors.auth && <p className="error-message auth-error">{errors.auth}</p>}

            <button type="submit" className="btn-login">Entrar</button>
          </form>

          <div className="divider"><span>Continuar com</span></div>

          <button type="button" className="google-btn" onClick={handleGoogleLogin}>
             <FcGoogle size={24} />Entrar com Google
          </button>

          <p className="forgot-password">
            Esqueceu sua Senha? <a href="#">Clique aqui.</a>
          </p>

          <p className="terms text-sm">
            <a href="#" className="text-orange-500">Termos de Uso</a> | 
            <a href="/src/pdfs/Política de Privacidade.pdf" className="text-orange-500"> Política de privacidade</a>
          </p>
        </div>

        {/* Banner */}
        <div className="login-banner">
          <div className="banner-content">
            <h2>Não Possui <span>Conta?</span></h2>
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

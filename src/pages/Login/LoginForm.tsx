import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type FC,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./login.css";
import { FcGoogle } from "react-icons/fc";

const LoginForm: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [errors, setErrors] = useState({ email: "", senha: "", auth: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { email: "", senha: "", auth: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email))
      newErrors.email = "Digite um email válido.";

    if (senha.trim() === "")
      newErrors.senha = "A senha não pode estar vazia.";

    setErrors(newErrors);
    return Object.values(newErrors).every((err) => err === "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const success = await login(email, senha);
      if (success) navigate("/account");
      else setErrors((prev) => ({ ...prev, auth: "Email ou senha incorretos" }));
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({ ...prev, auth: "Erro ao fazer login" }));
    }

    setLoading(false);
  };

  // const handleGoogleLogin = async () => {
  //   setLoading(true);
  //   try {
  //     await loginWithGoogle();
  //     navigate("/account");
  //   } catch (err) {
  //     console.error(err);
  //     setErrors((prev) => ({
  //       ...prev,
  //       auth: "Erro ao fazer login com Google",
  //     }));
  //   }
  //   setLoading(false);
  // };

  return (
    <div className="login-container">
      <div className="login-box">

        {/* FORM */}
        <div className="login-form">
          <h2>
            Acesse sua <span className="highlight">Conta</span>
          </h2>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Digite seu Email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: "", auth: "" }));
                }}
                required
              />
              {errors.email && (
                <p className="error-message">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="password-field-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSenha(e.target.value);
                  setErrors((prev) => ({ ...prev, senha: "", auth: "" }));
                }}
                required
                style={{ paddingRight: "40px" }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="password-toggle-btn"
              >
                {showPassword ? (
                  <img src="/olhos2.png" alt="show" />
                ) : (
                  <img src="/olhos1.png" alt="hide" />
                )}
              </button>

              {errors.senha && (
                <p className="error-message">{errors.senha}</p>
              )}
            </div>

            {/* AUTH ERROR */}
            {errors.auth && (
              <p className="error-message auth-error">{errors.auth}</p>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="btn-login"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          <p className="forgot-password">
            Esqueceu sua Senha? <a href="#">Clique aqui.</a>
          </p>

          <div className="divider">
            <span>Continuar com</span>
          </div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            className="google-btn"
            // onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle size={24} />
            {loading ? "Carregando..." : "Entrar com Google"}
          </button>


          {/* LINKS AJUSTADOS */}
          <p className="terms text-sm">
            <a href="#" className="text-orange-500">Termos de Uso</a> |
            <a href="/Política de Privacidade.pdf" className="text-orange-500">
              {" "}
              Política de Privacidade
            </a>
          </p>
        </div>

        {/* BANNER */}
        <div className="login-banner">
          <div className="banner-content">
            <img src="/ikommerce.png" alt="Logo" className="logo" />
           
            <div className="cimabanner">
              <h2>
                Torne-se um Fornecedor do nosso site.
              </h2>
              <Link to="/supplier-register">
                <button className="btn-cadastrarsu">Cadastrar uma conta</button>
              </Link>
            </div>

            <div className="baixobanner">
              <h2>
                Não Possui Conta?
              </h2>
              <Link to="/cadastro">
                <button className="btn-cadastrar">CADASTRE-SE</button>
              </Link>
            </div>


          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;

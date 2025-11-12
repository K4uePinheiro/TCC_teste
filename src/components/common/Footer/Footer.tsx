import type { FC } from "react";
import { Facebook, Instagram, Linkedin, Youtube, Music2 } from "lucide-react";
import "./Footer.css"
import { Link } from "react-router-dom";


const Footer: FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/*logo */}
                <Link to="/">
                    <div className="logo">
                        <img src="/iko.png" alt="Logo" className="logo" />
                    </div>
                </Link>

                {/*sobre nos*/}
                <div>
                    <h2 className="footer-title">Sobre nós</h2>
                    <ul className="footer-list">
                        <li><a href="https://ikommercylanding.netlify.app/" target="_blank">Quem Somos</a></li>
                        <li><a href="/PoliticaDevolucao">Política de Devolução</a></li>
                        <li><Link to="/TermoUso">Termos de Uso</Link></li>
                        <li><Link to="/PoliticaPrivacidade">Política de Privacidade</Link></li>
                    </ul>
                </div>

                {/*Cliente*/}
                <div>
                    <h2 className="footer-title">Cliente</h2>
                    <ul className="footer-list">
                        <li><Link to="/cadastro">Cadastre-se</Link></li>
                        <li><Link to="/login">Faça Login</Link></li>
                        <li><Link to="/favorites">Favoritos</Link></li>
                        <li><Link to="/support">Atendimento</Link></li>
                    </ul>
                </div>

                
                {/* Formas de Pagamento e Segurança */}
                <div className="payment-security">
                    <div>
                        <h2 className="footer-title">Formas de Pagamentos</h2>
                        <div className="payment-icons">
                            <img src="/boleto.png" alt="Boleto" />
                            <img src="/pix.png" alt="Pix" />
                            <img src="/visa.png" alt="Visa" />
                            <img src="/mastercard.png" alt="MasterCard" />
                        </div>
                    </div>


                    <div>
                        <h2 className="footer-title">Segurança</h2>
                        <div className="security-icons">
                            <Link to="forma-pagamento"><img src="/google.png" alt="google" /></Link>
                        </div>
                    </div>
                </div>
            </div>


            {/* Bottom bar */}
            <div className="footer-bottom">
                <p>©2025 Ikommercy. Todos os direitos reservados</p>
                <div className="social-icons">
                    <a href="#"><Instagram size={18} /></a>
                    <a href="#"><Facebook size={18} /></a>
                    <a href="#"><Music2 size={18} /></a>
                    <a href="#"><Linkedin size={18} /></a>
                    <a href="#"><Youtube size={18} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
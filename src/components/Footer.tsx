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
                        <li><Link to="/quem-somos">Quem Somos</Link></li>
                        <li><Link to="/politica-priv">Política de privacidade</Link></li>
                        <li><Link to="/termos">Termos de uso.</Link></li>
                        <li><Link to="/politica-co">Políticas de Cookies</Link></li>
                    </ul>
                </div>

                {/*Cliente*/}
                <div>
                    <h2 className="footer-title">Cliente</h2>
                    <ul className="footer-list">
                        <li><Link to="/cadastro">Cadastre-se</Link></li>
                        <li><Link to="/login">Faça Login</Link></li>
                        <li><Link to="/favs">Favoritos</Link></li>
                        <li><Link to="/atendimento">Atendimento</Link></li>
                    </ul>
                </div>

                {/*fornecedores8*/}
                <div>
                    <h2 className="footer-title">Fornecedores</h2>
                    <ul className="footer-list">
                        <li><Link to="/fornecedor/fornecedor1">fornecedor1</Link></li>
                        <li><Link to="/fornecedor/fornecedor2">fornecedor2</Link></li>
                        <li><Link to="/fornecedor/fornecedor3">fornecedor3</Link></li>
                        <li><Link to="/fornecedor/fornecedor4">fornecedor4</Link></li>
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
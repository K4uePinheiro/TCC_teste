import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./pagamento.css";


export default function Pagamento() {
    const [ativo, setAtivo] = useState("");
    const location = useLocation();
    const cartTotal = Number(location.state?.cartTotal);
    const address = location.state?.address;

    const navigate = useNavigate();

    const handleEditAddress = () => {
        navigate("/address", {
            state: {
                cartTotal,
                editAddress: true // flag para abrir ConfirmScreen já com o endereço
            }
        });
    };



    return (
        <>
            <div className="conteiner">
                {/* MÉTODOS DE PAGAMENTO */}
                <div className="metodos">
                    <div
                        className={`cartao metodo ${ativo === "cartao" ? "ativo" : ""}`}
                        onClick={() => setAtivo("cartao")}
                    >
                        <div className="cima">
                            <img
                                src="./mercado_pago.svg"
                                alt="Logo mercado pago"
                            />
                        </div>

                        <div className="baixo">
                            <h1>Pagar com cartão</h1>
                            <p>12x de {(cartTotal / 12).toFixed(2)} sem juros!</p>
                        </div>
                    </div>

                    <div
                        className={`pix metodo ${ativo === "pix" ? "ativo" : ""}`}
                        onClick={() => setAtivo("pix")}
                    >
                        <div className="cima">
                            <img src="./pix.svg" alt="Logo pix" />
                        </div>

                        <div className="baixo">
                            <h1>Pagar com pix</h1>
                            <p>R$ {(cartTotal * 0.9).toFixed(2)} à vista!</p>
                        </div>
                    </div>
                </div>

                {/* RESUMO DO PEDIDO */}
                <div className="resumo">
                    <div className="card-pagamento resumo_frete">
                        <div className="info">
                            <p>
                                <strong>Frete</strong> <span>R$ 32,90</span>
                            </p>
                        </div>
                        <p className="total">
                            Total <span>R$ {(cartTotal).toFixed(2)}</span>
                        </p>
                        <button className="btn-laranja">Finalizar pedido</button>
                    </div>

                    <div className="card-pagamento endereco">
                        <p><strong>{address?.nome}</strong></p>
                        <p>{address?.rua}, {address?.numero}</p>
                        <p>{address?.bairro} - {address?.cidade}/{address?.estado}</p>
                        <p>CEP: {address?.cep}</p>
                        <button className="btn-laranja" onClick={handleEditAddress}>Editar Endereço</button >
                    </div>
                </div>
            </div>
        </>
    );
}
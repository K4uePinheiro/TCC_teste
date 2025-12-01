// import React, { useState, useEffect } from "react";
// // Importa o novo CSS
// import "./ProfilePage.css"; 
// // Importações necessárias para a lógica de CRUD
// import api from "../../../services/api"; 
// import { useAuth } from "../../../context/AuthContext"; 
// import { useNavigate } from "react-router-dom"; 

// // Endpoint para o CRUD do usuário logado
// const USER_ENDPOINT = '/user'; 

// // Interface para os dados do formulário
// interface FormData {
//     nome: string;
//     dataNascimento: string;
//     cpf: string;
//     email: string;
//     senha: string; // Senha atual ou nova
// }

// // Interface para os claims do token (para preencher o formulário)
// interface UserClaims {
//     id: number;
//     name: string;
//     email: string;
//     cpf: string;
//     birthDate: string;
//     // Adicione outros claims que seu token possui
// }

// // Função para limpar caracteres não-numéricos (para CPF)
// const cleanNonNumeric = (value: string): string => value.replace(/\D/g, "");

// function ProfilePage(): React.ReactElement {
//     // Assumindo que useAuth fornece o user (claims do token) e a função logout
//     const { user, logout } = useAuth(); 
//     const navigate = useNavigate();

//     // Estado para abas e para mostrar/esconder senha
//     const [activeTab, setActiveTab] = useState<string>("cadastro");
//     const [showPassword, setShowPassword] = useState<boolean>(false);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

//     // Estado local para os dados do formulário
//     const [formData, setFormData] = useState<FormData>({
//         nome: "",
//         dataNascimento: "",
//         cpf: "",
//         email: "",
//         senha: "", 
//     });

//     // Efeito para preencher o formulário com os dados do token
//     useEffect(() => {
//         if (user) {
//             const userTyped = user as unknown as UserClaims; 
//             setFormData({
//                 nome: userTyped.name || "",
//                 dataNascimento: userTyped.birthDate || "",
//                 cpf: userTyped.cpf || "",
//                 email: userTyped.email || "",
//                 senha: "",
//             });
//         }
//     }, [user]);

//     // Função para lidar com a mudança nos inputs
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { id, value } = e.target;
//         setFormData(prev => ({ ...prev, [id]: value }));
//     };

//     // Função para formatar o CPF (mantida a lógica original)
//     const formatCpf = (value: string): string => {
//         let cleaned = cleanNonNumeric(value);
//         if (cleaned.length <= 11) {
//             cleaned = cleaned.replace(/(\d{3})(\d)/, "$1.$2");
//             cleaned = cleaned.replace(/(\d{3})(\d)/, "$1.$2");
//             cleaned = cleaned.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
//         }
//         return cleaned;
//     };

//     // Efeito para aplicar a máscara de CPF (adaptado para o estado)
//     useEffect(() => {
//         const cpfInput = document.getElementById("cpf") as HTMLInputElement | null;
//         if (cpfInput) {
//             const handleInput = (e: Event) => {
//                 const target = e.target as HTMLInputElement;
//                 const formattedValue = formatCpf(target.value);
//                 target.value = formattedValue;
//                 setFormData(prev => ({ ...prev, cpf: formattedValue }));
//             };
//             cpfInput.addEventListener("input", handleInput);
//             return () => cpfInput.removeEventListener("input", handleInput);
//         }
//     }, []);

//     // Função para atualizar os dados do usuário (PUT/PATCH)
//     const handleUpdate = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setMessage(null);
//         setLoading(true);

//         const updatePayload = {
//             name: formData.nome,
//             email: formData.email,
//             ...(formData.senha && { password: formData.senha }), 
//             cpf: cleanNonNumeric(formData.cpf), 
//             birthDate: formData.dataNascimento,
//         };
        
//         console.log("PAYLOAD ENVIADO PARA /user (PUT):", updatePayload);

//         try {
//             await api.put(USER_ENDPOINT, updatePayload); 
            
//             setMessage({ type: 'success', text: 'Dados atualizados com sucesso!' });

//         } catch (error) {
//             console.error("Erro ao atualizar dados:", error);
//             const errorMessage = (error as any).response?.data?.message || 'Falha ao atualizar dados. Verifique as informações.';
//             setMessage({ type: 'error', text: errorMessage });
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Função para deletar a conta (DELETE)
//     const handleDelete = async () => {
//         if (!window.confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
//             return;
//         }

//         setMessage(null);
//         setLoading(true);

//         try {
//             await api.delete(USER_ENDPOINT); 
            
//             logout(); 
//             navigate('/'); 

//         } catch (error) {
//             console.error("Erro ao excluir conta:", error);
//             const errorMessage = (error as any).response?.data?.message || 'Falha ao excluir conta. Tente novamente mais tarde.';
//             setMessage({ type: 'error', text: errorMessage });
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleTabChange = (tabName: string) => {
//         setActiveTab(tabName);
//     };

//     // Função para o botão Voltar
//     const handleGoBack = () => {
//         navigate(-1); // Volta para a página anterior
//     };

//     if (!user) {
//         return (
//             <div className="profile-page-wrapper">
//                 <div className="container">
//                     <h2>Você precisa estar logado para acessar esta página.</h2>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         // Adicionado o wrapper principal
//         <div className="profile-page-wrapper">
//             <div className="container">
//                 {/* Botão Voltar */}
//                 <div className="back-button" onClick={handleGoBack}>
//                     <span style={{ fontSize: '18px' }}>&#x2190;</span> Voltar
//                 </div>

//                 <div className="tabs">
//                     {/* Aba Cadastro */}
//                     <div
//                         className={`tab ${activeTab === "cadastro" ? "active" : ""}`}
//                         onClick={() => handleTabChange("cadastro")}
//                         data-tab="cadastro"
//                     >
//                         Cadastro
//                     </div>
//                     {/* Aba Histórico */}
//                     <div
//                         className={`tab ${activeTab === "historico" ? "active" : ""}`}
//                         onClick={() => handleTabChange("historico")}
//                         data-tab="historico"
//                     >
//                         Histórico de compra
//                     </div>
//                     {/* Aba Seus Tickets (Novo) */}
//                     <div
//                         className={`tab ${activeTab === "tickets" ? "active" : ""}`}
//                         onClick={() => handleTabChange("tickets")}
//                         data-tab="tickets"
//                     >
//                         Seus Tickets
//                     </div>
//                     {/* Aba Endereços */}
//                     <div
//                         className={`tab ${activeTab === "enderecos" ? "active" : ""}`}
//                         onClick={() => handleTabChange("enderecos")}
//                         data-tab="enderecos"
//                     >
//                         Endereços
//                     </div>
//                 </div>

//                 {/* Conteúdo das Abas */}

//                 {/* Cadastro */}
//                 <div
//                     className={`tab-content ${activeTab === "cadastro" ? "active" : ""}`}
//                     id="cadastro"
//                 >
//                     <form onSubmit={handleUpdate}> 
//                         {message && (
//                             <p style={{ color: message.type === 'success' ? 'green' : 'red', fontWeight: 'bold', marginBottom: '15px' }}>
//                                 {message.text}
//                             </p>
//                         )}
//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label htmlFor="nome">Nome Completo:</label>
//                                 <input 
//                                     type="text" 
//                                     id="nome" 
//                                     value={formData.nome} 
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label htmlFor="dataNascimento">Data de Nascimento:</label>
//                                 <input
//                                     type="date"
//                                     id="dataNascimento"
//                                     value={formData.dataNascimento} 
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group">
//                                 <label htmlFor="cpf">CPF:</label>
//                                 <input
//                                     type="text"
//                                     id="cpf"
//                                     value={formData.cpf} 
//                                     onChange={handleInputChange}
//                                     maxLength={14}
//                                     required
//                                 />
//                             </div>
//                             <div className="form-group">
//                                 <label htmlFor="email">Email:</label>
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     value={formData.email} 
//                                     onChange={handleInputChange}
//                                     required
//                                 />
//                                 <span className="link-text">Alterar email</span>
//                             </div>
//                         </div>

//                         <div className="form-row">
//                             <div className="form-group full-width">
//                                 <label htmlFor="senha">Senha:</label>
//                                 <div className="password-input">
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         id="senha"
//                                         placeholder="Digite sua senha"
//                                         value={formData.senha}
//                                         onChange={handleInputChange}
//                                     />
//                                     <span
//                                         className="password-toggle"
//                                         onClick={() => setShowPassword(!showPassword)}
//                                     >
//                                         {showPassword ? "🙈" : "🔒"}
//                                     </span>
//                                 </div>
//                                 <span className="link-text">Esqueceu sua senha?</span>
//                             </div>
//                         </div>

//                         <div className="button-group">
//                             <button
//                                 type="button"
//                                 className="btn btn-secondary btn-delete" // Usando a nova classe de estilo
//                                 onClick={handleDelete} 
//                                 disabled={loading}
//                             >
//                                 Excluir conta
//                             </button>
//                             <button type="submit" className="btn btn-primary" disabled={loading}>
//                                 {loading ? 'Confirmando...' : 'Confirmar'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>

//                 {/* Histórico de Compra */}
//                 <div
//                     className={`tab-content ${activeTab === "historico" ? "active" : ""}`}
//                     id="historico"
//                 >
//                     {/* Conteúdo do Histórico de Compra (mantido) */}
//                     <p>Conteúdo do Histórico de Compra</p>
//                 </div>

//                 {/* Seus Tickets */}
//                 <div
//                     className={`tab-content ${activeTab === "tickets" ? "active" : ""}`}
//                     id="tickets"
//                 >
//                     <p>Conteúdo de Seus Tickets</p>
//                 </div>

//                 {/* Endereços */}
//                 <div
//                     className={`tab-content ${activeTab === "enderecos" ? "active" : ""}`}
//                     id="enderecos"
//                 >
//                     {/* Conteúdo de Endereços (mantido) */}
//                     <p>Conteúdo de Endereços</p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ProfilePage;
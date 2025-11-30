import React, { useState } from 'react';
import './SupplierRegister.css';

// CORREÇÃO: Acessando a variável de ambiente VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL; 
const ENDPOINT = '/suppliers';

// Definição de tipos para o estado do formulário
interface FormData {
    // Dados do Usuário (User)
    fullName: string;
    birthDate: string;
    email: string;
    cpf: string;
    password: string;
    userPhone: string;
    // Dados do Fornecedor (Supplier)
    companyName: string;
    cnpj: string;
    companyEmail: string;
    supplierPhone: string;
    commissionRate: string;
    bankDataUrl: string;
    // Termos
    acceptTerms: boolean;
    acceptNewsletter: boolean;
}

const initialFormData: FormData = {
    fullName: '',
    birthDate: '',
    email: '',
    cpf: '',
    password: '',
    userPhone: '',
    companyName: '',
    cnpj: '',
    companyEmail: '',
    supplierPhone: '',
    commissionRate: '',
    bankDataUrl: '',
    acceptTerms: false,
    acceptNewsletter: false
};

/**
 * Função utilitária para limpar e formatar o número de telefone no formato internacional.
 * 1. Remove todos os caracteres não-dígitos.
 * 2. Adiciona o prefixo '+55' se o número limpo for um número brasileiro (10 ou 11 dígitos) sem o 55.
 * 3. Adiciona o '+' no início do número final.
 * @param phone O número de telefone bruto do formulário.
 * @returns O número de telefone formatado (ex: +5511999998888).
 */
const cleanAndFormatPhoneNumber = (phone: string): string => {
    // 1. Remove todos os caracteres não-dígitos
    let cleaned = phone.replace(/\D/g, '');

    // 2. Lógica para adicionar o '55'
    // Se o número tiver 10 ou 11 dígitos (DDD + número) e não começar com '55', adiciona '55'.
    if (cleaned.length >= 10 && cleaned.length <= 11 && !cleaned.startsWith('55')) {
        cleaned = '55' + cleaned;
    }
    
    // 3. Adiciona o '+' no início, conforme o formato da API
    return '+' + cleaned;
};

export default function SupplierRegister() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const buildPayload = (data: FormData) => {
        // Limpa e formata os números de telefone antes de montar o payload
        const cleanUserPhone = cleanAndFormatPhoneNumber(data.userPhone);
        const cleanSupplierPhone = cleanAndFormatPhoneNumber(data.supplierPhone);

        // Monta o payload JSON na estrutura exata que a API espera
        return {
            supplier: {
                name: data.companyName,
                cnpj: data.cnpj,
                dbUrl: data.bankDataUrl,
                email: data.companyEmail,
                phone: cleanSupplierPhone, // Usando o telefone limpo e formatado (+55...)
                commissionRate: data.commissionRate
            },
            user: {
                name: data.fullName,
                email: data.email,
                password: data.password,
                cpf: data.cpf,
                phone: cleanUserPhone, // Usando o telefone limpo e formatado (+55...)
                birthDate: data.birthDate
            }
        };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Verificação da URL Base
        if (!API_BASE_URL) {
            setError('Erro de Configuração: A variável de ambiente VITE_API_URL não está definida ou acessível.');
            setLoading(false);
            return;
        }

        if (!formData.acceptTerms) {
            setError('Você precisa aceitar os Termos de Uso e Políticas de privacidade.');
            return;
        }

        // 2. Validação de Telefone no Frontend
        const cleanUserPhone = cleanAndFormatPhoneNumber(formData.userPhone);
        const cleanSupplierPhone = cleanAndFormatPhoneNumber(formData.supplierPhone);
        
        // O tamanho mínimo para um número brasileiro válido formatado (+55 + DDD + 8 ou 9 dígitos) é 13.
        // Ex: +5511999998888 (13 caracteres)
        const MIN_PHONE_LENGTH = 13; 

        if (cleanUserPhone.length < MIN_PHONE_LENGTH) {
            setError(`O telefone pessoal deve ter pelo menos 10 dígitos (DDD + número) para ser válido.`);
            setLoading(false); 
            return;
        }
        if (cleanSupplierPhone.length < MIN_PHONE_LENGTH) {
            setError(`O telefone da empresa deve ter pelo menos 10 dígitos (DDD + número) para ser válido.`);
            setLoading(false); 
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        const payload = buildPayload(formData);
        const fullUrl = API_BASE_URL + ENDPOINT;

        console.log('Tentando enviar POST para:', fullUrl);
        console.log('Payload com telefones limpos e formatados:', payload);

        try {
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Adicione aqui o cabeçalho de autenticação se necessário
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Registro bem-sucedido
                setSuccess(true);
                setFormData(initialFormData); // Limpa o formulário
                alert('Conta criada com sucesso! Verifique seu e-mail para confirmação.');
            } else {
                // Erro na resposta da API (incluindo 404, 400, 500, etc.)
                let errorText = `Erro ${response.status}: ${response.statusText}`;
                try {
                    const errorBody = await response.json();
                    // Tenta extrair uma mensagem de erro mais detalhada da API
                    errorText = errorBody.message || errorBody.error || JSON.stringify(errorBody);
                } catch (e) {
                    // Ignora se a resposta não for JSON
                }
                
                console.error('Falha no registro:', errorText);
                setError(`Falha ao registrar. Detalhes: ${errorText}`);
            }
        } catch (err) {
            // Erro de rede (ex: servidor offline, CORS)
            console.error('Erro de rede ou na requisição:', err);
            setError('Erro de conexão com a API. Verifique se o servidor está rodando e se há problemas de CORS.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="register-title">
                    Cadastre uma conta como <span className="highlight">Fornecedor</span>
                </h1>

                <form onSubmit={handleSubmit}> 
                    {/* Seção de Dados Pessoais */}
                    <div className="form-section">
                        <h2 className="section-title">Dados pessoais do dono:</h2>
                        <div className="form-row">
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Nome completo:"
                                className="form-input"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="date"
                                name="birthDate"
                                placeholder="Data de nascimento:"
                                className="form-input"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail (Pessoal):"
                                className="form-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="cpf"
                                placeholder="CPF:"
                                className="form-input"
                                value={formData.cpf}
                                onChange={handleChange}
                                maxLength={14}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="password"
                                name="password"
                                placeholder="Crie uma senha:"
                                className="form-input"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                name="userPhone"
                                placeholder="Telefone (Pessoal):"
                                className="form-input"
                                value={formData.userPhone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Seção de Dados Empresariais */}
                    <div className="form-section">
                        <h2 className="section-title">Dados empresariais:</h2>
                        <div className="form-row">
                            <input
                                type="text"
                                name="companyName"
                                placeholder="Nome da empresa:"
                                className="form-input"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="cnpj"
                                placeholder="CNPJ:"
                                className="form-input"
                                value={formData.cnpj}
                                onChange={handleChange}
                                maxLength={18}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="email"
                                name="companyEmail"
                                placeholder="E-mail da empresa:"
                                className="form-input"
                                value={formData.companyEmail}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="tel"
                                name="supplierPhone"
                                placeholder="Telefone (Empresa):"
                                className="form-input"
                                value={formData.supplierPhone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="text"
                                name="commissionRate"
                                placeholder="Taxa de comissão (ex: 10.00):"
                            
                                className="form-input"
                                value={formData.commissionRate}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="url"
                                name="bankDataUrl"
                                placeholder="URL do banco de dados (dbUrl):"
                                className="form-input"
                                value={formData.bankDataUrl}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Seção de Checkboxes */}
                    <div className="checkbox-section">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <span>
                                Li e estou de acordo com os{' '}
                                <a href="#" className="link">Termos de Uso</a> e{' '}
                                <a href="#" className="link">Políticas de privacidade</a>.
                            </span>
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="acceptNewsletter"
                                checked={formData.acceptNewsletter}
                                onChange={handleChange}
                                className="checkbox-input"
                            />
                            <span>Quero receber novidades e ofertas por e-mail</span>
                        </label>
                    </div>

                    {/* Mensagens de Status */}
                    {error && <p className="error-message" style={{color: 'red', marginTop: '15px', fontWeight: 'bold'}}>{error}</p>}
                    {success && <p className="success-message" style={{color: 'green', marginTop: '15px', fontWeight: 'bold'}}>Registro realizado com sucesso!</p>}

                    {/* Botão de Submissão */}
                    <button type='submit' className="submit-button" disabled={loading}>
                        {loading ? 'Criando conta...' : 'Criar conta'}
                    </button>
                </form>
            </div>
        </div >
    );
}
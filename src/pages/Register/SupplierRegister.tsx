import React, { useState } from 'react';
import './SupplierRegister.css';

export default function SupplierRegister() {
    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        email: '',
        cpf: '',
        companyName: '',
        cnpj: '',
        companyEmail: '',
        commissionRate: '',
        bankDataUrl: '',
        acceptTerms: false,
        acceptNewsletter: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = () => {
        if (!formData.acceptTerms) {
            alert('Você precisa aceitar os Termos de Uso e Políticas de privacidade');
            return;
        }
        console.log('Form submitted:', formData);
        alert('Conta criada com sucesso!');
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="register-title">
                    Cadastre uma conta como <span className="highlight">Fornecedor</span>
                </h1>

                <div>
                    <form action="post">
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
                                    placeholder="Digite seu e-mail:"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="cpf"
                                    placeholder="Digite CPF:"
                                    className="form-input"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    maxLength={14}
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Digite CNPJ:"
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
                                    type="text"
                                    name="commissionRate"
                                    placeholder="Taxa de comissão:"
                                    className="form-input"
                                    value={formData.commissionRate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <input
                                    type="url"
                                    name="bankDataUrl"
                                    placeholder="URL do banco de dados:"
                                    className="form-input full-width"
                                    value={formData.bankDataUrl}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button type='submit' onClick={handleSubmit} className="submit-button">
                                Criar conta
                            </button>
                        </div>
                    </form>


                    <div className="checkbox-section">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="checkbox-input"
                                required
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
                                required
                            />
                            <span>Quero receber novidades e ofertas por e-mail</span>
                        </label>
                    </div>
                </div>
            </div>
        </div >
    );
}
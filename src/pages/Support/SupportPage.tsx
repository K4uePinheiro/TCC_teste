import React, { useState, type ChangeEvent, type FormEvent } from "react";
import "./SupportPage.css";

interface FormData {
  nome: string;
  email: string;
  motivoContato: "duvida" | "reclamacao" | "devolucao" | "";
  numeroPedido: string;
  motivo: string;
  mensagem: string;
  fotos: FileList | null;
}

const FormAtendimento: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    motivoContato: "",
    numeroPedido: "",
    motivo: "",
    mensagem: "",
    fotos: null,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;

    // Se for input de arquivo
    if (target instanceof HTMLInputElement && target.type === "file") {
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.files,
      }));
    } else {
      // Para outros inputs e textareas
      setFormData((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbxt1JC97dpwckVHIw7iYDq-VRfwQgYvuMyO6tsDmd-166AemYrUHW2T8gFRjm-Y12YY/exec";

    const form = new FormData();
    form.append("nome", formData.nome);
    form.append("email", formData.email);
    form.append("motivo-contato", formData.motivoContato);
    form.append("numero-pedido", formData.numeroPedido);
    form.append("motivo", formData.motivo);
    form.append("mensagem", formData.mensagem);

    if (formData.fotos) {
      Array.from(formData.fotos).forEach((file) => {
        form.append("foto", file);
      });
    }

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: form,
      });

      if (response.ok) {
        alert("Formulário enviado com sucesso!");
        setFormData({
          nome: "",
          email: "",
          motivoContato: "",
          numeroPedido: "",
          motivo: "",
          mensagem: "",
          fotos: null,
        });
      } else {
        alert("Erro ao enviar. Tente novamente.");
      }
    } catch (err) {
      alert("Erro na conexão com o servidor.");
      console.error(err);
    }
  };

  const renderCampos = () => {
    switch (formData.motivoContato) {
      case "duvida":
        return (
          <div className="mensagem-box">
            <label>Por favor, descreva sua dúvida:</label>
            <textarea
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              placeholder="Escreva aqui sua dúvida..."
              required
            />
          </div>
        );

      case "reclamacao":
        return (
          <div className="mensagem-box">
            <label>Por favor, descreva sua reclamação:</label>
            <textarea
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              placeholder="Escreva aqui sua reclamação..."
              required
            />
          </div>
        );

      case "devolucao":
        return (
          <div id="motivo-devolucao">
            <label>Número do pedido:</label>
            <input
              type="text"
              name="numeroPedido"
              value={formData.numeroPedido}
              onChange={handleChange}
              placeholder="Número do seu pedido..."
              required
            />

            <label>Motivo da devolução:</label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              placeholder="Motivo da sua devolução..."
              required
            />

            <label>Anexar fotos do produto:</label>
            <input
              type="file"
              name="fotos"
              accept="image/*"
              multiple
              onChange={handleChange}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="form-support">
      <div className="form-content">
        <h2>Solicite um atendimento:</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="input-group">
              <label>Nome completo:</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>E-mail:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="radio-group">
            <p>Qual o motivo do seu contato?</p>

            <div className="radios">
              <label>
                <input
                  type="radio"
                  name="motivoContato"
                  value="duvida"
                  checked={formData.motivoContato === "duvida"}
                  onChange={handleChange}
                  required
                />
                Dúvida
              </label>

              <label>
                <input
                  type="radio"
                  name="motivoContato"
                  value="reclamacao"
                  checked={formData.motivoContato === "reclamacao"}
                  onChange={handleChange}
                  required
                />
                Reclamação
              </label>

              <label>
                <input
                  type="radio"
                  name="motivoContato"
                  value="devolucao"
                  checked={formData.motivoContato === "devolucao"}
                  onChange={handleChange}
                  required
                />
                Solicitar Devolução
              </label>
            </div>
          </div>

          {renderCampos()}

          <div className="button-container">
            <button type="submit">Enviar</button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FormAtendimento;

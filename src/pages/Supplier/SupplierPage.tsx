import React, { useState } from 'react';
import './SupplierPage.css';

const SupplierPage: React.FC = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Smartphone XYZ', price: 'R$ 2.499,00', category: 'Eletrônicos', quantity: 15, code: 'ELE001' },
    { id: 2, name: 'Notebook ABC', price: 'R$ 3.999,00', category: 'Informática', quantity: 8, code: 'INF002' },
    { id: 3, name: 'Fone Bluetooth', price: 'R$ 299,00', category: 'Acessórios', quantity: 50, code: 'ACE003' },
    { id: 4, name: 'Smart Watch', price: 'R$ 899,00', category: 'Wearables', quantity: 12, code: 'WEA004' },
    { id: 5, name: 'Mouse Gamer', price: 'R$ 199,00', category: 'Periféricos', quantity: 30, code: 'PER005' },
    { id: 6, name: 'Teclado Mecânico', price: 'R$ 599,00', category: 'Periféricos', quantity: 20, code: 'PER006' },
    { id: 7, name: 'Câmera Digital', price: 'R$ 2.199,00', category: 'Fotografia', quantity: 5, code: 'FOT007' },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product = {
        id: products.length + 1,
        name: newProduct.name,
        price: newProduct.price,
        category: newProduct.category || 'Sem categoria',
        quantity: 0,
        code: `PRD${String(products.length + 1).padStart(3, '0')}`
      };
      setProducts([...products, product]);
      setNewProduct({ name: '', price: '', description: '', category: '' });
      alert('Produto adicionado com sucesso!');
    }
  };

  const subsidiaries = [
    { name: 'João Mota', role: 'Editor Permitido' },
    { name: 'Ana Gabriel', role: 'Editor Permitido' },
    { name: 'João Teixes', role: 'Editor Permitido' },
    { name: 'Julia Mendes', role: 'Editor Permitido' }
  ];

  return (
    <div className="supplier-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">Logo</h1>
        </div>
        
        <nav className="sidebar-nav">
          <button
            onClick={() => setActiveMenu('dashboard')}
            className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveMenu('products')}
            className={`nav-item ${activeMenu === 'products' ? 'active' : ''}`}
          >
            <span className="nav-icon">📦</span>
            <span>Produtos</span>
          </button>
          
          <button
            onClick={() => setActiveMenu('add')}
            className={`nav-item ${activeMenu === 'add' ? 'active' : ''}`}
          >
            <span className="nav-icon">➕</span>
            <span>Adicionar</span>
          </button>
          
          <button
            onClick={() => setActiveMenu('subsidiaries')}
            className={`nav-item ${activeMenu === 'subsidiaries' ? 'active' : ''}`}
          >
            <span className="nav-icon">👥</span>
            <span>Contas Subsidiárias</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Visão Geral */}
        <section className="overview-section">
          <h2 className="section-title">Visão geral</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-icon">📦</span>
                <span className="stat-label">Produtos Ativos</span>
              </div>
              <div className="stat-value">128</div>
              <div className="stat-trend positive">+5% vs mês anterior</div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Receita Geral</span>
              <div className="stat-value">R$ 42.800</div>
              <div className="stat-trend positive">+8% vs mês anterior</div>
            </div>

            <div className="stat-card">
              <span className="stat-label">Pedidos Hoje</span>
              <div className="stat-value">893</div>
            </div>
          </div>

          <div className="charts-grid">
            {/* Vendas x Mês */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Vendas x Mês</h3>
                <div className="chart-filters">
                  <button className="filter-btn active">7 dias</button>
                  <button className="filter-btn">30 dias</button>
                </div>
              </div>
              <div className="bar-chart">
                {[60, 75, 85, 95, 100, 90, 80].map((height, i) => (
                  <div key={i} className="bar-container">
                    <div className="bar" style={{ height: `${height}%` }}></div>
                    <span className="bar-label">{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lucro Líquido */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Lucro Líquido</h3>
                <div className="chart-filters">
                  <button className="filter-btn active">7 dias</button>
                  <button className="filter-btn">30 dias</button>
                </div>
              </div>
              <div className="donut-chart">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="12" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="none" 
                    stroke="#ff6b35" 
                    strokeWidth="12"
                    strokeDasharray="188.4 251.2"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="donut-center">75%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Gestão dos Produtos */}
        <section className="products-section">
          <div className="section-header">
            <h2 className="section-title">Gestão dos Produtos</h2>
            <div className="section-actions">
              <button className="filter-button">
                <span>🔍</span> Filtrar por
              </button>
              <button className="filter-button">
                <span>📋</span> Categorias
              </button>
            </div>
          </div>
          
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Qtd. Estoque</th>
                  <th>Código</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.quantity}</td>
                    <td>{product.code}</td>
                    <td>
                      <button className="action-btn edit">✏️</button>
                      <button className="action-btn delete">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Adicionar Produtos */}
        <section className="add-product-section">
          <h2 className="section-title">Adicionar Produtos</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Nome do Produto</label>
              <input
                type="text"
                placeholder="Nome"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Quantidade e Estoque</label>
              <input
                type="text"
                placeholder="Preço"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Descrição</label>
              <textarea
                placeholder="Descrição"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
            </div>

            <div className="form-group full-width">
              <label>Categoria</label>
              <input
                type="text"
                placeholder="Categoria"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
            </div>

            <div className="form-group full-width upload-area">
              <span className="upload-icon">📎</span>
              <span>Fazer upload das imagens dos produtos</span>
            </div>
          </div>

          <button className="btn-primary" onClick={handleAddProduct}>
            Adicionar produtos
          </button>
        </section>

        {/* Contas Subsidiárias */}
        <section className="subsidiaries-section">
          <h2 className="section-title">Contas Subsidiárias</h2>
          <div className="subsidiaries-grid">
            {subsidiaries.map((sub, index) => (
              <div key={index} className="subsidiary-card">
                <div className="subsidiary-icon">👤</div>
                <div className="subsidiary-info">
                  <h4>{sub.name}</h4>
                  <p>{sub.role}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn-primary-outline">
            ➕ Adicionar contas subsidiárias
          </button>
        </section>
      </main>
    </div>
  );
};

export default SupplierPage;
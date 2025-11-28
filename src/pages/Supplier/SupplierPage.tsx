import React, { useState, useEffect, type ReactNode } from 'react';
import './SupplierPage.css';

// --- DEFINIÇÕES DE TIPOS ---

interface DashboardMetrics {
  activeProducts: number;
  monthlyRevenue: number;
  totalSales: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'Ativo' | 'Inativo' | 'Pendente';
}

// --- UTILITÁRIOS E MOCKS ---

const mockApiFetchMetrics = (): Promise<DashboardMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        activeProducts: 128,
        monthlyRevenue: 42500,
        totalSales: 896,
      });
    }, 500);
  });
};

const mockApiFetchProducts = (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Smartwatch Ultra X', category: 'Eletrônicos', stock: 45, price: 599.99, status: 'Ativo' },
        { id: 2, name: 'Fone Bluetooth Pro V2', category: 'Acessórios', stock: 120, price: 189.50, status: 'Ativo' },
        { id: 3, name: 'Teclado Mecânico RGB', category: 'Periféricos', stock: 15, price: 349.00, status: 'Inativo' },
        { id: 4, name: 'Mouse Gamer Ergonômico', category: 'Periféricos', stock: 88, price: 99.90, status: 'Ativo' },
        { id: 5, name: 'Câmera de Segurança HD', category: 'Eletrônicos', stock: 0, price: 210.00, status: 'Pendente' },
      ]);
    }, 500);
  });
};

// --- COMPONENTES DA UI ---

const DashboardLayout: React.FC<{ children: ReactNode; activePath: string }> = ({ children, activePath }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Produtos', path: '/products', icon: '📦' },
    { name: 'Pedidos', path: '/orders', icon: '🛒' },
    { name: 'Relatórios', path: '/reports', icon: '📈' },
    { name: 'Configurações', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-logo">Fornecedor PRO</div>
        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`sidebar-nav-item ${activePath === item.path ? 'active' : ''}`}
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-logout">Sair</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="main-header">
          <h1 className="main-title">Dashboard de Fornecedor</h1>
          <p className="main-subtitle">Bem-vindo de volta ao seu painel de controle.</p>
        </header>
        {children}
      </main>
    </div>
  );
};

interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, trend, trendType = 'neutral' }) => {
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <span className="metric-icon">{icon}</span>
        <span className="metric-period">Últimos 30 dias</span>
      </div>
      <p className="metric-label">{label}</p>
      <h3 className="metric-value">{value}</h3>
      {trend && (
        <p className={`metric-trend ${trendType}`}>
          {trendType === 'positive' ? '▲' : trendType === 'negative' ? '▼' : '—'}
          <span className="trend-detail">{trend}</span>
        </p>
      )}
    </div>
  );
};

const SalesChart: React.FC = () => {
  const salesData = [
    { month: 'Jan', value: 30 },
    { month: 'Fev', value: 45 },
    { month: 'Mar', value: 60 },
    { month: 'Abr', value: 75 },
    { month: 'Mai', value: 90 },
    { month: 'Jun', value: 100 },
    { month: 'Jul', value: 80 },
    { month: 'Ago', value: 70 },
    { month: 'Set', value: 55 },
    { month: 'Out', value: 65 },
    { month: 'Nov', value: 85 },
    { month: 'Dez', value: 95 },
  ];

  const maxValue = Math.max(...salesData.map(d => d.value));

  return (
    <div className="chart-card" style={{ gridColumn: 'span 2' }}>
      <div className="chart-header">
        <h3 className="chart-title">Vendas x Mês (Últimos 12)</h3>
        <div className="chart-filters">
          <button className="chart-filter-btn active">7 dias</button>
          <button className="chart-filter-btn">30 dias</button>
        </div>
      </div>
      <div className="sales-chart-container">
        {salesData.map((data, index) => (
          <div key={index} className="sales-bar-wrapper">
            <div className="sales-bar-tooltip">
              {data.month}: {data.value}k
            </div>
            <div
              className="sales-bar"
              style={{ height: `${(data.value / maxValue) * 90}%` }}
              aria-label={`${data.month}: ${data.value} mil`}
            ></div>
            <span className="sales-bar-label">{data.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfitChart: React.FC = () => {
  const percentage = 75;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Margem de Lucro Líquido</h3>
        <div className="chart-filters">
          <button className="chart-filter-btn active">7 dias</button>
          <button className="chart-filter-btn">30 dias</button>
        </div>
      </div>
      <div className="profit-chart-container">
        <div className="profit-donut-wrapper">
          <svg viewBox="0 0 100 100" className="profit-donut-svg">
            <circle 
              cx="50" cy="50" r={radius} fill="none" 
              stroke="#f0f0f0" strokeWidth="12"
            />
            <circle
              cx="50" cy="50" r={radius} fill="none"
              stroke="#ff6b35" strokeWidth="12"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={dashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="profit-donut-center">
            <div className="profit-percentage">{percentage}%</div>
            <div className="profit-label">Lucro Total</div>
          </div>
        </div>
        <p className="profit-goal">Meta: 80%</p>
      </div>
    </div>
  );
};

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockApiFetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return <div className="loading-message">Carregando produtos...</div>;
  }

  return (
    <div className="product-table-wrapper">
      <div className="product-table-header">
        <h3 className="product-table-title">Lista de Produtos</h3>
        <button className="add-product-btn">+ Adicionar Produto</button>
      </div>
      <table className="product-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th style={{ textAlign: 'center' }}>Estoque</th>
            <th style={{ textAlign: 'right' }}>Preço</th>
            <th style={{ textAlign: 'center' }}>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="product-name">{product.name}</td>
              <td className="product-category">{product.category}</td>
              <td className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                {product.stock}
              </td>
              <td className="product-price">{formatCurrency(product.price)}</td>
              <td className="product-status">
                <span className={`status-badge ${product.status.toLowerCase()}`}>
                  {product.status}
                </span>
              </td>
              <td className="product-actions">
                <button className="action-btn edit">Editar</button>
                <button className="action-btn delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProductForm: React.FC = () => {
  return (
    <div className="product-form-wrapper">
      <h3 className="form-title">Adicionar Produtos</h3>
      <form className="product-form">
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="product-name" className="form-label">Nome do Produto:</label>
            <input 
              type="text" 
              id="product-name" 
              placeholder="Ex: Smartwatch Ultra X"
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="product-category" className="form-label">Categoria:</label>
            <input 
              type="text" 
              id="product-category" 
              placeholder="Ex: Eletrônicos"
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="product-price" className="form-label">Preço:</label>
            <input 
              type="number" 
              id="product-price" 
              placeholder="Ex: 599.99"
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label htmlFor="product-stock" className="form-label">Quantidade no Estoque:</label>
            <input 
              type="number" 
              id="product-stock" 
              placeholder="Ex: 120"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="product-description" className="form-label">Descrição:</label>
          <textarea
            id="product-description"
            rows={4}
            placeholder="Detalhes completos sobre o produto..."
            className="form-input form-textarea"
          ></textarea>
        </div>

        <div className="file-upload-wrapper">
          <label htmlFor="file-upload" className="file-upload-label">
            <div className="file-upload-content">
              <span className="file-upload-icon">📄</span>
              <p className="file-upload-text">Faça upload das imagens dos produtos</p>
            </div>
            <input id="file-upload" type="file" multiple className="file-input-hidden" />
          </label>
        </div>

        <button
          type="submit"
          className="submit-btn"
          onClick={(e) => e.preventDefault()}
        >
          Adicionar produtos
        </button>
      </form>
    </div>
  );
};

interface SubsidiaryUser {
  id: number;
  name: string;
  memberSince: string;
}

const SubsidiaryAccountCard: React.FC<SubsidiaryUser> = ({ name, memberSince }) => {
  return (
    <div className="subsidiary-card">
      <div className="subsidiary-user-info">
        <span className="subsidiary-avatar">👤</span> 
        <div>
          <p className="subsidiary-name">{name}</p>
          <div className="subsidiary-status">
            <span className="status-indicator"></span>
            Membro desde {memberSince}
          </div>
        </div>
      </div>
      <button className="edit-permissions-btn">Editar Permissões</button>
    </div>
  );
};

const SubsidiaryAccounts: React.FC = () => {
  const mockUsers: SubsidiaryUser[] = [
    { id: 1, name: 'João Maciel', memberSince: '24/03/2025' },
    { id: 2, name: 'Kauê Gabriel', memberSince: '15/04/2025' },
    { id: 3, name: 'Tiago Tavares', memberSince: '12/01/2025' },
    { id: 4, name: 'Joel Matiolli', memberSince: '25/06/2025' },
  ];

  return (
    <div className="subsidiary-accounts-section">
      <h2 className="section-title">Contas Subsidiárias</h2>
      
      <div className="subsidiary-grid">
        {mockUsers.map(user => (
          <SubsidiaryAccountCard key={user.id} {...user} />
        ))}
      </div>

      <div className="add-subsidiary-wrapper">
        <button
          className="add-subsidiary-btn"
          onClick={(e) => e.preventDefault()}
        >
          <span className="btn-icon">🧑‍💻</span> 
          <span>Adicionar contas subsidiárias</span>
        </button>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeProducts: 0,
    monthlyRevenue: 0,
    totalSales: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const fetchMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const data = await mockApiFetchMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Erro ao buscar métricas:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const formatRevenueForCard = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardLayout activePath="/dashboard">
      <section className="section">
        <h2 className="section-title">Visão Geral</h2>
        
        <div className="metrics-grid">
          <MetricCard
            icon="📦"
            label="Produtos Ativos"
            value={loadingMetrics ? '...' : metrics.activeProducts}
            trend="+5% vs mês anterior"
            trendType="positive"
          />

          <MetricCard
            icon="💰"
            label="Lucro Mensal"
            value={loadingMetrics ? '...' : formatRevenueForCard(metrics.monthlyRevenue)}
            trend="+8% vs mês anterior"
            trendType="positive"
          />

          <MetricCard
            icon="📈"
            label="Vendas Totais"
            value={loadingMetrics ? '...' : metrics.totalSales.toLocaleString('pt-BR')}
            trend="-2% vs mês anterior"
            trendType="negative"
          />
        </div>

        <div className="charts-grid">
          <SalesChart />
          <ProfitChart />
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Gestão dos Produtos</h2>
        <ProductTable />
      </section>
      
      <section className="section">
        <ProductForm />
      </section>
      
      <section className="section">
        <SubsidiaryAccounts />
      </section>
    </DashboardLayout>
  );
};

export default App;
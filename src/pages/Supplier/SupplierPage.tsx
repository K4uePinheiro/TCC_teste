import React, { useState, useEffect, type ReactNode } from 'react';

// --- TYPE DEFINITIONS ---

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

// --- UTILITIES AND MOCKS ---

// Mock API data fetch to simulate finding metrics
const mockApiFetchMetrics = (): Promise<DashboardMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        activeProducts: 128,
        monthlyRevenue: 42500,
        totalSales: 896,
      });
    }, 500); // Simulates network latency
  });
};

// Mock API data fetch to simulate finding products
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

// --- UI COMPONENTS ---

// DashboardLayout Component
const DashboardLayout: React.FC<{ children: ReactNode; activePath: string }> = ({ children, activePath }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Produtos', path: '/products', icon: '📦' },
    { name: 'Pedidos', path: '/orders', icon: '🛒' },
    { name: 'Relatórios', path: '/reports', icon: '📈' },
    { name: 'Configurações', path: '/settings', icon: '⚙️' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col p-4">
        <div className="text-2xl font-bold text-orange-500 mb-8">Fornecedor PRO</div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                    activePath === item.path
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={(e) => e.preventDefault()} // Prevents real navigation
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button className="w-full p-3 text-sm rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Dashboard de Fornecedor</h1>
          <p className="text-gray-500">Bem-vindo de volta ao seu painel de controle.</p>
        </header>
        {children}
      </main>
    </div>
  );
};

// MetricCard Component
interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, trend, trendType = 'neutral' }) => {
  const trendColor = trendType === 'positive' ? 'text-green-500' : trendType === 'negative' ? 'text-red-500' : 'text-gray-500';
  const shadowColor = trendType === 'positive' ? 'shadow-green-500/10' : trendType === 'negative' ? 'shadow-red-500/10' : 'shadow-gray-500/10';

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${shadowColor}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl p-2 bg-gray-100 rounded-lg">{icon}</span>
        <span className="text-xs font-medium text-gray-400">Últimos 30 dias</span>
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-gray-800 mb-3">
        {value}
      </h3>
      {trend && (
        <p className={`text-sm ${trendColor} font-semibold flex items-center`}>
          {trendType === 'positive' ? '▲' : trendType === 'negative' ? '▼' : '—'}
          <span className="ml-1 text-xs font-normal text-gray-500">{trend}</span>
        </p>
      )}
    </div>
  );
};

// SalesChart - Bar Chart (Sales vs Month)
const SalesChart: React.FC = () => {
  // Mock data for the bar chart
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
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col col-span-2">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-xl font-semibold text-gray-800">Vendas x Mês (Últimos 12)</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm rounded-full bg-orange-500 text-white font-medium shadow-md">
            7 dias
          </button>
          <button className="px-3 py-1 text-sm rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200">
            30 dias
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-end h-72 space-x-1 sm:space-x-2 p-2">
        {salesData.map((data, index) => (
          <div key={index} className="flex flex-col items-center justify-end h-full flex-grow group relative">
            {/* Tooltip (displayed on hover) */}
            <div className="absolute bottom-full mb-2 p-1 px-2 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {data.month}: {data.value}k
            </div>
            {/* Bar */}
            <div
              className="w-full bg-orange-400 rounded-t-lg transition-all duration-500 hover:bg-orange-500"
              style={{ height: `${(data.value / maxValue) * 90}%` }}
              aria-label={`${data.month}: ${data.value} mil`}
            ></div>
            {/* Label */}
            <span className="text-xs text-gray-500 mt-1">{data.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ProfitChart - Donut Chart (Net Profit)
const ProfitChart: React.FC = () => {
  // Simulating 75% profit
  const percentage = 75;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
      <div className="flex justify-between w-full items-center mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-xl font-semibold text-gray-800">Margem de Lucro Líquido</h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs rounded-full bg-orange-500 text-white font-medium shadow-md">
            7 dias
          </button>
          <button className="px-3 py-1 text-xs rounded-full text-gray-500 bg-gray-100 hover:bg-gray-200">
            30 dias
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center w-48 h-48 relative">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {/* Gray Background */}
          <circle 
            cx="50" cy="50" r={radius} fill="none" 
            stroke="#f0f0f0" strokeWidth="12" 
            className="shadow-inner"
          />
          {/* Profit (Orange) */}
          <circle
            cx="50" cy="50" r={radius} fill="none"
            stroke="#ff6b35" strokeWidth="12"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <div className="text-4xl font-extrabold text-gray-800">{percentage}%</div>
          <div className="text-sm text-gray-500">Lucro Total</div>
        </div>
      </div>
      <p className="text-sm text-center text-gray-500 mt-4">Meta: 80%</p>
    </div>
  );
};

// ProductTable Component
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

  const getStatusClasses = (status: Product['status']) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-700';
      case 'Inativo':
        return 'bg-red-100 text-red-700';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center text-gray-500">
        Carregando produtos...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Lista de Produtos</h3>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-md text-sm">
          + Adicionar Produto
        </button>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
            <th className="py-3 px-4">Produto</th>
            <th className="py-3 px-4">Categoria</th>
            <th className="py-3 px-4 text-center">Estoque</th>
            <th className="py-3 px-4 text-right">Preço</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-4">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4 text-sm font-medium text-gray-900">
                {product.name}
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">{product.category}</td>
              <td className={`py-4 px-4 text-sm font-semibold text-center ${product.stock === 0 ? 'text-red-500' : 'text-gray-700'}`}>
                {product.stock}
              </td>
              <td className="py-4 px-4 text-sm text-gray-700 text-right">
                {formatCurrency(product.price)}
              </td>
              <td className="py-4 px-4 text-sm text-center">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full font-medium text-xs ${getStatusClasses(product.status)}`}>
                  {product.status}
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-gray-500 space-x-3">
                <button className="text-blue-500 hover:text-blue-700 text-sm">Editar</button>
                <button className="text-red-500 hover:text-red-700 text-sm">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ProductForm - Form to Add Products
const ProductForm: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mb-10">
      <h3 className="text-2xl font-bold text-gray-700 mb-6">Adicionar Produtos</h3>
      <form className="space-y-6">
        {/* Input Grid (Name, Category, Price, Stock) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="product-name" className="text-sm font-medium text-gray-700">Nome do Produto:</label>
            <input 
              type="text" 
              id="product-name" 
              placeholder="Ex: Smartwatch Ultra X"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition duration-150"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="product-category" className="text-sm font-medium text-gray-700">Categoria:</label>
            <input 
              type="text" 
              id="product-category" 
              placeholder="Ex: Eletrônicos"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition duration-150"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="product-price" className="text-sm font-medium text-gray-700">Preço:</label>
            <input 
              type="number" 
              id="product-price" 
              placeholder="Ex: 599.99"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition duration-150"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="product-stock" className="text-sm font-medium text-gray-700">Quantidade no Estoque:</label>
            <input 
              type="number" 
              id="product-stock" 
              placeholder="Ex: 120"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition duration-150"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="product-description" className="text-sm font-medium text-gray-700">Descrição:</label>
          <textarea
            id="product-description"
            rows={4}
            placeholder="Detalhes completos sobre o produto..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition duration-150"
          ></textarea>
        </div>

        {/* Image Upload */}
        <div className="flex items-center justify-center w-full">
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-150">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <span className="text-2xl mb-1">📄</span>
              <p className="mb-2 text-sm text-gray-500 font-semibold">Faça upload das imagens dos produtos</p>
            </div>
            <input id="file-upload" type="file" multiple className="hidden" />
          </label>
        </div>

        {/* Add Button */}
        <button
          type="submit"
          className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-300/50"
          onClick={(e) => e.preventDefault()}
        >
          Adicionar produtos
        </button>
      </form>
    </div>
  );
};

// SubsidiaryAccountCard - Subsidiary Account Card
interface SubsidiaryUser {
  id: number;
  name: string;
  memberSince: string;
}

const SubsidiaryAccountCard: React.FC<SubsidiaryUser> = ({ name, memberSince }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
      <div className="flex items-center mb-3">
        {/* User Icon (simulated with emoji) */}
        <span className="text-2xl mr-3">👤</span> 
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <div className="flex items-center text-xs text-gray-500 mt-0.5">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
            Membro desde {memberSince}
          </div>
        </div>
      </div>
      <button className="w-full py-2 text-sm text-orange-500 border border-orange-400 rounded-lg hover:bg-orange-50 transition-colors font-medium">
        Editar Permissões
      </button>
    </div>
  );
};

// SubsidiaryAccounts - Subsidiary Accounts Section
const SubsidiaryAccounts: React.FC = () => {
  const mockUsers: SubsidiaryUser[] = [
    { id: 1, name: 'João Maciel', memberSince: '24/03/2025' },
    { id: 2, name: 'Kauê Gabriel', memberSince: '15/04/2025' },
    { id: 3, name: 'Tiago Tavares', memberSince: '12/01/2025' },
    { id: 4, name: 'Joel Matiolli', memberSince: '25/06/2025' },
  ];

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Contas Subsidiárias</h2>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mockUsers.map(user => (
          <SubsidiaryAccountCard key={user.id} {...user} />
        ))}
      </div>

      {/* Add Accounts Button */}
      <div className="flex justify-center mt-6">
        <button
          className="w-full max-w-md py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-300/50 flex items-center justify-center space-x-2"
          onClick={(e) => e.preventDefault()}
        >
          <span className="text-xl">🧑‍💻</span> 
          <span>Adicionar contas subsidiárias</span>
        </button>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT (App) ---

const App: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeProducts: 0,
    monthlyRevenue: 0,
    totalSales: 0,
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Function to fetch metrics (simulated)
  const fetchMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const data = await mockApiFetchMetrics();
      setMetrics(data);
    } catch (err) {
      console.error('Error fetching metrics:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  // Format value to R$ 42.500 (without cents) for the main metric
  const formatRevenueForCard = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };


  return (
    <DashboardLayout activePath="/dashboard">
      {/* The only external CSS is the font import, which must remain in a <style> block due to the single-file constraint. */}
      <style>{`
        /* Imports the Inter font for the body */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      
      {/* Overview Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Visão Geral</h2>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SalesChart />
          <div className="col-span-1">
            <ProfitChart />
          </div>
        </div>
      </section>

      {/* Product Management Section */}
      <section className="products-management-section mb-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Gestão dos Produtos</h2>
        <ProductTable />
      </section>
      
      {/* Add Products Section */}
      <section className="add-products-section mb-10">
        <ProductForm />
      </section>
      
      {/* Subsidiary Accounts Section */}
      <section className="subsidiary-accounts-section">
        <SubsidiaryAccounts />
      </section>
    </DashboardLayout>
  );
};

export default App;
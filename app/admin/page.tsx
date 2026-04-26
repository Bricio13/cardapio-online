'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Package
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeOrders: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/products')
        ]);
        
        const orders = await ordersRes.json();
        const products = await productsRes.json();
        
        const totalRevenue = orders.reduce((acc: number, order: any) => acc + order.total, 0);
        const activeOrders = orders.filter((order: any) => order.status !== 'entregue').length;
        
        setStats({
          totalOrders: orders.length,
          totalRevenue,
          activeOrders,
          totalProducts: products.length
        });
        
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Carregando dashboard...</div>;

  const cards = [
    { label: 'Total de Pedidos', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Receita Total', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.totalRevenue), icon: DollarSign, color: 'bg-emerald-500' },
    { label: 'Pedidos Ativos', value: stats.activeOrders, icon: Clock, color: 'bg-amber-500' },
    { label: 'Produtos Ativos', value: stats.totalProducts, icon: Package, color: 'bg-violet-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Bem-vindo ao painel de controle do seu restaurante.</p>
        </div>
        <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
          Exportar Relatório
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`${card.color} p-3 rounded-xl text-white`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Pedidos Recentes</h2>
            <button className="text-[#FF6321] text-sm font-bold hover:underline">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.customerPhone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        order.status === 'novo' ? 'bg-blue-100 text-blue-600' :
                        order.status === 'preparando' ? 'bg-amber-100 text-amber-600' :
                        order.status === 'pronto' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="font-bold text-gray-900">Ações Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Package size={20} />
                </div>
                <span className="font-medium text-gray-700">Adicionar Produto</span>
              </div>
              <ArrowUpRight size={16} className="text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <CheckCircle2 size={20} />
                </div>
                <span className="font-medium text-gray-700">Verificar Pedidos</span>
              </div>
              <ArrowUpRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Eye, 
  Phone, 
  MapPin,
  Calendar,
  CreditCard,
  Banknote,
  QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, status: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  if (loading) return <div>Carregando pedidos...</div>;

  const statusConfig: any = {
    novo: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Novo' },
    preparando: { icon: Truck, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Preparando' },
    pronto: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Pronto' },
    entregue: { icon: CheckCircle2, color: 'text-gray-500', bg: 'bg-gray-50', label: 'Entregue' },
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500">Acompanhe e gerencie os pedidos em tempo real.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status];
            return (
              <motion.div
                key={order.id}
                layoutId={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  selectedOrder?.id === order.id ? 'border-[#FF6321] ring-1 ring-[#FF6321]' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`${config.bg} ${config.color} p-3 rounded-xl h-fit`}>
                      <config.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{order.customerName}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1 font-bold text-gray-900">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {orders.length === 0 && (
            <div className="py-20 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhum pedido recebido ainda.</p>
            </div>
          )}
        </div>

        {/* Order Detail */}
        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm sticky top-24 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 text-xl">Detalhes do Pedido</h2>
                    <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-200 rounded-full">
                      <XCircle size={20} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: {selectedOrder.id.slice(-6)}</span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={18} className="text-gray-400" />
                      <span className="font-medium">{selectedOrder.customerPhone}</span>
                    </div>
                    <div className="flex items-start gap-3 text-gray-700">
                      <MapPin size={18} className="text-gray-400 mt-1" />
                      <span className="font-medium">{selectedOrder.address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      {selectedOrder.paymentMethod === 'pix' ? <QrCode size={18} className="text-gray-400" /> :
                       selectedOrder.paymentMethod === 'cartao' ? <CreditCard size={18} className="text-gray-400" /> :
                       <Banknote size={18} className="text-gray-400" />}
                      <span className="font-medium uppercase">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Itens</h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            <span className="font-bold text-gray-900">{item.quantity}x</span> {item.product.name}
                          </span>
                          <span className="font-medium text-gray-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-[#FF6321]">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOrder.total)}
                      </span>
                    </div>
                  </div>

                  {/* Observations */}
                  {selectedOrder.observations && (
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <h4 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Observações</h4>
                      <p className="text-sm text-amber-700">{selectedOrder.observations}</p>
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="space-y-3 pt-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alterar Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['novo', 'preparando', 'pronto', 'entregue'].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedOrder.id, status)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                            selectedOrder.status === status 
                              ? 'bg-[#FF6321] text-white shadow-md' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <Eye size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Selecione um pedido para ver detalhes</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

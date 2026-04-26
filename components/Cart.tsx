'use client';

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '@/hooks/use-cart';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  total: number;
}

export function Cart({ isOpen, onClose, cart, onUpdateQuantity, onRemove, onCheckout, total }: CartProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#FF6321]" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Seu Carrinho</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag size={40} className="text-gray-300" />
                  </div>
                  <p className="text-lg font-medium">Seu carrinho está vazio</p>
                  <button
                    onClick={onClose}
                    className="text-[#FF6321] font-bold hover:underline"
                  >
                    Ver cardápio
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-[#FF6321] font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded-lg transition-colors text-gray-500"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded-lg transition-colors text-gray-500"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-500">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                  </span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  className="w-full bg-[#FF6321] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#e5591e] transition-colors"
                >
                  Finalizar Pedido
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

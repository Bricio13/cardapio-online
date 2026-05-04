'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Send, CreditCard, Banknote, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '@/hooks/use-cart';

const checkoutSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  paymentMethod: z.enum(['dinheiro', 'pix', 'cartao']),
  observations: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  total: number;
  restaurant: any;
}

export function CheckoutModal({ isOpen, onClose, cart, total, restaurant }: CheckoutModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'pix',
    }
  });

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      // 1. Create order in DB
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: data.name,
          customerPhone: data.phone,
          address: data.address,
          paymentMethod: data.paymentMethod,
          observations: data.observations,
          total,
          items: cart,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const order = await response.json();
      const shortId = order.id.slice(-6).toUpperCase();

      // 2. Format WhatsApp message
      const itemsList = cart.map(item => `${item.quantity}x ${item.name} - R$ ${item.price.toFixed(2)}`).join('\n');
      const message = `*Pedido #${shortId} - ${restaurant.name}*\n\n` +
        `*ID Completo:* ${order.id}\n` +
        `*Cliente:* ${data.name}\n` +
        `*Telefone:* ${data.phone}\n` +
        `*Endereço:* ${data.address}\n\n` +
        `*Itens:*\n${itemsList}\n\n` +
        `*Total:* R$ ${total.toFixed(2)}\n` +
        `*Pagamento:* ${data.paymentMethod.toUpperCase()}\n` +
        (data.observations ? `*Observações:* ${data.observations}\n` : '') +
        `\n_Pedido enviado via MenuMaster_`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${restaurant.whatsappNumber}&text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      onClose();
      // Optionally clear cart here if handled by parent
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Erro ao processar pedido. Tente novamente.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 m-auto h-fit w-full max-w-lg bg-white z-[70] shadow-2xl rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Finalizar Pedido</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-transparent outline-none transition-all"
                    placeholder="Como devemos te chamar?"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    {...register('phone')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-transparent outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
                  <input
                    {...register('address')}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-transparent outline-none transition-all"
                    placeholder="Rua, número, bairro, cidade"
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="cursor-pointer">
                      <input type="radio" {...register('paymentMethod')} value="pix" className="hidden peer" />
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 peer-checked:border-[#FF6321] peer-checked:bg-[#FF6321]/5 transition-all">
                        <QrCode size={20} className="text-gray-400 peer-checked:text-[#FF6321]" />
                        <span className="text-xs mt-1 font-medium">PIX</span>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" {...register('paymentMethod')} value="cartao" className="hidden peer" />
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 peer-checked:border-[#FF6321] peer-checked:bg-[#FF6321]/5 transition-all">
                        <CreditCard size={20} className="text-gray-400 peer-checked:text-[#FF6321]" />
                        <span className="text-xs mt-1 font-medium">Cartão</span>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" {...register('paymentMethod')} value="dinheiro" className="hidden peer" />
                      <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-200 peer-checked:border-[#FF6321] peer-checked:bg-[#FF6321]/5 transition-all">
                        <Banknote size={20} className="text-gray-400 peer-checked:text-[#FF6321]" />
                        <span className="text-xs mt-1 font-medium">Dinheiro</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações (Opcional)</label>
                  <textarea
                    {...register('observations')}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Ex: sem cebola, troco para R$ 50..."
                  />
                </div>
              </div>

              <div className="pt-4">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-[#FF6321] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-[#e5591e] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processando...' : (
                    <>
                      Enviar Pedido para WhatsApp
                      <Send size={20} />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

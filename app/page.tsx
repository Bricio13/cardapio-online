'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { Cart } from '@/components/Cart';
import { CheckoutModal } from '@/components/CheckoutModal';
import { useCart } from '@/hooks/use-cart';
import { Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      try {
        const [resRes, catRes] = await Promise.all([
          fetch('/api/restaurant'),
          fetch('/api/categories')
        ]);
        
        const resData = await resRes.json();
        const catData = await catRes.json();
        
        setRestaurant(resData);
        setCategories(Array.isArray(catData) ? catData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = (Array.isArray(categories) ? categories : [])
    .flatMap(cat => cat.products || [])
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF6321] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <Header 
        restaurant={restaurant} 
        onCartClick={() => setIsCartOpen(true)} 
        cartCount={itemCount} 
      />

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="O que você quer comer hoje?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 outline-none focus:ring-2 focus:ring-[#FF6321] transition-all"
            />
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex overflow-x-auto pb-2 gap-3 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all' 
                ? 'bg-[#FF6321] text-white shadow-lg' 
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            Todos
          </button>
          {Array.isArray(categories) && categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-[#FF6321] text-white shadow-lg' 
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={addToCart} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500">
              <p className="text-lg">Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        total={total}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        restaurant={restaurant}
      />

      {/* Floating Cart Button for Mobile */}
      {itemCount > 0 && !isCartOpen && (
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 left-6 right-6 bg-[#FF6321] text-white py-4 rounded-2xl font-bold shadow-2xl flex items-center justify-between px-6 z-40 md:hidden"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1 rounded-lg">
              <ShoppingBag size={20} />
            </div>
            <span>{itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
          </div>
          <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
        </motion.button>
      )}
    </main>
  );
}

function ShoppingBag({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

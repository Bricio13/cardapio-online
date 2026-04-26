'use client';

import Image from 'next/image';
import { ShoppingCart, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  restaurant: any;
  onCartClick: () => void;
  cartCount: number;
}

export function Header({ restaurant, onCartClick, cartCount }: HeaderProps) {
  if (!restaurant) return null;

  return (
    <header className="relative w-full">
      {/* Banner */}
      <div className="relative h-48 md:h-64 w-full overflow-hidden">
        <Image
          src={restaurant.bannerUrl || 'https://picsum.photos/seed/food/1200/400'}
          alt="Banner"
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Restaurant Info */}
      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg -mt-16 md:-mt-20">
            <Image
              src={restaurant.logoUrl || 'https://picsum.photos/seed/burger/200/200'}
              alt="Logo"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{restaurant.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-1">
              <MapPin size={16} />
              <span className="text-sm">{restaurant.address}</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onCartClick}
            className="relative bg-[#FF6321] text-white p-4 rounded-2xl shadow-lg hover:bg-[#e5591e] transition-colors"
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
}

'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: any;
  onAdd: (product: any) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={product.imageUrl || 'https://picsum.photos/seed/food/400/300'}
          alt={product.name}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-1">{product.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[#FF6321] font-bold text-xl">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
          </span>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onAdd(product)}
            className="bg-[#FF6321]/10 text-[#FF6321] p-2 rounded-xl hover:bg-[#FF6321] hover:text-white transition-all"
          >
            <Plus size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

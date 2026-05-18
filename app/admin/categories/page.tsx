'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', order: '0' });

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchCategories();
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  }

  function handleEdit(category: any) {
    setEditingCategory(category);
    setFormData({ name: category.name, order: category.order.toString() });
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', order: '0' });
  }

  if (loading) return <div>Carregando categorias...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-500">Gerencie as categorias do seu cardápio.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF6321] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#e5591e] transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Categoria
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Ordem</th>
              <th className="px-6 py-4 font-medium">Nome</th>
              <th className="px-6 py-4 font-medium">Produtos</th>
              <th className="px-6 py-4 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
          {Array.isArray(categories) && categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.order}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{category.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{category.products?.length || 0} itens</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto h-fit w-full max-w-md bg-white z-[70] shadow-2xl rounded-3xl overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
                    placeholder="Ex: Pizzas, Bebidas..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordem de Exibição</label>
                  <input
                    type="number"
                    required
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#FF6321] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-[#e5591e] transition-all flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Salvar Categoria
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

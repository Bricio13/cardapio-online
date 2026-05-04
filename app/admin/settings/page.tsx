'use client';

import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Phone, MapPin, Palette, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: '',
    address: '',
    logoUrl: '',
    bannerUrl: '',
    primaryColor: '#FF6321',
    accentColor: '#000000'
  });

  useEffect(() => {
    fetchRestaurant();
  }, []);

  async function fetchRestaurant() {
    try {
      const res = await fetch('/api/restaurant');
      const data = await res.json();
      setRestaurant(data);
      setFormData({
        name: data.name,
        whatsappNumber: data.whatsappNumber,
        address: data.address || '',
        logoUrl: data.logoUrl || '',
        bannerUrl: data.bannerUrl || '',
        primaryColor: data.primaryColor,
        accentColor: data.accentColor
      });
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'bannerUrl' | 'logoUrl') {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('Configurações salvas com sucesso!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Carregando configurações...</div>;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-500">Personalize a identidade visual e informações do seu restaurante.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Visual Identity */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Palette size={20} className="text-[#FF6321]" />
            Identidade Visual
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Banner Principal</label>
              <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
                {formData.bannerUrl ? (
                  <Image
                    src={formData.bannerUrl}
                    alt="Banner Preview"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={40} className="mx-auto mb-2" />
                    <p className="text-xs">Preview do Banner</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <input
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
                  placeholder="URL do Banner ou faça upload abaixo"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'bannerUrl')}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FF6321]/10 file:text-[#FF6321] hover:file:bg-[#FF6321]/20 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Logo do Restaurante</label>
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center mx-auto">
                {formData.logoUrl ? (
                  <Image
                    src={formData.logoUrl}
                    alt="Logo Preview"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon size={24} className="mx-auto mb-2" />
                    <p className="text-[10px]">Logo</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <input
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
                  placeholder="URL do Logo ou faça upload abaixo"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'logoUrl')}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF6321]/10 file:text-[#FF6321] hover:file:bg-[#FF6321]/20 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor Primária</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor de Destaque</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="w-12 h-12 rounded-lg border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* General Info */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Settings size={20} className="text-[#FF6321]" />
            Informações Gerais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Restaurante</label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Phone size={14} /> WhatsApp para Pedidos
              </label>
              <input
                required
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
                placeholder="5511999999999"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <MapPin size={14} /> Endereço
            </label>
            <input
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF6321] outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            disabled={saving}
            type="submit"
            className="bg-[#FF6321] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#e5591e] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}

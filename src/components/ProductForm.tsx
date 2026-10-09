'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductFormData, fetchProducts as apiFetchProducts } from '@/lib/products';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('title');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    price: 0,
    stock: 0,
    category: '',
  });

  const loadProducts = async () => {
    try {
      const data = await apiFetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Failed to load products', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortBy(val);
    const sorted = [...filteredProducts].sort((a, b) => {
      if (val === 'price') return a.price - b.price;
      if (val === 'stock') return a.stock - b.stock;
      return a.title.localeCompare(b.title);
    });
    setFilteredProducts(sorted);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...formData } : p
      );
      setProducts(updated);
      setFilteredProducts(updated);
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...formData,
      };
      // เพิ่มสินค้าใหม่ต่อท้ายไว้ด้านล่างสุดของรายการ
      const updated = [...products, newProduct];
      setProducts(updated);
      setFilteredProducts(updated);
    }
    setFormData({ title: '', price: 0, stock: 0, category: '' });
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
  };

  const handleDeleteClick = (id: string | number) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    setFilteredProducts(updated);
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ส่วนหัวหน้าเว็บ - ดีไซน์ Minimal Clean */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">Inventory System</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">คลังข้อมูลสินค้า</h1>
          </div>
          <div className="text-sm text-slate-400 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl backdrop-blur-sm">
            จัดการระบบสต็อกและสินค้าคงคลังทั้งหมด
          </div>
        </div>

        {/* แผงควบคุมการค้นหา (Search & Filter Bar) */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-6 space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">ค้นหาสินค้า</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="พิมพ์ชื่อสินค้าหรือหมวดหมู่..." 
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">แสดงผล (รายการ)</label>
              <input 
                type="number" 
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition text-center"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">จัดเรียงตาม</label>
              <select 
                value={sortBy}
                onChange={handleSortChange}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="title">ชื่อ (Title)</option>
                <option value="price">ราคา (Price)</option>
                <option value="stock">คงเหลือ (Stock)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl py-3 text-sm transition shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
              >
                🔍 ค้นหาข้อมูล
              </button>
            </div>
          </form>
        </div>

        {/* ส่วนฟอร์มเพิ่ม/แก้ไขสินค้า */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800/80 rounded-3xl p-8 shadow-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              {editingProduct ? 'แก้ไขข้อมูลสินค้า' : 'เพิ่มรายการสินค้าใหม่'}
            </h2>
            {editingProduct && (
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                กำลังแก้ไข ID: {editingProduct.id}
              </span>
            )}
          </div>
          
          <form onSubmit={handleSaveProduct} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">ชื่อสินค้า</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ระบุชื่อสินค้า..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">หมวดหมู่สินค้า</label>
                <select 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="" disabled className="text-slate-600">-- กรุณาเลือกหมวดหมู่ --</option>
                  <option value="beauty">Beauty (ความงาม)</option>
                  <option value="fragrances">Fragrances (น้ำหอม)</option>
                  <option value="furniture">Furniture (เฟอร์นิเจอร์)</option>
                  <option value="groceries">Groceries (ของใช้)</option>
                  <option value="electronics">Electronics (อิเล็กทรอนิกส์)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">ราคาสินค้า (บาท)</label>
                <input 
                  type="number" 
                  step="any"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-slate-400">จำนวนสต็อกคงเหลือ</label>
                <input 
                  type="number" 
                  required
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {editingProduct && (
                <button 
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setFormData({ title: '', price: 0, stock: 0, category: '' });
                  }}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-2xl text-sm transition"
                >
                  ยกเลิก
                </button>
              )}
              <button 
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-2xl text-sm transition shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
              >
                {editingProduct ? 'บันทึกการเปลี่ยนแปลง' : '+ เพิ่มสินค้าลงระบบ'}
              </button>
            </div>
          </form>
        </div>

        {/* ตารางแสดงรายการสินค้าทั้งหมด */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white">รายการสินค้าทั้งหมด</h2>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold rounded-full">
                แสดง {Math.min(limit, filteredProducts.length)} จากทั้งหมด {filteredProducts.length} รายการ
              </span>
            </div>
            <button 
              onClick={loadProducts}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-xl transition border border-slate-700 text-slate-300"
            >
              🔄 รีเฟรชข้อมูล
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-5">รูปภาพ</th>
                  <th className="py-4 px-5">ชื่อสินค้า</th>
                  <th className="py-4 px-5">ราคา</th>
                  <th className="py-4 px-5">คงเหลือ</th>
                  <th className="py-4 px-5">หมวดหมู่</th>
                  <th className="py-4 px-5 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm bg-slate-950/30">
                {filteredProducts.slice(0, limit).length > 0 ? (
                  filteredProducts.slice(0, limit).map((product) => (
                    <tr key={product.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-4 px-5">
                        <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 text-xs text-slate-500 font-bold">
                          IMG
                        </div>
                      </td>
                      <td className="py-4 px-5 font-semibold text-white">{product.title}</td>
                      <td className="py-4 px-5 text-indigo-300 font-medium">
                        ฿{product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-5 text-slate-300">{product.stock} ชิ้น</td>
                      <td className="py-4 px-5">
                        <span className="px-3 py-1 bg-indigo-950/60 text-indigo-400 border border-indigo-800/40 text-xs font-semibold rounded-lg">
                          {product.category || 'general'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button 
                          onClick={() => handleEditClick(product)}
                          className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-xl transition"
                        >
                          แก้ไข
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(product.id)}
                          className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl transition"
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-slate-500">
                      ไม่พบข้อมูลสินค้าในระบบ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
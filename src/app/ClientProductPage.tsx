'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Product,
  ProductFormData,
  fetchProducts as apiFetchProducts,
} from '@/lib/products';

type FormState = {
  title: string;
  price: string;
  stock: string;
  category: string;
};

const emptyForm: FormState = { title: '', price: '', stock: '', category: '' };

const defaultCategories = [
  'beauty',
  'fragrances',
  'furniture',
  'groceries',
  'electronics',
  'vehicle',
  'sports-accessories',
];

const fieldClass =
  'w-full rounded-lg border border-[#2b2622] bg-[#120f0d] px-3.5 py-2.5 text-sm text-white placeholder-stone-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20';

const labelClass =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-stone-400';

export default function ClientProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // ค้นหา
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<'title' | 'price' | 'stock'>('title');

  // ฟอร์มเพิ่ม/แก้ไข
  const [editingId, setEditingId] = useState<Product['id'] | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiFetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const visibleProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = term
      ? products.filter(
          (p) =>
            p.title.toLowerCase().includes(term) ||
            (p.category || '').toLowerCase().includes(term)
        )
      : products;

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return a.title.localeCompare(b.title);
    });

    return sorted.slice(0, Math.max(0, limit));
  }, [products, searchTerm, sortBy, limit]);

  const categories = useMemo(() => {
    const fromData = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set([...defaultCategories, ...fromData]));
  }, [products]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const data: ProductFormData = {
      title: form.title.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
    };

    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...data } : p))
      );
    } else {
      const newProduct = { id: Date.now(), ...data } as Product;
      setProducts((prev) => [...prev, newProduct]);
    }
    resetForm();
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: String(p.price),
      stock: String(p.stock),
      category: p.category,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: Product['id']) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div className="mx-auto max-w-[1220px] px-4 py-10">
      {/* หัวข้อ + แถบค้นหา */}
      <header className="mb-8 space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">รายการสินค้า</h1>
            <p className="mt-1 text-sm text-stone-400">
              ค้นหา เพิ่ม แก้ไข และลบสินค้า
            </p>
          </div>
          <button
            onClick={loadProducts}
            disabled={loading}
            className="rounded-full border border-[#3a342f] bg-[#1c1917] px-5 py-2 text-xs font-medium text-stone-200 transition hover:bg-[#26211e] disabled:opacity-50"
          >
            {loading ? 'กำลังโหลด...' : '↻ โหลดข้อมูล'}
          </button>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อสินค้าหรือหมวดหมู่..."
              className="w-full rounded-full border border-[#2b2622] bg-[#1c1917] py-3.5 pl-13 pr-6 text-sm text-white placeholder-stone-500 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              style={{ paddingLeft: '3.25rem' }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400">
            <span>เรียงตาม</span>
            <div className="flex gap-1.5">
              {(['title', 'price', 'stock'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSortBy(key)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    sortBy === key
                      ? 'bg-amber-500 text-black'
                      : 'border border-[#3a342f] bg-[#1c1917] text-stone-300 hover:bg-[#26211e]'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            <span className="ml-2">แสดง</span>
            <input
              type="number"
              min={1}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-20 rounded-full border border-[#3a342f] bg-[#1c1917] px-3 py-1.5 text-center text-xs text-white outline-none focus:border-amber-500"
            />
            <span>รายการ</span>

            <span className="ml-auto text-xs">
              พบ <b className="text-amber-400">{visibleProducts.length}</b> จาก{' '}
              {products.length} รายการ
            </span>
          </div>
        </div>
      </header>

      {/* สองคอลัมน์: ฟอร์ม (ซ้าย) + ตาราง (ขวา) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_1fr]">
        {/* ฟอร์ม */}
        <aside className="rounded-3xl border border-[#2b2622] bg-[#1c1917] p-6 shadow-xl lg:sticky lg:top-6">
          <div className="mb-5 flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                editingId !== null ? 'bg-amber-400' : 'bg-emerald-500'
              }`}
            />
            <h2 className="text-lg font-bold">
              {editingId !== null ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
            </h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={labelClass}>ชื่อสินค้า</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="ระบุชื่อสินค้า..."
                className={fieldClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>ราคา</label>
                <input
                  type="number"
                  step="any"
                  min={0}
                  required
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  placeholder="0.00"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>จำนวน</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                  placeholder="0"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>หมวดหมู่</label>
              <select
                required
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className={`${fieldClass} cursor-pointer`}
              >
                <option value="" disabled>
                  กรุณาเลือกหมวดหมู่
                </option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-amber-500 py-3 text-xs font-bold text-black transition hover:bg-amber-400"
              >
                {editingId !== null ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
              </button>
              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-[#3a342f] bg-[#26211e] px-4 py-3 text-xs font-medium text-stone-300 transition hover:bg-[#322c28]"
                >
                  ยกเลิก
                </button>
              )}
            </div>
          </form>
        </aside>

        {/* ตารางแสดงสินค้า */}
        <div className="overflow-hidden rounded-3xl border border-[#2b2622] bg-[#1c1917] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2b2622] text-xs text-stone-400 uppercase tracking-wider">
                  <th className="py-4 px-5">ชื่อสินค้า</th>
                  <th className="py-4 px-5">หมวดหมู่</th>
                  <th className="py-4 px-5">ราคา</th>
                  <th className="py-4 px-5">คงเหลือ</th>
                  <th className="py-4 px-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2b2622] text-sm">
                {visibleProducts.length > 0 ? (
                  visibleProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#26211e]/40 transition">
                      <td className="py-4 px-5 font-medium text-white">
                        {p.title}
                      </td>
                      <td className="py-4 px-5">
                        <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400">
                          {p.category || 'general'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-stone-300">
                        {p.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 px-5 text-stone-300">{p.stock}</td>
                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="rounded-lg bg-sky-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-sky-500"
                        >
                          แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded-lg bg-rose-700 px-3 py-1 text-xs font-medium text-white transition hover:bg-rose-600"
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-500">
                      ไม่พบข้อมูลสินค้า
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
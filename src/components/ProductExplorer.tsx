'use client';

import React, { useState, useEffect } from 'react';
import ProductSearchForm from './ProductSearchForm';
import ProductForm from './ProductForm';
import { Product, ProductFormData, fetchProducts as apiFetchProducts } from '@/lib/products';

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [limit, setLimit] = useState<number>(10);

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

  const handleSearch = (searchTerm: string) => {
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

  const handleSortChange = (sortBy: string) => {
    const sorted = [...filteredProducts].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return a.title.localeCompare(b.title);
    });
    setFilteredProducts(sorted);
  };

  const handleSave = (data: ProductFormData) => {
    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...data } : p
      );
      setProducts(updated);
      setFilteredProducts(updated);
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...data,
      };
      const updated = [...products, newProduct];
      setProducts(updated);
      setFilteredProducts(updated);
    }
  };

  const handleDelete = (id: string | number) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    setFilteredProducts(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-white">
      {/* หัวข้อหลัก */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">รายการสินค้า</h1>
        <p className="text-sm text-gray-400">ค้นหา เพิ่ม แก้ไข และลบสินค้า</p>
      </div>

      {/* ฟอร์มค้นหาด้านบน */}
      <ProductSearchForm
        onSearch={handleSearch}
        onLimitChange={(l) => setLimit(l)}
        onSortChange={handleSortChange}
      />

      {/* ฟอร์มเพิ่มสินค้าใหม่ (รองรับทั้งแบบส่ง prop ชื่อ editingProduct หรือ product) */}
      <ProductForm
        {...({ editingProduct: editingProduct } as any)}
        onSave={handleSave}
        onCancel={() => setEditingProduct(null)}
      />

      {/* ตารางแสดงสินค้าทั้งหมด */}
      <div className="bg-[#121622] border border-[#1e2638] rounded-2xl p-6 shadow-xl text-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold">สินค้าทั้งหมด</h2>
            <span className="px-2.5 py-0.5 bg-[#1e2638] text-gray-300 text-xs font-semibold rounded-full">
              {Math.min(limit, filteredProducts.length)}
            </span>
          </div>
          <button
            onClick={loadProducts}
            className="px-4 py-2 bg-[#1e2638] hover:bg-[#28324a] text-xs font-medium rounded-xl transition border border-[#2e3b56]"
          >
            โหลดข้อมูล
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1e2638] text-xs text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-4">รูปภาพ</th>
                <th className="py-3 px-4">ชื่อสินค้า</th>
                <th className="py-3 px-4">ราคา</th>
                <th className="py-3 px-4">คงเหลือ</th>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2638] text-sm">
              {filteredProducts.slice(0, limit).length > 0 ? (
                filteredProducts.slice(0, limit).map((product) => (
                  <tr key={product.id} className="hover:bg-[#181f30]/50 transition">
                    <td className="py-4 px-4">
                      <div className="w-10 h-10 bg-[#181f30] rounded-lg flex items-center justify-center border border-[#252f48] overflow-hidden">
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-white">{product.title}</td>
                    <td className="py-4 px-4 text-gray-300">
                      {product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4 text-gray-300">{product.stock}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 bg-[#1c1b33] text-[#818cf8] border border-[#2e2d5c] text-xs font-medium rounded-md">
                        {product.category || 'general'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="px-3 py-1 bg-[#3b35a5] hover:bg-[#4842c4] text-white text-xs font-medium rounded-lg transition"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-[#991b1b] hover:bg-[#b91c1c] text-white text-xs font-medium rounded-lg transition"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    ไม่พบข้อมูลสินค้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
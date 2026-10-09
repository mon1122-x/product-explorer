'use client';

import React, { useState } from 'react';

interface ProductSearchFormProps {
  onSearch: (searchTerm: string) => void;
  onLimitChange?: (limit: number) => void;
  onSortChange?: (sortBy: string) => void;
}

export default function ProductSearchForm({ onSearch, onLimitChange, onSortChange }: ProductSearchFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('title');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="bg-[#121622] border border-[#1e2638] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl text-white">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
        {/* คำค้น */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">คำค้น</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(e.target.value);
            }}
            placeholder="ค้นหาชื่อสินค้า..."
            className="w-full bg-[#181f30] border border-[#252f48] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* จำนวนรายการ */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">จำนวนรายการ</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => {
              const val = Number(e.target.value);
              setLimit(val);
              onLimitChange?.(val);
            }}
            className="w-full bg-[#181f30] border border-[#252f48] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* เรียงตาม */}
        <div className="space-y-2 flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-300">เรียงตาม</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                onSortChange?.(e.target.value);
              }}
              className="w-full bg-[#181f30] border border-[#252f48] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="title" className="bg-[#181f30]">title</option>
              <option value="price" className="bg-[#181f30]">price</option>
              <option value="stock" className="bg-[#181f30]">stock</option>
            </select>
          </div>
          <button
            type="submit"
            className="self-end px-5 py-3 bg-[#1e2638] hover:bg-[#28324a] text-white font-medium rounded-xl text-sm transition border border-[#2e3b56]"
          >
            ค้นหา
          </button>
        </div>
      </form>
    </div>
  );
}
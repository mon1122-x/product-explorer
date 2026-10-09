import React from 'react';
import { auth } from '@/auth';
import { AuthButtons } from './auth-buttons';
import ClientProductPage from './ClientProductPage';

export default async function Page() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name;

  return (
    <main className="min-h-screen bg-[#0a0d12] text-white">
      {/* แถบเขียวด้านบน พร้อม AuthButtons มุมขวา (อิงสถานะจริงจากเซิร์ฟเวอร์) */}
      <nav className="bg-[#1b5e3a] py-4 px-6 text-center shadow-md flex justify-between items-center relative">
        <span className="text-base font-bold tracking-wide mx-auto">
          ระบบจัดการรายการสินค้า
        </span>
        <div className="absolute right-6 flex items-center gap-2">
          <AuthButtons isLoggedIn={isLoggedIn} userName={userName} />
        </div>
      </nav>

      {/* ส่วนจัดการสินค้าฝั่ง Client */}
      <ClientProductPage />
    </main>
  );
}
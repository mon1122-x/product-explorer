import type { Metadata } from "next";
import { Inter, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-noto-thai",
});

export const metadata: Metadata = {
  title: "ระบบจัดการรายการสินค้า",
  description: "Product Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`dark ${inter.variable} ${notoThai.variable}`}>
      <body
        className="min-h-screen bg-black text-gray-100 antialiased"
        style={{
          fontFamily:
            "var(--font-inter), var(--font-noto-thai), system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
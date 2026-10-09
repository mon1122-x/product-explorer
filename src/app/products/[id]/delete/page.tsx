import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { deleteProductAction } from "@/app/actions";

type DeleteProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DeleteProductPage({
  params,
}: DeleteProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const deleteProductWithId = deleteProductAction.bind(null, id);

  return (
    <main className="min-h-screen bg-[#0a0d12] text-white p-10 flex items-center justify-center">
      <div className="max-w-md w-full bg-[#1c1917] p-8 rounded-3xl border border-[#2b2622] shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-3 text-rose-500">ยืนยันการลบสินค้า</h1>
        <p className="text-sm text-stone-300 mb-6">
          คุณต้องการลบสินค้า <b className="text-white">"{product.title}"</b> ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
        </p>

        <form action={deleteProductWithId} className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-rose-700 py-3 text-xs font-bold text-white transition hover:bg-rose-600"
          >
            ยืนยันลบ
          </button>
          <Link
            href="/"
            className="flex-1 rounded-xl border border-[#3a342f] bg-[#26211e] py-3 text-xs font-medium text-stone-300 transition hover:bg-[#322c28]"
          >
            ยกเลิก
          </Link>
        </form>
      </div>
    </main>
  );
}
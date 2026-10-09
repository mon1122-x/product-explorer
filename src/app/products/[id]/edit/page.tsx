import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getProduct } from "@/lib/products";
import { updateProductAction } from "@/app/actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  // เติมคำว่า params ลงในช่องว่างตรงนี้
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const updateProductWithId = updateProductAction.bind(null, id);

  return (
    <main className="min-h-screen bg-[#0a0d12] text-white p-10">
      <div className="max-w-xl mx-auto bg-[#1c1917] p-8 rounded-3xl border border-[#2b2622] shadow-xl">
        <h1 className="text-2xl font-bold mb-6">แก้ไขสินค้า</h1>

        <form action={updateProductWithId} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1.5">
              ชื่อสินค้า
            </label>
            <input
              type="text"
              name="title"
              defaultValue={product.title}
              required
              className="w-full rounded-lg border border-[#2b2622] bg-[#120f0d] px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1.5">
                ราคา
              </label>
              <input
                type="number"
                name="price"
                step="any"
                defaultValue={product.price}
                required
                className="w-full rounded-lg border border-[#2b2622] bg-[#120f0d] px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1.5">
                จำนวน
              </label>
              <input
                type="number"
                name="stock"
                defaultValue={product.stock}
                required
                className="w-full rounded-lg border border-[#2b2622] bg-[#120f0d] px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-stone-400 mb-1.5">
              หมวดหมู่
            </label>
            <input
              type="text"
              name="category"
              defaultValue={product.category}
              required
              className="w-full rounded-lg border border-[#2b2622] bg-[#120f0d] px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-amber-500 py-3 text-xs font-bold text-black transition hover:bg-amber-400"
            >
              บันทึกการแก้ไข
            </button>
            <Link
              href="/"
              className="rounded-xl border border-[#3a342f] bg-[#26211e] px-5 py-3 text-xs font-medium text-stone-300 transition hover:bg-[#322c28]"
            >
              ยกเลิก
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
'use server';

import { auth, signIn, signOut } from "@/auth";
import { deleteProduct, updateProduct } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function handleSignIn() {
  await signIn("google", { redirectTo: "/" });
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}

async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function updateProductAction(id: string, formData: FormData) {
  // ตรวจสอบ session ก่อนอนุญาตให้แก้ไข
  await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const category = String(formData.get("category") ?? "").trim();

  await updateProduct(id, { title, price, stock, category });
  revalidatePath("/");
}

export async function deleteProductAction(id: string) {
  // ตรวจสอบ session ก่อนอนุญาตให้ลบ
  await requireUser();

  await deleteProduct(id);
  revalidatePath("/");
}

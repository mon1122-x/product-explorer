export interface Product {
  id: number | string;
  title: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

export type ProductFormData = Omit<Product, 'id' | 'image'>;

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch('https://dummyjson.com/products?limit=30');
    const data = await res.json();
    return data.products.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      stock: item.stock,
      category: item.category,
      image: item.thumbnail,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function updateProduct(id: string | number, data: Partial<Product>) {
  // โค้ดสำหรับอัปเดตสินค้า (ตามโจทย์ใบงาน)
}

export async function deleteProduct(id: string | number) {
  // โค้ดสำหรับลบสินค้า (ตามโจทย์ใบงาน)
}

export async function getProduct(id: string | number): Promise<Product | null> {
  const products = await fetchProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
}
import { writable } from "svelte/store";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  categoryId: number | null;
  featured: boolean;
  stock: number;
  createdAt: Date;
  barcode: string | null;
};

export const cartItems = writable([]);
export const cartTotal = writable("0.00");
export const itemsInCart = writable<Product[]>([]);

export async function refreshCart() {
  try {
    const response = await fetch("/api/cart");
    if (!response.ok) throw new Error("fetch failed");
    const data = await response.json();
    cartItems.set(data.items);
    cartTotal.set(data.cart?.totalAmount || "0.00");

    // Fetch product details for each cart item
    const productPromises = data.items.map((item: { productId: any }) =>
      fetch(`/api/products?id=${item.productId}`).then((res) => res.json())
    );
    const productDetails = await Promise.all(productPromises);
    itemsInCart.set(productDetails.filter(Boolean));
  } catch (error) {
    console.error("error fetching cart: ", error);
  }
}

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

import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import type { CartProducts } from "$lib/server/db/schema";

export const load: PageLoad = async ({ fetch, params }) => {
  const fetchProducts = async (id: string) => {
    const res = await fetch(`https://dummyjson.com/products/${id}`);

    if (!res.ok) {
      throw error(404, "Product not found");
    }

    const data = await res.json();
    return { data };
  };

  return {
    product: await fetchProducts(params.productID),
  };
};

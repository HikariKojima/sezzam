import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index";
import { products } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET({ url }) {
  try {
    const productId = url.searchParams.get("id");

    if (productId) {
      const product = await db
        .select()
        .from(products)
        .where(eq(products.id, parseInt(productId)))
        .then((res) => res[0]);

      if (!product) {
        return json({ error: "Product not found" }, { status: 404 });
      }
      return json(product);
    }
    const allProducts = await db.select().from(products);
    return json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

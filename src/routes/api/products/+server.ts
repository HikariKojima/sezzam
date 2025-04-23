import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index";
import { products } from "$lib/server/db/schema";

export async function GET() {
  try {
    const allProducts = await db.select().from(products);
    return json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

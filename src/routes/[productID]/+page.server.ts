import { error } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { products } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, parseInt(params.id)))
    .then((res) => res[0]);

  if (!product) {
    throw error(404, "Product not found");
  }

  return {
    product,
  };
};

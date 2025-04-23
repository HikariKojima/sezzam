import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index";
import { categories } from "$lib/server/db/schema";

export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return json(allCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

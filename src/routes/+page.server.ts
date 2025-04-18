import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import {
  validateSessionToken,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
} from "./api/auth";
import { db } from "$lib/server/db";
import { products } from "$lib/server/db/schema";

type newProduct = typeof products.$inferInsert;

export const load: PageServerLoad = async (event) => {
  const token = event.cookies.get("session") ?? null;
  if (token === null) {
    return new Response(null, {
      status: 401,
    });
  }
  const { session, user } = await validateSessionToken(token);
  if (session === null) {
    deleteSessionTokenCookie(event);
    return new Response(null, {
      status: 401,
    });
  }
  setSessionTokenCookie(event, token, session.expiresAt);
  return { user };
};

export const actions: Actions = {
  default: async (event) => {
    if (event.locals.user === null) {
      throw fail(401);
    }
  },

  createProduct: async ({ request }) => {
    const {
      name,
      description,
      price,
      imageID,
      categoryID,
      featured,
      stock,
      barcode,
    } = Object.fromEntries(await request.formData()) as unknown as {
      name: string;
      description: string;
      price: number;
      featured: boolean;
      categoryID: number;
      imageID: number;
      stock: number;
      barcode: string;
    };
    try {
      await db.insert(products).values({
        name: name,
        description: description,
        imageID: imageID,
        categoryID: categoryID,
        price: price,
        featured: featured,
        stock: stock,
        barcode: barcode,
      });
    } catch (err) {
      return fail(500, { message: "Could not create the article" });
    }
  },
};

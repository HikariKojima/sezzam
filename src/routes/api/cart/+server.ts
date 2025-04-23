import { json, type RequestEvent } from "@sveltejs/kit";
import { db } from "$lib/server/db/index";
import { cartProducts, cart } from "$lib/server/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function GET({ url }: RequestEvent) {
  try {
    const cartID = url.searchParams.get("id");
    if (!cartID) {
      return json({ error: "Cart ID is required" }, { status: 400 });
    }
    const cartItems = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, cartID), eq(cart.status, "active")));
    return json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return json({ error: "Failed to fetch cart items" }, { status: 500 });
  }
}

export async function POST({ request }: RequestEvent) {
  try {
    const body = await request.json();
    const { productID, quantity } = body;

    if (!productID || !quantity) {
      return json(
        { error: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    let userCart = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, body.userId), eq(cart.status, "active")));

    let cartID;
    if (!userCart.length) {
      const newCart = await db
        .insert(cart)
        .values({
          userId: body.userId,
          totalAmount: body.totalAmount,
          shippingAdress: body.shippingAdress || "pickup",
          typeOfPayment: body.typeOfPayment,
          phoneNumber: body.phoneNumber || "",
          status: "active",
        })
        .returning();

      cartID = newCart[0].id;
    } else {
      cartID = userCart[0].id;
    }

    const cartItem = await db
      .insert(cartProducts)
      .values({
        cartId: cartID,
        productId: productID,
        quantity: quantity,
        price: body.price,
      })
      .returning();

    return json(cartItem);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return json({ error: "Failed to add product to cart" }, { status: 500 });
  }
}

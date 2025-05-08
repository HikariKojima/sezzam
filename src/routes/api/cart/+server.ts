import { json, type RequestEvent } from "@sveltejs/kit";
import { db } from "$lib/server/db/index";
import { cartProducts, cart } from "$lib/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET({ locals }: RequestEvent) {
  try {
    const session = locals.session;
    if (!session) {
      return json({ error: "Session not found" }, { status: 401 });
    }
    const userCart = await db
      .select()
      .from(cart)
      .where(and(eq(cart.sessionId, session.id), eq(cart.status, "active")));

    if (!userCart.length) {
      return json({ items: [] });
    }

    const cartItems = await db
      .select()
      .from(cartProducts)
      .where(eq(cartProducts.cartId, userCart[0].id));
    return json({
      cart: userCart[0],
      items: cartItems,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return json({ error: "Failed to fetch cart items" }, { status: 500 });
  }
}

export async function POST({ locals, request }: RequestEvent) {
  try {
    const session = locals.session;

    if (!session) {
      return json({ error: "Session not found" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity, price } = body;

    if (!productId || !quantity) {
      return json(
        { error: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    let userCart = await db
      .select()
      .from(cart)
      .where(and(eq(cart.sessionId, session.id), eq(cart.status, "active")));

    let cartId;
    if (!userCart.length) {
      const newCart = await db
        .insert(cart)
        .values({
          sessionId: session.id,
          totalAmount: (price * quantity).toString(),
          typeOfPayment: "pending",
          phoneNumber: "pending",
        })
        .returning();

      cartId = newCart[0].id;
    } else {
      cartId = userCart[0].id;
    }

    const cartItem = await db
      .insert(cartProducts)
      .values({
        cartId,
        productId,
        quantity,
        price,
      })
      .returning();

    return json(cartItem);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return json({ error: "Failed to add product to cart" }, { status: 500 });
  }
}

export async function DELETE({ locals }: RequestEvent) {
  try {
    const session = locals.session;
    if (!session) {
      return json({ error: "Session not found" }, { status: 401 });
    }

    return await db.transaction(async (tx) => {
      const userCart = await db
        .select()
        .from(cart)
        .where(and(eq(cart.sessionId, session.id), eq(cart.status, "active")));
      if (!userCart.length) {
        return json(
          { error: "No active cart found for this user" },
          { status: 404 }
        );
      }
      await tx
        .delete(cartProducts)
        .where(eq(cartProducts.cartId, userCart[0].id));

      await tx
        .update(cart)
        .set({
          totalAmount: (0.0).toString(),
          status: "cleared",
          updatedAt: new Date(),
        })
        .where(eq(cart.id, userCart[0].id));
      return json({
        message: "Cart cleared successfully",
        cartId: userCart[0].id,
      });
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return json({ error: "Failed to clear cart" }, { status: 500 });
  }
}

export async function PATCH({ locals, request }: RequestEvent) {
  try {
    const session = locals.session;

    if (!session) {
      return json({ error: "Session not found" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity, price } = body;

    if (!productId || !quantity) {
      return json(
        { error: "Product ID and quantity are required" },
        { status: 400 }
      );
    }

    return await db.transaction(async (tx) => {
      const userCart = await tx
        .select()
        .from(cart)
        .where(and(eq(cart.sessionId, session.id), eq(cart.status, "active")));

      if (!userCart.length) {
        return json({ error: "No active cart found" }, { status: 404 });
      }

      const existingProduct = await tx
        .select()
        .from(cartProducts)
        .where(
          and(
            eq(cartProducts.cartId, userCart[0].id),
            eq(cartProducts.productId, productId)
          )
        );

      if (!existingProduct.length) {
        return json({ error: "Product not found in cart" }, { status: 404 });
      }

      const priceDifference =
        (quantity - existingProduct[0].quantity) *
        Number(existingProduct[0].price);

      await tx
        .update(cartProducts)
        .set({ quantity: quantity })
        .where(
          and(
            eq(cartProducts.cartId, userCart[0].id),
            eq(cartProducts.productId, productId)
          )
        );

      const newTotal = (
        Number(userCart[0].totalAmount) + priceDifference
      ).toFixed(2);

      await tx
        .update(cart)
        .set({ updatedAt: new Date(), totalAmount: newTotal })
        .where(eq(cart.id, userCart[0].id));

      const updatedCart = await tx
        .select()
        .from(cart)
        .where(eq(cart.id, userCart[0].id));

      const updatedItems = await tx
        .select()
        .from(cartProducts)
        .where(eq(cartProducts.cartId, userCart[0].id));
      return json({
        message: "Cart updated successfully",
        cart: updatedCart[0],
        items: updatedItems,
      });
    });
  } catch (error) {
    console.log("Error updating cart:", error);
    return json({ error: "Failed to update caert" }, { status: 500 });
  }
}

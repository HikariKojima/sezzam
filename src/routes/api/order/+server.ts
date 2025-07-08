import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db/index";
import { eq, and } from "drizzle-orm";
import { cart } from "$lib/server/db/schema";
import type { RequestEvent } from "./$types";

export async function POST({ locals, request }: RequestEvent) {
  try {
    const session = locals.session;

    if (!session) {
      return json({ error: "Session not foubnd" }, { status: 401 });
    }
    const body = await request.json();
    const { notes, address, typeOfPayment } = body;

    return await db.transaction(async (tx) => {
      const userCart = await tx
        .select()
        .from(cart)
        .where(and(eq(cart.sessionId, session.id), eq(cart.status, "active")));
      if (!userCart.length) {
        return json({ error: "No active cart found" }, { status: 404 });
      }

      await tx
        .update(cart)
        .set({
          updatedAt: new Date(),
          shippingAdress: address,
          notes: notes,
          typeOfPayment: typeOfPayment,
          status: "ordered",
        })
        .where(eq(cart.sessionId, session.id));
      return json({
        message: "order placed succesfully",
      });
    });
  } catch (error) {
    console.log("error:", error);
    return json({ error: "order failed" }, { status: 500 });
  }
}

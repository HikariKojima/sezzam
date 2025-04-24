import type { RequestEvent } from "@sveltejs/kit";
import { db } from "../../../lib/server/db/index";
import {
  products,
  categories,
  cart,
  cartProducts,
  customersTable,
} from "../../../lib/server/db/schema";

export async function POST() {
  try {
    // Insert categories first since products depend on them
    const createdCategories = await db
      .insert(categories)
      .values([
        {
          name: "Tile",
          image: "/images/tiles.jpg",
          slug: "tiles",
        },
        {
          name: "Floor",
          image: "/images/floors.jpg",
          slug: "floors",
        },
        {
          name: "Bath",
          image: "/images/bath.jpg",
          slug: "bath",
        },
      ])
      .returning();

    // Insert products
    const createdProducts = await db
      .insert(products)
      .values([
        {
          name: "Ceramic Tile",
          description: "Beautiful ceramic tile for your bathroom",
          price: "29.99",
          categoryId: createdCategories[0].id,
          featured: true,
          stock: 100,
          barcode: "1234567890",
        },
        {
          name: "Wooden Floor",
          description: "Premium wooden flooring",
          price: "89.99",
          categoryId: createdCategories[1].id,
          featured: true,
          stock: 50,
          barcode: "0987654321",
        },
      ])
      .returning();

    // Insert customers
    const createdCustomers = await db
      .insert(customersTable)
      .values([
        {
          username: "john_doe",
          email: "john@example.com",
          passwordHash: "hashed_password_1",
          firstName: "John",
          lastName: "Doe",
        },
        {
          username: "jane_smith",
          email: "jane@example.com",
          passwordHash: "hashed_password_2",
          firstName: "Jane",
          lastName: "Smith",
        },
      ])
      .returning();

    // Insert carts
    const createdCarts = await db
      .insert(cart)
      .values([
        {
          userId: createdCustomers[0].id.toString(),
          totalAmount: "119.96",
          status: "active",
          typeOfPayment: "credit_card",
          phoneNumber: "123-456-7890",
          shippingAdress: "123 Main St",
        },
      ])
      .returning();

    // Insert cart products
    await db
      .insert(cartProducts)
      .values([
        {
          cartId: createdCarts[0].id,
          productId: createdProducts[0].id,
          quantity: 2,
          price: "29.99",
        },
        {
          cartId: createdCarts[0].id,
          productId: createdProducts[1].id,
          quantity: 1,
          price: "89.99",
        },
      ])
      .returning();

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

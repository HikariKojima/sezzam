import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  decimal,
  primaryKey,
  index,
  check,
  uniqueIndex,
  numeric,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

export const customers = pgTable(
  "customers",
  {
    id: text("id").primaryKey(),
    username: text("username").unique(),
    email: text("email").unique(),
    passwordHash: text("password_hash"),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => [
    index("name_idx").on(table.username),
    uniqueIndex("email_idx").on(table.email),
  ]
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    description: text("description").notNull(),
    price: decimal("price", { precision: 12, scale: 2 })
      .notNull()
      .$type<number>(),
    categoryID: integer("category_id")
      .notNull()
      .references(() => categories.id),
    featured: boolean("featured").notNull(),
    stock: integer("stock").notNull(),
    createdAtPro: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .notNull()
      .defaultNow(),
    barcode: text("barcode").unique(),
  },
  (table) => [
    check("stock_check", sql`${table.stock} > 0`),
    check("price_check", sql`${table.price} > 0`),
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    parentID: integer("parent_id").references((): AnyPgColumn => categories.id),
    imageURL: text("image").notNull(),
    slug: text("slug").notNull().unique(),
  },
  (table) => [check("no_circle", sql`${table.id} <> ${table.parentID}`)]
);

export const productCategories = pgTable("product_categories", {
  productID: integer("product_id")
    .notNull()
    .references(() => products.id),
  categoryID: integer("category_id")
    .notNull()
    .references(() => categories.id),
});

export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  customerID: text("customer_id")
    .notNull()
    .references(() => customers.id),
  createdAtCart: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }),
  totalAmount: numeric("total_amount", {
    precision: 12,
    scale: 2,
  }).notNull(),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  shippingAdress: text("shipping_adress").notNull(),
  typeOfPayment: text("type_of_payment").notNull(),
  phoneNumber: text("phone_number").notNull(),
});

export const cartProducts = pgTable(
  "cart_products",
  {
    cartID: integer("cart_id")
      .notNull()
      .references(() => cart.id),
    productID: integer("product_id")
      .notNull()
      .references(() => products.id),
    quantity: integer("quantity").notNull(),
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.cartID, table.productID] })]
);

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productID: integer("product_id").references(() => products.id),
  url: text("url").notNull(),
  altText: text("alt_text"),
  isCoverImage: boolean("is_cover_image").notNull().default(false),
});

export type Product = typeof products.$inferSelect;
export type Categories = typeof categories.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Cart = typeof cart.$inferSelect;
export type CartProduct = typeof cartProducts.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;

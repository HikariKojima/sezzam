import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  decimal,
  primaryKey,
} from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
  id: text("id").primaryKey(),
  username: text("username").unique(),
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  createdAtCus: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  isRegistered: boolean("is_registedred").notNull().default(false),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  cartID: integer("cart_id")
    .notNull()
    .references(() => cart.id)
    .unique(),
  userID: text("user_id").default("guest"),
  customerEmail: text("customer_email").notNull(),
  orderDate: timestamp("order_date", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("processing"),
  shippingAdress: text("shipping_adress").notNull(),
  typeOfPayment: text("type_of_payment").notNull(),
  phoneNumber: text("phone_number").notNull(),
});

export const cart = pgTable("cart", {
  id: serial("id").primaryKey(),
  customerID: text("customer_id")
    .notNull()
    .references(() => customers.id),
  sessionID: text("session_id").references(() => session.id),
  createdAtCart: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }),
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("active"),
  product_id: integer("product_id")
    .notNull()
    .references(() => products.id),
});

export const products = pgTable("products", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  imageID: integer("image_id").notNull(),
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
  },
  (table) => [primaryKey({ columns: [table.cartID, table.productID] })]
);

export const categories = pgTable("categories", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  imageURL: text("image").notNull(),
  slug: text("slug").notNull().unique(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userID: text("user_id")
    .notNull()
    .references(() => customers.id),
  expiresAt: timestamp("expiresAt", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  lastActivity: timestamp("lastActivity", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const orderStatusHistory = pgTable("order_status_history", {
  id: serial("id").primaryKey(),
  orderID: integer("order_id").references(() => orders.id),
  status: text("status").notNull(),
  changedAt: timestamp("changed_at", {
    withTimezone: true,
    mode: "date",
  }).defaultNow(),
  notes: text("notes").notNull(),
});

export const productImages = pgTable("product_images", {
  id: serial("id").primaryKey(),
  productID: integer("product_id").references(() => products.id),
  url: text("url").notNull(),
  altText: text("alt_text"),
  isCoverImage: boolean("is_cover_image").notNull().default(false),
});

export type Session = typeof session.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Categories = typeof categories.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Cart = typeof cart.$inferSelect;
export type CartProduct = typeof cartProducts.$inferSelect;
export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;

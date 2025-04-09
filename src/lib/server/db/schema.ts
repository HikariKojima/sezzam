import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  age: integer("age"),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const categories = pgTable("categories", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userID: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: timestamp("expiresAt", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
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
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .notNull()
    .defaultNow(),
});

export type Session = typeof session.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Categories = typeof categories.$inferSelect;
export type User = typeof user.$inferSelect;

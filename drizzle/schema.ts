import { pgTable, serial, text, timestamp, numeric, foreignKey, integer, unique, check, uniqueIndex, index, boolean, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const cart = pgTable("cart", {
	id: serial().primaryKey().notNull(),
	userId: text("user_id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	totalAmount: numeric("total_amount", { precision: 12, scale:  2 }).notNull(),
	status: text().default('active').notNull(),
	notes: text(),
	shippingAdress: text("shipping_adress"),
	typeOfPayment: text("type_of_payment").notNull(),
	phoneNumber: text("phone_number").notNull(),
	sessionId: text("session_id").notNull(),
});

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	customerId: integer("customer_id"),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "session_customer_id_customers_id_fk"
		}),
]);

export const productCategories = pgTable("product_categories", {
	productId: integer("product_id").notNull(),
	categoryId: integer("category_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_categories_product_id_products_id_fk"
		}),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "product_categories_category_id_categories_id_fk"
		}),
]);

export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	image: text().notNull(),
	slug: text().notNull(),
	parentId: integer("parent_id"),
}, (table) => [
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "categories_parent_id_categories_id_fk"
		}),
	unique("categories_slug_unique").on(table.slug),
	check("no_circle", sql`id <> parent_id`),
]);

export const customers = pgTable("customers", {
	id: serial().primaryKey().notNull(),
	username: text(),
	email: text(),
	passwordHash: text("password_hash"),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
}, (table) => [
	uniqueIndex("email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")),
	index("name_idx").using("btree", table.username.asc().nullsLast().op("text_ops")),
	unique("customers_username_unique").on(table.username),
	unique("customers_email_unique").on(table.email),
]);

export const productImages = pgTable("product_images", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id"),
	url: text().notNull(),
	altText: text("alt_text"),
	isCoverImage: boolean("is_cover_image").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_images_product_id_products_id_fk"
		}),
]);

export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	price: numeric({ precision: 12, scale:  2 }).notNull(),
	categoryId: integer("category_id"),
	featured: boolean().notNull(),
	stock: integer().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	barcode: text(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "products_category_id_categories_id_fk"
		}),
	unique("products_name_unique").on(table.name),
	unique("products_barcode_unique").on(table.barcode),
	check("stock_check", sql`stock > 0`),
	check("price_check", sql`price > (0)::numeric`),
]);

export const cartProducts = pgTable("cart_products", {
	cartId: integer("cart_id").notNull(),
	productId: integer("product_id").notNull(),
	quantity: integer().notNull(),
	price: numeric({ precision: 12, scale:  2 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.cartId],
			foreignColumns: [cart.id],
			name: "cart_products_cart_id_cart_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "cart_products_product_id_products_id_fk"
		}),
	primaryKey({ columns: [table.cartId, table.productId], name: "cart_products_cart_id_product_id_pk"}),
]);

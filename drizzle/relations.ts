import { relations } from "drizzle-orm/relations";
import { customers, session, products, productCategories, categories, productImages, cart, cartProducts } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	customer: one(customers, {
		fields: [session.customerId],
		references: [customers.id]
	}),
}));

export const customersRelations = relations(customers, ({many}) => ({
	sessions: many(session),
}));

export const productCategoriesRelations = relations(productCategories, ({one}) => ({
	product: one(products, {
		fields: [productCategories.productId],
		references: [products.id]
	}),
	category: one(categories, {
		fields: [productCategories.categoryId],
		references: [categories.id]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	productCategories: many(productCategories),
	productImages: many(productImages),
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	cartProducts: many(cartProducts),
}));

export const categoriesRelations = relations(categories, ({one, many}) => ({
	productCategories: many(productCategories),
	category: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: "categories_parentId_categories_id"
	}),
	categories: many(categories, {
		relationName: "categories_parentId_categories_id"
	}),
	products: many(products),
}));

export const productImagesRelations = relations(productImages, ({one}) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id]
	}),
}));

export const cartProductsRelations = relations(cartProducts, ({one}) => ({
	cart: one(cart, {
		fields: [cartProducts.cartId],
		references: [cart.id]
	}),
	product: one(products, {
		fields: [cartProducts.productId],
		references: [products.id]
	}),
}));

export const cartRelations = relations(cart, ({many}) => ({
	cartProducts: many(cartProducts),
}));
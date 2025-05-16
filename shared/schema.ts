import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Product model
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Store model
export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  website: text("website").notNull(),
});

// ProductPrice model
export const productPrices = pgTable("product_prices", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  storeId: integer("store_id").notNull(),
  price: integer("price").notNull(), // in cents
  originalPrice: integer("original_price"), // in cents
  discount: integer("discount"), // percentage
  rating: integer("rating"), // out of 5, multiplied by 10 (e.g. 4.5 = 45)
  reviewCount: integer("review_count").default(0),
  url: text("url").notNull(),
  inStock: boolean("in_stock").default(true),
  offers: jsonb("offers").$type<string[]>().default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// SearchHistory model
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  query: text("query").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  description: true,
  imageUrl: true,
  category: true,
});

export const insertStoreSchema = createInsertSchema(stores).pick({
  name: true,
  logoUrl: true,
  website: true,
});

export const insertProductPriceSchema = createInsertSchema(productPrices).pick({
  productId: true,
  storeId: true,
  price: true,
  originalPrice: true,
  discount: true,
  rating: true,
  reviewCount: true,
  url: true,
  inStock: true,
  offers: true,
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).pick({
  userId: true,
  query: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

export type InsertProductPrice = z.infer<typeof insertProductPriceSchema>;
export type ProductPrice = typeof productPrices.$inferSelect;

export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;

// Combined product and price data
export type ProductWithPrices = Product & {
  prices: (ProductPrice & { 
    store: Store;
    deliveryDays?: string;
  })[];
};

import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  imageUrl: text("image_url").notNull(),
  imageUrls: text("image_urls").array().default([]),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  stock: integer("stock").notNull().default(0),
  isActive: boolean("is_active").default(true),
  tags: text("tags").array().default([]),
  sizes: text("sizes").array().default([]),
  colors: text("colors").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone"),
  shippingAddress: text("shipping_address").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  items: text("items").notNull(), // JSON string of cart items
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

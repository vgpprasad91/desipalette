import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { hasShopifyCredentials } from "./shopify-service";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products with optional filtering
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      const products = await storage.getProducts(
        category && typeof category === "string" ? category : undefined,
        search && typeof search === "string" ? search : undefined
      );
      
      // Add Shopify status to response
      res.json({
        products,
        shopifyEnabled: hasShopifyCredentials(),
        source: hasShopifyCredentials() ? 'shopify' : 'mock'
      });
    } catch (error) {
      console.error('Products fetch error:', error);
      res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json({
        ...order,
        shopifyEnabled: hasShopifyCredentials(),
        source: 'internal'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error('Order creation error:', error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Create Shopify checkout
  app.post("/api/shopify/checkout", async (req, res) => {
    try {
      if (!hasShopifyCredentials()) {
        return res.status(400).json({ 
          message: "Shopify integration not configured",
          shopifyEnabled: false 
        });
      }

      const { customerInfo, cartItems } = req.body;
      
      if (!customerInfo || !cartItems || !Array.isArray(cartItems)) {
        return res.status(400).json({ message: "Missing required fields: customerInfo and cartItems" });
      }

      const orderData = {
        customerEmail: customerInfo.email,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || '',
        shippingAddress: customerInfo.address,
        totalAmount: '0', // Will be calculated by Shopify
        items: JSON.stringify(cartItems),
        status: 'pending',
      };

      const checkout = await storage.createShopifyCheckout!(orderData, cartItems);
      
      res.status(201).json({
        success: true,
        checkoutUrl: checkout.checkoutUrl,
        checkoutId: checkout.checkoutId,
        shopifyEnabled: true
      });
    } catch (error) {
      console.error('Shopify checkout creation error:', error);
      res.status(500).json({ 
        message: "Failed to create Shopify checkout", 
        error: error.message,
        shopifyEnabled: hasShopifyCredentials()
      });
    }
  });

  // Get Shopify status
  app.get("/api/shopify/status", (req, res) => {
    res.json({
      shopifyEnabled: hasShopifyCredentials(),
      storeConfigured: Boolean(process.env.SHOPIFY_STORE_URL),
      tokenConfigured: Boolean(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN)
    });
  });

  // Get order
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

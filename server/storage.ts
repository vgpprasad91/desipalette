import { type Product, type InsertProduct, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  
  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.seedProducts();
  }

  private seedProducts() {
    const seedProducts: InsertProduct[] = [
      {
        name: "Embroidered Silk Kurta",
        description: "Premium silk kurta with intricate embroidery work. Perfect for special occasions and cultural celebrations. Features comfortable fit and elegant design that blends traditional craftsmanship with modern style.",
        price: "89.99",
        originalPrice: "119.99",
        category: "Women",
        subcategory: "Ethnic Wear",
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        imageUrls: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
        ],
        rating: "4.8",
        reviewCount: 124,
        stock: 15,
        tags: ["new", "ethnic", "silk"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Red", "Blue", "Green", "Purple"]
      },
      {
        name: "Contemporary Fusion Dress",
        description: "Modern fusion dress that combines traditional elements with contemporary design. Perfect for both casual and semi-formal occasions.",
        price: "124.99",
        category: "Women",
        subcategory: "Western Wear",
        imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        imageUrls: [
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
        ],
        rating: "4.6",
        reviewCount: 89,
        stock: 12,
        tags: ["fusion", "dress"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Black", "Navy", "Maroon"]
      },
      {
        name: "Premium Leather Handbag",
        description: "Handcrafted leather handbag with premium quality materials. Features multiple compartments and elegant design.",
        price: "159.99",
        originalPrice: "199.99",
        category: "Accessories",
        subcategory: "Bags",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        imageUrls: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
        ],
        rating: "4.9",
        reviewCount: 156,
        stock: 8,
        tags: ["sale", "leather", "premium"],
        colors: ["Brown", "Black", "Tan"]
      },
      {
        name: "Contemporary Casual Shirt",
        description: "Modern casual shirt with premium fabric and contemporary cut. Perfect for everyday wear and casual occasions.",
        price: "79.99",
        category: "Men",
        subcategory: "Casual Wear",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        imageUrls: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600"
        ],
        rating: "4.7",
        reviewCount: 92,
        stock: 20,
        tags: ["casual", "shirt"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Blue", "Black", "Gray"]
      },
      {
        name: "Designer Evening Gown",
        description: "Elegant evening gown with sophisticated design and premium materials. Perfect for formal events and special occasions.",
        price: "299.99",
        category: "Women",
        subcategory: "Formal Wear",
        imageUrl: "https://images.unsplash.com/photo-1566479179817-c39c6fdc35bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        rating: "4.9",
        reviewCount: 67,
        stock: 5,
        tags: ["formal", "evening", "designer"],
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "Navy", "Burgundy"]
      },
      {
        name: "Artisan Jewelry Set",
        description: "Handcrafted jewelry set featuring traditional designs with modern appeal. Includes necklace and earrings.",
        price: "89.99",
        category: "Accessories",
        subcategory: "Jewelry",
        imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
        rating: "4.8",
        reviewCount: 134,
        stock: 25,
        tags: ["artisan", "jewelry", "handcrafted"],
        colors: ["Gold", "Silver", "Rose Gold"]
      }
    ];

    seedProducts.forEach(product => {
      const id = randomUUID();
      const fullProduct: Product = {
        ...product,
        id,
        isActive: true,
        createdAt: new Date(),
      };
      this.products.set(id, fullProduct);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      p => p.isActive && p.category.toLowerCase() === category.toLowerCase()
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(p => 
      p.isActive && (
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.description.toLowerCase().includes(lowercaseQuery) ||
        p.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      ...insertProduct,
      id,
      isActive: true,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }
}

export const storage = new MemStorage();

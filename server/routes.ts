import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertProductSchema, insertOrderSchema, insertOrderItemSchema, insertCategorySchema, type Product } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Set up multer for image uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage_multer });

function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Serve uploaded images
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  }, express.static(uploadDir));

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", requireAdmin, async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category } = req.query;
      let products: Product[];
      if (category) {
        const cat = await storage.getCategoryBySlug(category as string);
        if (cat) {
          products = await storage.getProductsByCategory(cat.id);
        } else {
          products = [];
        }
      } else {
        products = await storage.getProducts();
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

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

  app.post("/api/products", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      const productData = {
        ...req.body,
        price: req.body.price.toString(),
        quantity: parseInt(req.body.quantity),
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null
      };
      
      const validatedData = insertProductSchema.parse(productData);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      const updateData: any = {
        ...req.body,
      };
      
      if (req.body.price) updateData.price = req.body.price.toString();
      if (req.body.quantity) updateData.quantity = parseInt(req.body.quantity);
      if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

      const product = await storage.updateProduct(req.params.id, updateData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Order routes
  app.get("/api/orders", requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", requireAdmin, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      const orderItems = await storage.getOrderItems(order.id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const { customerEmail, customerName, items, totalAmount } = req.body;
      
      const orderData = insertOrderSchema.parse({
        customerEmail,
        customerName,
        totalAmount: totalAmount.toString(),
        status: "pending"
      });

      const order = await storage.createOrder(orderData);

      // Create order items
      for (const item of items) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price.toString()
        });

        // Update product quantity
        const product = await storage.getProduct(item.productId);
        if (product && product.quantity >= item.quantity) {
          await storage.updateProduct(item.productId, {
            quantity: product.quantity - item.quantity
          });
        }
      }

      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.put("/api/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

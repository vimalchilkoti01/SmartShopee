// server/index.ts
import dotenv from "dotenv";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/services/priceComparison.ts
async function getProductPrices(query) {
  console.log(`Searching for prices for: ${query}`);
  return [];
}

// server/storage.ts
var MemStorage = class {
  users;
  products;
  stores;
  productPrices;
  searchHistories;
  currentUserId;
  currentProductId;
  currentStoreId;
  currentProductPriceId;
  currentSearchHistoryId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.stores = /* @__PURE__ */ new Map();
    this.productPrices = /* @__PURE__ */ new Map();
    this.searchHistories = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentStoreId = 1;
    this.currentProductPriceId = 1;
    this.currentSearchHistoryId = 1;
    this.initDemoStores();
  }
  initDemoStores() {
    const demoStores = [
      { name: "Amazon", logoUrl: "", website: "https://amazon.com" },
      { name: "Flipkart", logoUrl: "", website: "https://flipkart.com" },
      { name: "Myntra", logoUrl: "", website: "https://myntra.com" },
      { name: "Croma", logoUrl: "", website: "https://croma.com" },
      { name: "Reliance Digital", logoUrl: "", website: "https://reliancedigital.in" }
    ];
    demoStores.forEach((store) => this.createStore(store));
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const now = /* @__PURE__ */ new Date();
    const user = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  // Product methods
  async getProduct(id) {
    return this.products.get(id);
  }
  async getProductsByName(name) {
    const lowerName = name.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => product.name.toLowerCase().includes(lowerName)
    );
  }
  async createProduct(insertProduct) {
    const id = this.currentProductId++;
    const now = /* @__PURE__ */ new Date();
    const product = {
      ...insertProduct,
      id,
      createdAt: now,
      description: insertProduct.description ?? null,
      imageUrl: insertProduct.imageUrl ?? null,
      category: insertProduct.category ?? null
    };
    this.products.set(id, product);
    return product;
  }
  // Store methods
  async getStore(id) {
    return this.stores.get(id);
  }
  async getStoreByName(name) {
    return Array.from(this.stores.values()).find(
      (store) => store.name === name
    );
  }
  async getAllStores() {
    return Array.from(this.stores.values());
  }
  async createStore(insertStore) {
    const id = this.currentStoreId++;
    const store = {
      ...insertStore,
      id,
      logoUrl: insertStore.logoUrl ?? null
    };
    this.stores.set(id, store);
    return store;
  }
  // ProductPrice methods
  async getProductPrice(id) {
    return this.productPrices.get(id);
  }
  async getProductPricesByProductId(productId) {
    return Array.from(this.productPrices.values()).filter((price) => price.productId === productId).map((price) => {
      const store = this.stores.get(price.storeId);
      if (!store) throw new Error(`Store with id ${price.storeId} not found`);
      return { ...price, store };
    });
  }
  async createProductPrice(insertProductPrice) {
    const id = this.currentProductPriceId++;
    const now = /* @__PURE__ */ new Date();
    const productPrice = {
      ...insertProductPrice,
      id,
      updatedAt: now,
      originalPrice: insertProductPrice.originalPrice ?? null,
      discount: insertProductPrice.discount ?? null,
      rating: insertProductPrice.rating ?? null,
      reviewCount: insertProductPrice.reviewCount ?? null,
      inStock: insertProductPrice.inStock ?? null,
      offers: Array.isArray(insertProductPrice.offers) && insertProductPrice.offers.every((x) => typeof x === "string") ? insertProductPrice.offers : null
    };
    this.productPrices.set(id, productPrice);
    return productPrice;
  }
  // Search methods
  async searchProducts(query) {
    try {
      const priceData = await getProductPrices(query);
      if (priceData.length === 0) {
        const matchedProducts = await this.getProductsByName(query);
        if (matchedProducts.length === 0 && query.trim() !== "") {
          const demoProduct = await this.createDemoProduct(query);
          matchedProducts.push(demoProduct);
        }
        return Promise.all(
          matchedProducts.map(async (product2) => {
            const prices2 = await this.getProductPricesByProductId(product2.id);
            return { ...product2, prices: prices2 };
          })
        );
      }
      const product = await this.createProduct({
        name: query,
        description: `Search results for ${query}`,
        imageUrl: null,
        category: "Electronics"
      });
      const prices = await Promise.all(
        priceData.map(async (price) => {
          let store = await this.getStoreByName(price.store);
          if (!store) {
            store = await this.createStore({
              name: price.store,
              logoUrl: null,
              website: `https://${price.store.toLowerCase().replace(/\s+/g, "")}.com`
            });
          }
          return this.createProductPrice({
            productId: product.id,
            storeId: store.id,
            price: price.price,
            originalPrice: price.originalPrice || null,
            discount: null,
            rating: price.rating || null,
            reviewCount: price.reviewCount || null,
            url: price.url,
            inStock: true,
            offers: []
          });
        })
      );
      return [{
        ...product,
        prices: prices.map((price) => ({
          ...price,
          store: this.stores.get(price.storeId),
          deliveryDays: priceData.find((p) => p.store === this.stores.get(price.storeId).name)?.deliveryDays
        }))
      }];
    } catch (error) {
      console.error("Error in searchProducts:", error);
      const matchedProducts = await this.getProductsByName(query);
      if (matchedProducts.length === 0 && query.trim() !== "") {
        const demoProduct = await this.createDemoProduct(query);
        matchedProducts.push(demoProduct);
      }
      return Promise.all(
        matchedProducts.map(async (product) => {
          const prices = await this.getProductPricesByProductId(product.id);
          return { ...product, prices };
        })
      );
    }
  }
  async createDemoProduct(query) {
    const product = await this.createProduct({
      name: query,
      description: `Demo product for ${query}`,
      imageUrl: "",
      category: "Electronics"
    });
    const stores = await this.getAllStores();
    let basePrice = 0;
    if (query.toLowerCase().includes("iphone 14 pro")) {
      basePrice = 11599e3;
    } else if (query.toLowerCase().includes("iphone 14")) {
      basePrice = 6999e3;
    } else if (query.toLowerCase().includes("iphone 15 pro")) {
      basePrice = 1299e4;
    } else if (query.toLowerCase().includes("iphone 15")) {
      basePrice = 7999e3;
    } else if (query.toLowerCase().includes("samsung s23 ultra")) {
      basePrice = 10499900;
    } else if (query.toLowerCase().includes("samsung s23")) {
      basePrice = 7499900;
    } else if (query.toLowerCase().includes("samsung s24 ultra")) {
      basePrice = 12999900;
    } else if (query.toLowerCase().includes("samsung s24")) {
      basePrice = 8499900;
    } else if (query.toLowerCase().includes("google pixel 8 pro")) {
      basePrice = 9299900;
    } else if (query.toLowerCase().includes("google pixel 8")) {
      basePrice = 6999900;
    } else if (query.toLowerCase().includes("playstation 5")) {
      basePrice = 5499900;
    } else if (query.toLowerCase().includes("xbox series x")) {
      basePrice = 5499900;
    } else if (query.toLowerCase().includes("macbook air")) {
      basePrice = 9999e3;
    } else if (query.toLowerCase().includes("macbook pro")) {
      basePrice = 16999e3;
    } else if (query.toLowerCase().includes("dell xps")) {
      basePrice = 12999e3;
    } else if (query.toLowerCase().includes("lg oled")) {
      basePrice = 13999e3;
    } else if (query.toLowerCase().includes("sony bravia")) {
      basePrice = 11999e3;
    } else if (query.toLowerCase().includes("samsung qled")) {
      basePrice = 9999e3;
    } else if (query.toLowerCase().includes("tv") || query.toLowerCase().includes("television")) {
      basePrice = 5499900;
    } else if (query.toLowerCase().includes("airpods pro")) {
      basePrice = 2499900;
    } else if (query.toLowerCase().includes("sony wh-1000xm5")) {
      basePrice = 2999900;
    } else if (query.toLowerCase().includes("headphone") || query.toLowerCase().includes("earbuds")) {
      basePrice = 1499900;
    } else {
      basePrice = 4999900;
    }
    const includedStores = stores.filter(
      (store) => ["Amazon", "Flipkart", "Croma", "Reliance Digital"].includes(store.name)
    );
    await Promise.all(includedStores.map(async (store, index) => {
      let storePrice = basePrice;
      let deliveryDays = "2-3 days";
      let storeSpecificOffers = [];
      if (store.name === "Amazon") {
        storePrice = basePrice - Math.floor(basePrice * 0.02);
        deliveryDays = "1-2 days";
        storeSpecificOffers = [
          "10% Instant Discount with HDFC Credit Cards",
          "No-Cost EMI on 6 months",
          "Prime delivery available"
        ];
      } else if (store.name === "Flipkart") {
        storePrice = basePrice - Math.floor(basePrice * 0.03);
        deliveryDays = "2-3 days";
        storeSpecificOffers = [
          "Extra 5% off with Flipkart Axis Bank Card",
          "No-Cost EMI from \u20B93,750/month",
          "SuperCoins Reward on purchase"
        ];
      } else if (store.name === "Croma") {
        storePrice = basePrice + Math.floor(basePrice * 0.01);
        deliveryDays = "3-5 days";
        storeSpecificOffers = [
          "Additional 1-year warranty",
          "Free home installation",
          "Exchange bonus up to \u20B910,000"
        ];
      } else if (store.name === "Reliance Digital") {
        storePrice = basePrice;
        deliveryDays = "3-4 days";
        storeSpecificOffers = [
          "5% cashback with Reliance One membership",
          "Free extended warranty worth \u20B92,999",
          "EMI starting at \u20B92,999/month"
        ];
      }
      const priceVariation = Math.floor(Math.random() * 2e5 - 1e5);
      storePrice = storePrice + priceVariation;
      const markup = 0.08 + Math.random() * 0.07;
      const originalPrice = Math.round(storePrice * (1 + markup));
      const discount = Math.floor((originalPrice - storePrice) / originalPrice * 100);
      const priceRecord = {
        productId: product.id,
        storeId: store.id,
        price: storePrice,
        originalPrice,
        discount,
        rating: 35 + Math.floor(Math.random() * 15),
        // Rating between 3.5 and 5.0
        reviewCount: 500 + Math.floor(Math.random() * 2e3),
        url: `${store.website}/product/${product.id}`,
        inStock: true,
        offers: storeSpecificOffers
      };
      const createdPrice = await this.createProductPrice(priceRecord);
      const priceWithDelivery = this.productPrices.get(createdPrice.id);
      if (priceWithDelivery) {
        priceWithDelivery.deliveryDays = deliveryDays;
        this.productPrices.set(createdPrice.id, priceWithDelivery);
      }
    }));
    return product;
  }
  async addSearchHistory(insertSearchHistory) {
    const id = this.currentSearchHistoryId++;
    const now = /* @__PURE__ */ new Date();
    const searchHistory = {
      ...insertSearchHistory,
      id,
      timestamp: now,
      userId: insertSearchHistory.userId ?? null
    };
    this.searchHistories.set(id, searchHistory);
    return searchHistory;
  }
  async getRecentSearches(userId, limit = 5) {
    const searches = Array.from(this.searchHistories.values()).filter((search) => userId ? search.userId === userId : true).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
    return searches;
  }
};
var storage = new MemStorage();

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getAllStores();
      return res.json(stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      return res.status(500).json({ message: "Failed to fetch stores" });
    }
  });
  app2.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query || query.trim() === "") {
        return res.status(400).json({ message: "Search query is required" });
      }
      await storage.addSearchHistory({
        userId: null,
        // Anonymous user
        query
      });
      const products = await storage.searchProducts(query);
      return res.json({
        query,
        count: products.length,
        products
      });
    } catch (error) {
      console.error("Error during search:", error);
      return res.status(500).json({ message: "Search failed" });
    }
  });
  app2.get("/api/recent-searches", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId) : void 0;
      const limit = req.query.limit ? parseInt(req.query.limit) : 5;
      const searches = await storage.getRecentSearches(userId, limit);
      return res.json(searches);
    } catch (error) {
      console.error("Error fetching recent searches:", error);
      return res.status(500).json({ message: "Failed to fetch recent searches" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const prices = await storage.getProductPricesByProductId(id);
      return res.json({
        ...product,
        prices
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv.config();
console.log("RAPIDAPI_KEY:", process.env.RAPIDAPI_KEY);
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();

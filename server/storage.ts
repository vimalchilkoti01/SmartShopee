import { 
  User, InsertUser, Product, InsertProduct, 
  Store, InsertStore, ProductPrice, InsertProductPrice,
  SearchHistory, InsertSearchHistory, ProductWithPrices
} from "@shared/schema";

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByName(name: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Store methods
  getStore(id: number): Promise<Store | undefined>;
  getStoreByName(name: string): Promise<Store | undefined>;
  getAllStores(): Promise<Store[]>;
  createStore(store: InsertStore): Promise<Store>;
  
  // ProductPrice methods
  getProductPrice(id: number): Promise<ProductPrice | undefined>;
  getProductPricesByProductId(productId: number): Promise<(ProductPrice & { store: Store })[]>;
  createProductPrice(productPrice: InsertProductPrice): Promise<ProductPrice>;
  
  // Search methods
  searchProducts(query: string): Promise<ProductWithPrices[]>;
  addSearchHistory(searchHistory: InsertSearchHistory): Promise<SearchHistory>;
  getRecentSearches(userId?: number, limit?: number): Promise<SearchHistory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private stores: Map<number, Store>;
  private productPrices: Map<number, ProductPrice>;
  private searchHistories: Map<number, SearchHistory>;
  
  private currentUserId: number;
  private currentProductId: number;
  private currentStoreId: number;
  private currentProductPriceId: number;
  private currentSearchHistoryId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.stores = new Map();
    this.productPrices = new Map();
    this.searchHistories = new Map();
    
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentStoreId = 1;
    this.currentProductPriceId = 1;
    this.currentSearchHistoryId = 1;
    
    // Initialize with some demo stores
    this.initDemoStores();
  }

  private initDemoStores() {
    const demoStores: InsertStore[] = [
      { name: "Amazon", logoUrl: "", website: "https://amazon.com" },
      { name: "Flipkart", logoUrl: "", website: "https://flipkart.com" },
      { name: "Myntra", logoUrl: "", website: "https://myntra.com" },
      { name: "Croma", logoUrl: "", website: "https://croma.com" },
      { name: "Reliance Digital", logoUrl: "", website: "https://reliancedigital.in" }
    ];
    
    demoStores.forEach(store => this.createStore(store));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByName(name: string): Promise<Product[]> {
    const lowerName = name.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => product.name.toLowerCase().includes(lowerName)
    );
  }
  
  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const now = new Date();
    const product: Product = { ...insertProduct, id, createdAt: now };
    this.products.set(id, product);
    return product;
  }
  
  // Store methods
  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }
  
  async getStoreByName(name: string): Promise<Store | undefined> {
    return Array.from(this.stores.values()).find(
      (store) => store.name === name
    );
  }
  
  async getAllStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }
  
  async createStore(insertStore: InsertStore): Promise<Store> {
    const id = this.currentStoreId++;
    const store: Store = { ...insertStore, id };
    this.stores.set(id, store);
    return store;
  }
  
  // ProductPrice methods
  async getProductPrice(id: number): Promise<ProductPrice | undefined> {
    return this.productPrices.get(id);
  }
  
  async getProductPricesByProductId(productId: number): Promise<(ProductPrice & { store: Store })[]> {
    return Array.from(this.productPrices.values())
      .filter((price) => price.productId === productId)
      .map((price) => {
        const store = this.stores.get(price.storeId);
        if (!store) throw new Error(`Store with id ${price.storeId} not found`);
        return { ...price, store };
      });
  }
  
  async createProductPrice(insertProductPrice: InsertProductPrice): Promise<ProductPrice> {
    const id = this.currentProductPriceId++;
    const now = new Date();
    const productPrice: ProductPrice = { ...insertProductPrice, id, updatedAt: now };
    this.productPrices.set(id, productPrice);
    return productPrice;
  }
  
  // Search methods
  async searchProducts(query: string): Promise<ProductWithPrices[]> {
    // In a real implementation, this would perform a more complex search
    const matchedProducts = await this.getProductsByName(query);
    
    // If no real products found, create dummy product results for demo
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
  
  private async createDemoProduct(query: string): Promise<Product> {
    // Create a product based on the search query
    const product = await this.createProduct({
      name: query,
      description: `Demo product for ${query}`,
      imageUrl: "",
      category: "Electronics",
    });
    
    // Create prices for all 4 major platforms (not Myntra)
    // Use more realistic prices based on product type
    const stores = await this.getAllStores();
    let basePrice = 0;
    
    // Set appropriate base price range based on product type
    if (query.toLowerCase().includes('iphone') || query.toLowerCase().includes('samsung') || 
        query.toLowerCase().includes('pixel')) {
      basePrice = 70000 + Math.floor(Math.random() * 30000); // Phones: 70k-100k
    } else if (query.toLowerCase().includes('macbook') || query.toLowerCase().includes('laptop')) {
      basePrice = 90000 + Math.floor(Math.random() * 50000); // Laptops: 90k-140k
    } else if (query.toLowerCase().includes('tv') || query.toLowerCase().includes('television')) {
      basePrice = 40000 + Math.floor(Math.random() * 80000); // TVs: 40k-120k
    } else if (query.toLowerCase().includes('headphone') || query.toLowerCase().includes('earbuds')) {
      basePrice = 10000 + Math.floor(Math.random() * 15000); // Audio: 10k-25k
    } else {
      basePrice = 25000 + Math.floor(Math.random() * 50000); // Other electronics: 25k-75k
    }
    
    // Only include Amazon, Flipkart, Croma, and Reliance Digital
    const includedStores = stores.filter(store => 
      ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital'].includes(store.name)
    );
    
    // Create prices for each included store with realistic variations
    await Promise.all(includedStores.map(async (store, index) => {
      // Each store has a different price strategy
      let storePrice = basePrice;
      let deliveryDays = "2-3 days";
      let storeSpecificOffers = [];
      
      // Store-specific price variations and offers
      if (store.name === "Amazon") {
        storePrice = basePrice - Math.floor(basePrice * 0.02); // Amazon slightly cheaper
        deliveryDays = "1-2 days";
        storeSpecificOffers = [
          "10% Instant Discount with HDFC Credit Cards",
          "No-Cost EMI available",
          "Prime delivery available"
        ];
      } else if (store.name === "Flipkart") {
        storePrice = basePrice - Math.floor(basePrice * 0.03); // Flipkart cheapest
        deliveryDays = "2-3 days";
        storeSpecificOffers = [
          "Extra 5% off with Flipkart Axis Bank Card",
          "No-Cost EMI available", 
          "SuperCoins Reward"
        ];
      } else if (store.name === "Croma") {
        storePrice = basePrice + Math.floor(basePrice * 0.01); // Croma slightly more
        deliveryDays = "3-5 days";
        storeSpecificOffers = [
          "Additional warranty available",
          "Free installation",
          "Exchange offer available"
        ];
      } else if (store.name === "Reliance Digital") {
        storePrice = basePrice;
        deliveryDays = "3-4 days";
        storeSpecificOffers = [
          "5% cashback with Reliance One",
          "Free extended warranty",
          "EMI starting ₹2,999/month"
        ];
      }
      
      // Add randomization to make it realistic
      storePrice = storePrice + Math.floor((Math.random() * 2000) - 1000);
      const originalPrice = storePrice + Math.floor(storePrice * (0.08 + Math.random() * 0.07)); // 8-15% markup
      const discount = Math.floor((originalPrice - storePrice) / originalPrice * 100);
      
      await this.createProductPrice({
        productId: product.id,
        storeId: store.id,
        price: storePrice,
        originalPrice,
        discount,
        rating: 35 + Math.floor(Math.random() * 15), // Rating between 3.5 and 5.0
        reviewCount: 500 + Math.floor(Math.random() * 2000),
        url: `${store.website}/product/${product.id}`,
        inStock: true,
        offers: storeSpecificOffers,
        deliveryDays: deliveryDays
      });
    }));
    
    return product;
  }
  
  async addSearchHistory(insertSearchHistory: InsertSearchHistory): Promise<SearchHistory> {
    const id = this.currentSearchHistoryId++;
    const now = new Date();
    const searchHistory: SearchHistory = { ...insertSearchHistory, id, timestamp: now };
    this.searchHistories.set(id, searchHistory);
    return searchHistory;
  }
  
  async getRecentSearches(userId?: number, limit = 5): Promise<SearchHistory[]> {
    const searches = Array.from(this.searchHistories.values())
      .filter((search) => userId ? search.userId === userId : true)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    
    return searches;
  }
}

export const storage = new MemStorage();

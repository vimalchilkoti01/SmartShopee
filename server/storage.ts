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
    
    // Create some demo prices at different stores
    const stores = await this.getAllStores();
    const basePrice = 50000 + Math.floor(Math.random() * 20000); // Random price between 50,000 and 70,000
    
    await Promise.all(stores.slice(0, 3).map(async (store, index) => {
      // Each store has a slightly different price
      const storePrice = basePrice - (index * 2000);
      const originalPrice = storePrice + Math.floor(storePrice * 0.1);
      const discount = Math.floor((originalPrice - storePrice) / originalPrice * 100);
      
      await this.createProductPrice({
        productId: product.id,
        storeId: store.id,
        price: storePrice,
        originalPrice,
        discount,
        rating: 40 + Math.floor(Math.random() * 10), // Rating between 4.0 and 5.0
        reviewCount: 500 + Math.floor(Math.random() * 2000),
        url: `${store.website}/product/${product.id}`,
        inStock: true,
        offers: ["10% Instant Discount with HDFC Credit Cards", "No-Cost EMI available"]
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

import { ExternalLink, Star, StarHalf, Truck, Clock, Award, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductWithPrices } from "@shared/schema";
import { SiAmazon, SiFlipkart, SiShopify, SiShopee, SiBigcommerce } from "react-icons/si";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductCardProps {
  product: ProductWithPrices;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Set default product image if none exists
  const [imageError, setImageError] = useState(false);
  
  if (!product.prices || product.prices.length === 0) {
    return null;
  }

  // Filter to only include Amazon, Flipkart, Croma, and Reliance Digital
  const validPlatforms = ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital'];
  const filteredPrices = product.prices.filter(price => 
    validPlatforms.includes(price.store.name)
  );
  
  // Sort prices to get the best deal first (lowest price)
  const sortedPrices = [...filteredPrices].sort((a, b) => a.price - b.price);
  
  // Best overall deal is the cheapest
  const bestDeal = sortedPrices[0];
  
  // Find best deal based on different factors
  const bestRating = [...filteredPrices].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  const bestDelivery = [...filteredPrices].sort((a, b) => {
    const aDays = a.deliveryDays ? parseInt(a.deliveryDays.split('-')[0]) : 5;
    const bDays = b.deliveryDays ? parseInt(b.deliveryDays.split('-')[0]) : 5;
    return aDays - bDays;
  })[0];
  
  // Calculate discount percentage
  const getDiscountPercentage = (price: typeof bestDeal) => {
    return price.originalPrice 
      ? Math.floor((price.originalPrice - price.price) / price.originalPrice * 100) 
      : price.discount || 0;
  };
  
  // Format price in rupees with proper formatting for large numbers
  const formatPrice = (price: number) => {
    const priceInRupees = price / 100;
    
    // Format with proper Indian number formatting (e.g., 1,49,999)
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });
    
    return formatter.format(priceInRupees);
  };

  // Get store icon
  const getStoreIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'amazon':
        return <SiAmazon className="h-5 w-5" />;
      case 'flipkart':
        return <SiFlipkart className="h-5 w-5" />;
      case 'croma':
        return <SiShopee className="h-5 w-5" />;
      case 'reliance digital':
        return <SiBigcommerce className="h-5 w-5" />;
      default:
        return <ShoppingBag className="h-5 w-5" />;
    }
  };

  // Render star rating
  const renderRating = (rating: number | null | undefined = 0) => {
    // Convert from 0-50 scale to 0-5 scale
    const ratingValue = rating || 0; // Handle null or undefined
    const stars = ratingValue / 10;
    const fullStars = Math.floor(stars);
    const hasHalfStar = stars % 1 >= 0.5;
    
    return (
      <span className="text-yellow-400 flex items-center">
        {Array(fullStars).fill(0).map((_, i) => (
          <Star key={`star-${i}`} className="fill-current h-4 w-4" />
        ))}
        {hasHalfStar && <StarHalf className="fill-current h-4 w-4" />}
        {Array(5 - fullStars - (hasHalfStar ? 1 : 0)).fill(0).map((_, i) => (
          <Star key={`empty-star-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </span>
    );
  };

  // Generate a buying recommendation - prioritizing price first, then rating, then delivery
  const getBuyingRecommendation = () => {
    // Always start with the best price (lowest price store)
    const recommendation = {
      store: bestDeal.store.name,
      reason: `Lowest price across all platforms`
    };
    
    // If two stores have very close prices (within 1%), consider other factors
    const getSecondBestPrice = sortedPrices[1] || sortedPrices[0];
    const priceDifference = (getSecondBestPrice.price - bestDeal.price) / bestDeal.price;
    
    // If price is almost the same, consider rating
    if (priceDifference < 0.01) {
      // Find best rated among the close-priced stores
      const closelyPricedStores = sortedPrices.filter(p => 
        (p.price - bestDeal.price) / bestDeal.price < 0.01
      );
      
      const bestRatedAmongClose = [...closelyPricedStores].sort((a, b) => 
        (b.rating || 0) - (a.rating || 0)
      )[0];
      
      if (bestRatedAmongClose && bestRatedAmongClose.store.id !== bestDeal.store.id) {
        return {
          store: bestRatedAmongClose.store.name,
          reason: `Similar price with better customer ratings`
        };
      }
    }
    
    // If the best delivery store is close to the best price (within 2%), recommend it
    const deliveryPriceDiff = (bestDelivery.price - bestDeal.price) / bestDeal.price;
    if (deliveryPriceDiff < 0.02 && bestDelivery.store.id !== bestDeal.store.id) {
      return {
        store: bestDelivery.store.name,
        reason: `Almost same price with faster delivery`
      };
    }
    
    // If the best deal and best rating are the same store, emphasize it
    if (bestDeal.store.id === bestRating.store.id) {
      return {
        store: bestDeal.store.name,
        reason: `Best overall value - lowest price and highest rating`
      };
    }
    
    // Default to best price if no other conditions are met
    return recommendation;
  };

  // Use a placeholder image if the product image fails to load
  const handleImageError = () => {
    setImageError(true);
  };

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
  
  const recommendation = getBuyingRecommendation();

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Product image */}
          <img 
            src={imageError ? placeholderImage : (product.imageUrl || placeholderImage)}
            alt={product.name} 
            className="w-24 h-24 object-contain rounded-lg bg-gray-50 p-2"
            onError={handleImageError}
          />
          
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <div className="flex items-center mt-1">
              {renderRating(bestRating.rating || 0)}
              <span className="ml-2 text-sm text-gray-600">
                {((bestRating.rating || 0) / 10).toFixed(1)} ({bestRating.reviewCount?.toLocaleString() || 0} reviews)
              </span>
            </div>
            
            {/* Our recommendation */}
            <div className="mt-3 mb-3">
              <Badge className="bg-green-600">Our Recommendation</Badge>
              <div className="mt-1 flex items-center gap-2">
                <Award className="text-green-600 h-5 w-5" />
                <div>
                  <span className="font-semibold text-green-700">Buy from {recommendation.store}</span>
                  <p className="text-xs text-gray-600">{recommendation.reason}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Platform comparison tabs */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Tabs defaultValue={bestDeal.store.name.toLowerCase()} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              {sortedPrices.map(price => (
                <TabsTrigger 
                  key={price.store.id} 
                  value={price.store.name.toLowerCase()}
                  className="flex items-center gap-1"
                >
                  {getStoreIcon(price.store.name)}
                  <span className="hidden sm:inline">{price.store.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {sortedPrices.map(price => (
              <TabsContent key={price.store.id} value={price.store.name.toLowerCase()}>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {getStoreIcon(price.store.name)}
                        <span className="font-semibold">{price.store.name}</span>
                      </div>
                      <div className="flex items-center mt-1 gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          Delivery: {price.deliveryDays || '3-5 days'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {price.originalPrice && (
                        <div className="text-gray-500 text-sm line-through">
                          {formatPrice(price.originalPrice)}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-gray-800">{formatPrice(price.price)}</div>
                      {getDiscountPercentage(price) > 0 && (
                        <div className="text-green-600 text-sm font-medium">{getDiscountPercentage(price)}% off</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    {renderRating(price.rating || 0)}
                    <span className="ml-2 text-sm text-gray-600">
                      {((price.rating || 0) / 10).toFixed(1)} ({price.reviewCount?.toLocaleString() || 0} reviews)
                    </span>
                  </div>
                  
                  {/* Offers section */}
                  {price.offers && price.offers.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Available Offers:</div>
                      <div className="flex flex-col gap-2">
                        {price.offers.map((offer, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <svg 
                              className="text-accent h-4 w-4 mt-0.5 flex-shrink-0" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="text-sm text-gray-600">{offer}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <a 
                      href={price.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition flex items-center"
                    >
                      <span>Buy Now</span>
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

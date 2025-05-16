import { ExternalLink, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductWithPrices } from "@shared/schema";
import { SiAmazon, SiFlipkart, SiShopify, SiShopee, SiBigcommerce } from "react-icons/si";
import { useState } from "react";

interface ProductCardProps {
  product: ProductWithPrices;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Set default product image if none exists
  const [imageError, setImageError] = useState(false);
  
  if (!product.prices || product.prices.length === 0) {
    return null;
  }

  // Sort prices to get the best deal first
  const sortedPrices = [...product.prices].sort((a, b) => a.price - b.price);
  const bestDeal = sortedPrices[0];
  
  // Calculate discount percentage
  const discountPercentage = bestDeal.originalPrice 
    ? Math.floor((bestDeal.originalPrice - bestDeal.price) / bestDeal.originalPrice * 100) 
    : bestDeal.discount || 0;
  
  // Format price in rupees
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  // Get store icon
  const getStoreIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'amazon':
        return <SiAmazon className="h-5 mr-2" />;
      case 'flipkart':
        return <SiFlipkart className="h-5 mr-2" />;
      case 'myntra':
        return <SiShopify className="h-5 mr-2" />;
      case 'croma':
        return <SiShopee className="h-5 mr-2" />;
      case 'reliance digital':
        return <SiBigcommerce className="h-5 mr-2" />;
      default:
        return <SiBigcommerce className="h-5 mr-2" />;
    }
  };

  // Render star rating
  const renderRating = (rating: number = 0) => {
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

  // Use a placeholder image if the product image fails to load
  const handleImageError = () => {
    setImageError(true);
  };

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d1d5db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";

  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${sortedPrices[0] === bestDeal ? 'border-2 border-secondary' : 'border border-gray-200'} relative`}>
      {/* Best deal badge - only shown for the best deal */}
      {sortedPrices[0] === bestDeal && (
        <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">
          Best Deal
        </div>
      )}
      
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
              {renderRating(bestDeal.rating)}
              <span className="ml-2 text-sm text-gray-600">
                {(bestDeal.rating / 10).toFixed(1)} ({bestDeal.reviewCount?.toLocaleString() || 0} reviews)
              </span>
            </div>
            
            <div className="flex items-center mt-2">
              {getStoreIcon(bestDeal.store.name)}
              <span className="text-gray-700 text-sm">{bestDeal.store.name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <div>
            {bestDeal.originalPrice && (
              <div className="text-gray-500 text-sm line-through">
                {formatPrice(bestDeal.originalPrice)}
              </div>
            )}
            <div className="text-2xl font-bold text-gray-800">{formatPrice(bestDeal.price)}</div>
            {discountPercentage > 0 && (
              <div className="text-secondary text-sm font-medium">{discountPercentage}% off</div>
            )}
          </div>
          
          <a 
            href={bestDeal.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition text-sm flex items-center"
          >
            <span>Buy Now</span>
            <ExternalLink className="ml-2 h-3 w-3" />
          </a>
        </div>
        
        {/* Offers section */}
        {bestDeal.offers && bestDeal.offers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm font-medium text-gray-700 mb-2">Available Offers:</div>
            <div className="flex flex-col gap-2">
              {bestDeal.offers.map((offer, index) => (
                <div key={index} className="flex items-start gap-2">
                  <svg 
                    className="text-accent h-4 w-4 mt-0.5" 
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
      </div>
    </div>
  );
};

export default ProductCard;

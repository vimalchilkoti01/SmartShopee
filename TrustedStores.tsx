import { useQuery } from "@tanstack/react-query";
import { Store } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { SiAmazon, SiFlipkart, SiShopify, SiShopee, SiBigcommerce } from "react-icons/si";

const TrustedStores = () => {
  const { data: stores, isLoading } = useQuery<Store[]>({
    queryKey: ['/api/stores'],
  });

  // Map store names to their corresponding icons
  const getStoreIcon = (name: string) => {
    const iconStyle = "opacity-70";
    
    switch (name.toLowerCase()) {
      case 'amazon':
        return <SiAmazon className={`h-6 ${iconStyle}`} />;
      case 'flipkart':
        return <SiFlipkart className={`h-6 ${iconStyle}`} />;
      case 'myntra':
        return <SiShopify className={`h-6 ${iconStyle}`} />;
      case 'croma':
        return <SiShopee className={`h-6 ${iconStyle}`} />;
      case 'reliance digital':
        return <SiBigcommerce className={`h-6 ${iconStyle}`} />;
      default:
        return <SiBigcommerce className={`h-6 ${iconStyle}`} />;
    }
  };

  return (
    <section className="bg-white py-6 border-b">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          <p className="text-gray-500 font-medium">We compare across:</p>
          
          {isLoading && (
            <>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </>
          )}
          
          {!isLoading && stores && stores.map((store) => (
            <div key={store.id} className="flex items-center">
              {getStoreIcon(store.name)}
            </div>
          ))}
          
          <p className="text-primary font-medium">+ 12 more</p>
        </div>
      </div>
    </section>
  );
};

export default TrustedStores;

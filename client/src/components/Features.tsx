import { 
  RefreshCw, 
  Tags, 
  Store, 
  Bell, 
  History, 
  Smartphone 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <RefreshCw className="text-primary text-xl" />,
      title: "Real-Time Comparison",
      description: "Get up-to-the-minute price updates and inventory status from various online stores."
    },
    {
      icon: <Tags className="text-secondary text-xl" />,
      title: "Best Deal Finder",
      description: "Our algorithm considers prices, offers, shipping, and reviews to find truly the best deal."
    },
    {
      icon: <Store className="text-accent text-xl" />,
      title: "Multi-Platform Support",
      description: "We cover major e-commerce platforms like Amazon, Flipkart, Myntra, and 15+ more."
    },
    {
      icon: <Bell className="text-red-500 text-xl" />,
      title: "Price Drop Alerts",
      description: "Get notified when products you're watching drop in price or go on sale."
    },
    {
      icon: <History className="text-purple-500 text-xl" />,
      title: "Price History Tracking",
      description: "See how prices have changed over time to make informed buying decisions."
    },
    {
      icon: <Smartphone className="text-indigo-500 text-xl" />,
      title: "Mobile Friendly",
      description: "Compare prices on the go with our responsive design that works on all devices."
    }
  ];

  return (
    <section className="bg-gray-50 py-16" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose beingByte?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We do the hard work of finding the best deals so you don't have to waste time checking multiple websites.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

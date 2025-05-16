import { Search, RefreshCw, Wallet } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-16" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How beingByte Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Finding the best deals across multiple platforms has never been easier.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Step 1 */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 className="text-xl font-bold mb-3">Search</h3>
            <p className="text-gray-600">
              Enter any product you're looking for in our powerful search bar.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 className="text-xl font-bold mb-3">Compare</h3>
            <p className="text-gray-600">
              We instantly scan multiple e-commerce sites for prices, deals, and reviews.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 className="text-xl font-bold mb-3">Save</h3>
            <p className="text-gray-600">
              Choose the best offer and save money on your purchase!
            </p>
          </div>
        </div>
        
        {/* Illustration */}
        <div className="mt-12 max-w-4xl mx-auto bg-white p-4 rounded-2xl shadow-lg">
          <div className="aspect-w-16 aspect-h-8 rounded-xl bg-gray-100 overflow-hidden">
            <div className="flex items-center justify-center h-full p-10 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                  <Search className="h-12 w-12 text-primary mb-3" />
                  <p className="text-sm text-center font-medium">Find what you're looking for</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                  <RefreshCw className="h-12 w-12 text-secondary mb-3" />
                  <p className="text-sm text-center font-medium">Compare across platforms</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                  <Wallet className="h-12 w-12 text-accent mb-3" />
                  <p className="text-sm text-center font-medium">Save money on every purchase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

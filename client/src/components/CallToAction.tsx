import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Saving?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of savvy shoppers finding the best deals online. It's completely free!
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <Button 
            variant="default" 
            className="bg-white text-primary hover:bg-gray-100 font-bold py-6 px-8"
          >
            Sign Up Free
          </Button>
          <Button 
            variant="outline" 
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-6 px-8"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

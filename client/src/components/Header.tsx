import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BoltIcon } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <a className="text-2xl font-bold text-primary flex items-center">
              <BoltIcon className="text-accent mr-1 h-6 w-6" />
              beingByte
            </a>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/">
            <a className="font-medium hover:text-primary transition">Home</a>
          </Link>
          <a href="#how-it-works" className="font-medium hover:text-primary transition">
            How It Works
          </a>
          <a href="#features" className="font-medium hover:text-primary transition">
            Features
          </a>
          <a href="#testimonials" className="font-medium hover:text-primary transition">
            Reviews
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="hidden md:inline-flex">
            Login
          </Button>
          <Button className="hidden md:inline-flex">
            Sign Up Free
          </Button>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-500 hover:text-primary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <Link href="/">
                  <a className="font-medium px-4 py-2 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </a>
                </Link>
                <a href="#how-it-works" className="font-medium px-4 py-2 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  How It Works
                </a>
                <a href="#features" className="font-medium px-4 py-2 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  Features
                </a>
                <a href="#testimonials" className="font-medium px-4 py-2 rounded-md hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>
                  Reviews
                </a>
                <div className="border-t pt-4 mt-4">
                  <Button variant="outline" className="w-full mb-2">
                    Login
                  </Button>
                  <Button className="w-full">
                    Sign Up Free
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  BoltIcon 
} from "lucide-react";
import { SiVisa, SiMastercard, SiPaypal } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <BoltIcon className="text-accent mr-1 h-5 w-5" />
              beingByte
            </h3>
            <p className="text-gray-400 mb-4">
              Find the Best Deals in a Byte! Compare prices across multiple e-commerce 
              platforms and save money on every purchase.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition">Home</a>
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-400 hover:text-white transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-white transition">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Electronics
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Fashion
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Home & Kitchen
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Books
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Beauty & Personal Care
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Affiliate Disclosure
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} beingByte. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <div className="flex space-x-4">
              <SiVisa className="h-8 w-8 opacity-75" />
              <SiMastercard className="h-8 w-8 opacity-75" />
              <SiPaypal className="h-8 w-8 opacity-75" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

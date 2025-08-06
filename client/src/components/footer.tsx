import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter section */}
      <div className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Stay in Style
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new arrivals, exclusive offers, and style tips
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-accent bg-white text-black"
                required
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit"
                className="bg-accent text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-gray-400 text-sm mt-3">We respect your privacy. Unsubscribe at any time.</p>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-2xl font-bold mb-4">
              Desi<span className="text-accent">palette</span>
            </h4>
            <p className="text-gray-400 mb-6 max-w-md">
              Discover premium fashion and lifestyle products that celebrate culture, comfort, and contemporary design. Your style, our passion.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 hover:bg-gray-700" data-testid="button-facebook">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 hover:bg-gray-700" data-testid="button-instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 hover:bg-gray-700" data-testid="button-twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="bg-gray-800 border-gray-700 hover:bg-gray-700" data-testid="button-youtube">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" data-testid="link-about">
                  <span className="hover:text-white transition-colors cursor-pointer">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" data-testid="link-contact">
                  <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
                </Link>
              </li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Size Guide</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Shipping Info</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Returns</span></li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h5 className="font-semibold mb-4">Customer Service</h5>
            <ul className="space-y-2 text-gray-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">FAQ</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Track Your Order</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Bulk Orders</span></li>
            </ul>
          </div>
        </div>

        {/* Payment methods and copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm" data-testid="text-copyright">
                © 2024 Desipalette. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Secure payments with:</span>
              <div className="flex space-x-2">
                <div className="bg-gray-800 p-2 rounded">
                  <span className="text-blue-400">VISA</span>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <span className="text-red-400">MC</span>
                </div>
                <div className="bg-gray-800 p-2 rounded">
                  <span className="text-blue-300">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

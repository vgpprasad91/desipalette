import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, Heart, ShoppingBag, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";
import { CartSidebar } from "./cart-sidebar";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { itemCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm text-gray-600 border-b border-gray-100">
          <div>
            <span data-testid="text-shipping-offer">Free shipping on orders over $100</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/track-order" data-testid="link-track-order">
              <span className="hover:text-primary transition-colors cursor-pointer">Track Order</span>
            </Link>
            <Link href="/help" data-testid="link-help">
              <span className="hover:text-primary transition-colors cursor-pointer">Help</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Phone className="h-3 w-3" />
              <span data-testid="text-phone">+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
        
        {/* Main navigation */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <h1 className="font-bold text-2xl lg:text-3xl text-primary">
              Desi<span className="text-accent">palette</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/products?category=Women" data-testid="link-women">
              <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                Women
              </span>
            </Link>
            <Link href="/products?category=Men" data-testid="link-men">
              <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                Men
              </span>
            </Link>
            <Link href="/products?category=Accessories" data-testid="link-accessories">
              <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                Accessories
              </span>
            </Link>
            <Link href="/products?category=Home" data-testid="link-home-living">
              <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                Home & Living
              </span>
            </Link>
            <Link href="/products?sale=true" data-testid="link-sale">
              <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                Sale
              </span>
            </Link>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  data-testid="input-search"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </form>
            
            {/* User actions */}
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-primary" data-testid="button-user">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-700 hover:text-primary" data-testid="button-wishlist">
              <Heart className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-gray-700 hover:text-primary"
              onClick={() => setCartOpen(true)}
              data-testid="button-cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" data-testid="text-cart-count">
                  {itemCount}
                </span>
              )}
            </Button>
            
            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-gray-700 hover:text-primary" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  <Link href="/products?category=Women" data-testid="link-mobile-women">
                    <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                      Women
                    </span>
                  </Link>
                  <Link href="/products?category=Men" data-testid="link-mobile-men">
                    <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                      Men
                    </span>
                  </Link>
                  <Link href="/products?category=Accessories" data-testid="link-mobile-accessories">
                    <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                      Accessories
                    </span>
                  </Link>
                  <Link href="/products?category=Home" data-testid="link-mobile-home">
                    <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                      Home & Living
                    </span>
                  </Link>
                  <Link href="/products?sale=true" data-testid="link-mobile-sale">
                    <span className="text-gray-700 hover:text-primary font-medium transition-colors cursor-pointer">
                      Sale
                    </span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-accent"
                data-testid="input-mobile-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </form>
        </div>
      </div>

      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}

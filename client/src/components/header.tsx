import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, User, Heart, ShoppingBag, Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";
import { CartSidebar } from "./cart-sidebar";
import logoImg from "@/assets/desipalette-logo.svg";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [location, navigate] = useLocation();
  const [atTop, setAtTop] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handle = () => setAtTop(window.scrollY < 40);
    if (location === "/") {
      handle();
      window.addEventListener("scroll", handle);
      return () => window.removeEventListener("scroll", handle);
    } else {
      setAtTop(false);
    }
  }, [location]);
  const { itemCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const transparent = false; // Disable transparency to always show the navbar with background

  return (
    <>
      <header className={`bg-[#F1ECE1] mandala-bg sticky top-0 z-50 transition-all duration-300 ${atTop ? 'shadow-sm' : 'shadow-lg royal-shadow'}`}>
        <div className="w-full">
          {/* Top announcement bar with gradient */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#C5A572]/10 via-transparent to-[#C5A572]/10"></div>
            <div className="hidden md:flex justify-center items-center py-2.5 text-xs bg-gradient-to-b from-[#E8DFCE]/50 to-[#E8DFCE]/30 text-[#6B4C3A] transition-all">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-[#C5A572] rounded-full animate-pulse"></span>
                    <span data-testid="text-shipping-offer" className="tracking-wider font-medium">Free Shipping Above ₹999</span>
                  </span>
                  <span className="text-[#C5A572]">•</span>
                  <span className="tracking-wider">Easy 30-Day Returns</span>
                </div>
                <div className="flex items-center space-x-6">
                  <Link href="/track-order" data-testid="link-track-order">
                    <span className="hover:text-[#4A1F2A] transition-colors cursor-pointer tracking-wider flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Track Order
                    </span>
                  </Link>
                  <span className="text-[#C5A572]/60">|</span>
                  <Link href="/help" data-testid="link-help">
                    <span className="hover:text-[#4A1F2A] transition-colors cursor-pointer tracking-wider">Customer Care</span>
                  </Link>
                  <span className="text-[#C5A572]/60">|</span>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-3 w-3 text-[#C5A572]" />
                    <span data-testid="text-phone" className="font-medium">+91 80-1234-5678</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative border */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A572]/30 to-transparent"></div>
          
          {/* Main navigation */}
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="flex items-center justify-between py-4">
                {/* Logo with decorative elements */}
                <div className="flex items-center">
                  <Link href="/" data-testid="link-home" className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#C5A572]/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img 
                      src={logoImg} 
                      alt="DesiPalette" 
                      className="h-14 lg:h-16 w-auto object-contain transition-all duration-300 relative z-10"
                    />
                  </Link>
                </div>

                {/* Desktop Navigation with enhanced styling */}
                <nav className="hidden lg:flex items-center">
                  <div className="flex items-center space-x-1">
                    <Link href="/collections" data-testid="link-collections">
                      <div className="group px-4 py-2 relative">
                        <span className="text-[#6B4C3A] group-hover:text-[#4A1F2A] text-sm tracking-wider transition-all duration-300 cursor-pointer uppercase font-semibold relative z-10">
                          Dynasty Collections
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A572] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                      </div>
                    </Link>
                    <span className="text-[#C5A572]/30">|</span>
                    <Link href="/products?category=Women" data-testid="link-women">
                      <div className="group px-4 py-2 relative">
                        <span className="text-[#6B4C3A] group-hover:text-[#4A1F2A] text-sm tracking-wider transition-all duration-300 cursor-pointer uppercase font-semibold relative z-10">
                          Women
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A572] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                      </div>
                    </Link>
                    <span className="text-[#C5A572]/30">|</span>
                    <Link href="/products?category=Men" data-testid="link-men">
                      <div className="group px-4 py-2 relative">
                        <span className="text-[#6B4C3A] group-hover:text-[#4A1F2A] text-sm tracking-wider transition-all duration-300 cursor-pointer uppercase font-semibold relative z-10">
                          Men
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A572] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                      </div>
                    </Link>
                    <span className="text-[#C5A572]/30">|</span>
                    <Link href="/products?category=Accessories" data-testid="link-accessories">
                      <div className="group px-4 py-2 relative">
                        <span className="text-[#6B4C3A] group-hover:text-[#4A1F2A] text-sm tracking-wider transition-all duration-300 cursor-pointer uppercase font-semibold relative z-10">
                          Accessories
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A572] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                      </div>
                    </Link>
                    <span className="text-[#C5A572]/30">|</span>
                    <Link href="/products?category=Home" data-testid="link-home-living">
                      <div className="group px-4 py-2 relative">
                        <span className="text-[#6B4C3A] group-hover:text-[#4A1F2A] text-sm tracking-wider transition-all duration-300 cursor-pointer uppercase font-semibold relative z-10">
                          Home & Living
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A572] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                      </div>
                    </Link>
                    <span className="text-[#C5A572]/30">|</span>
                    <Link href="/products?sale=true" data-testid="link-sale">
                      <div className="group px-4 py-2 relative">
                        <span className="relative">
                          <span className="text-[#C5A572] group-hover:text-[#B8975F] text-sm tracking-wider transition-all duration-300 cursor-pointer uppercase font-semibold relative z-10">
                            Sale
                          </span>
                          <span className="absolute -top-2 -right-8 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            NEW
                          </span>
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
                      </div>
                    </Link>
                  </div>
                </nav>

                {/* Search and Actions with enhanced styling */}
                <div className="flex items-center space-x-2">
                  {/* Enhanced Search */}
                  <div className="hidden md:flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchOpen(!searchOpen)}
                      className="relative group"
                    >
                      <div className="absolute inset-0 bg-[#C5A572]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                      <Search className="h-5 w-5 text-[#6B4C3A] group-hover:text-[#4A1F2A] transition-colors relative z-10" />
                    </Button>
                    <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? 'w-64 ml-2' : 'w-0'}`}>
                      <form onSubmit={handleSearch}>
                        <Input
                          type="text"
                          placeholder="Search luxury collections..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-4 pr-10 py-2.5 border border-[#D4B5A0] bg-white/90 backdrop-blur text-[#6B4C3A] placeholder:text-[#6B4C3A]/50 rounded-full text-sm focus:outline-none focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 transition-all"
                          data-testid="input-search"
                        />
                      </form>
                    </div>
                  </div>
                  
                  <div className="h-6 w-[1px] bg-[#C5A572]/20 hidden md:block"></div>
                  
                  {/* User actions with hover effects */}
                  <Button variant="ghost" size="icon" className="relative group" data-testid="button-user">
                    <div className="absolute inset-0 bg-[#C5A572]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <User className="h-5 w-5 text-[#6B4C3A] group-hover:text-[#4A1F2A] transition-colors relative z-10" />
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="relative group" data-testid="button-wishlist">
                    <div className="absolute inset-0 bg-[#C5A572]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <Heart className="h-5 w-5 text-[#6B4C3A] group-hover:text-[#4A1F2A] transition-colors relative z-10" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative group"
                    onClick={() => setCartOpen(true)}
                    data-testid="button-cart"
                  >
                    <div className="absolute inset-0 bg-[#C5A572]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                    <ShoppingBag className="h-5 w-5 text-[#6B4C3A] group-hover:text-[#4A1F2A] transition-colors relative z-10" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-br from-[#C5A572] to-[#B8975F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm animate-scale-in" data-testid="text-cart-count">
                        {itemCount}
                      </span>
                    )}
                  </Button>
                  
                  {/* Mobile menu button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="lg:hidden relative group" data-testid="button-mobile-menu">
                        <div className="absolute inset-0 bg-[#C5A572]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                        <Menu className="h-5 w-5 text-[#6B4C3A] group-hover:text-[#4A1F2A] transition-colors relative z-10" />
                      </Button>
                    </SheetTrigger>
                <SheetContent>
                  <nav className="flex flex-col space-y-4 mt-8">
                    <Link href="/collections" data-testid="link-mobile-collections">
                      <span className="text-muted-foreground hover:text-foreground font-medium tracking-wider uppercase text-sm transition-colors cursor-pointer">
                        Dynasty Collections
                      </span>
                    </Link>
                    <Link href="/products?category=Women" data-testid="link-mobile-women">
                      <span className="text-muted-foreground hover:text-foreground font-medium tracking-wider uppercase text-sm transition-colors cursor-pointer">
                        Women
                      </span>
                    </Link>
                    <Link href="/products?category=Men" data-testid="link-mobile-men">
                      <span className="text-muted-foreground hover:text-foreground font-medium tracking-wider uppercase text-sm transition-colors cursor-pointer">
                        Men
                      </span>
                    </Link>
                    <Link href="/products?category=Accessories" data-testid="link-mobile-accessories">
                      <span className="text-muted-foreground hover:text-foreground font-medium tracking-wider uppercase text-sm transition-colors cursor-pointer">
                        Accessories
                      </span>
                    </Link>
                    <Link href="/products?category=Home" data-testid="link-mobile-home">
                      <span className="text-muted-foreground hover:text-foreground font-medium tracking-wider uppercase text-sm transition-colors cursor-pointer">
                        Home & Living
                      </span>
                    </Link>
                    <Link href="/products?sale=true" data-testid="link-mobile-sale">
                      <span className="text-accent hover:text-accent/80 font-medium tracking-wider uppercase text-sm transition-colors cursor-pointer">
                        Sale
                      </span>
                    </Link>
                  </nav>
                </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
            
            {/* Bottom border with gradient */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A572]/20 to-transparent"></div>
          </div>

          {/* Mobile search with enhanced styling */}
          <div className="md:hidden px-4 pb-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search luxury collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-[#D4B5A0] bg-white/90 backdrop-blur text-[#6B4C3A] placeholder:text-[#6B4C3A]/50 rounded-full text-sm focus:outline-none focus:border-[#C5A572] focus:ring-2 focus:ring-[#C5A572]/20 transition-all shadow-sm"
                  data-testid="input-mobile-search"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B4C3A]/60" />
              </div>
            </form>
          </div>
        </div>

        <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      </header>
      
      {/* Add custom animation styles */}
      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

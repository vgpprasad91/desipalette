import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { Product } from "@shared/schema";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: productsResponse, isLoading, error } = useQuery({
    queryKey: ["/api/products"],
  });

  const products = productsResponse?.products || [];
  const featuredProducts = products.slice(0, 6);

  // Show Shopify configuration message if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Shopify Configuration Required</h1>
          <p className="text-gray-600 mb-4">
            This application requires Shopify credentials to load products. Please configure your Shopify store URL and Storefront API access token.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-yellow-800 mb-2">Required Environment Variables:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• SHOPIFY_STORE_URL</li>
              <li>• SHOPIFY_STOREFRONT_ACCESS_TOKEN</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const categories = [
    {
      name: "Women's Fashion",
      description: "Elegant & Contemporary",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      href: "/products?category=Women"
    },
    {
      name: "Men's Collection",
      description: "Sharp & Refined",
      image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      href: "/products?category=Men"
    },
    {
      name: "Accessories",
      description: "Complete Your Look",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      href: "/products?category=Accessories"
    },
    {
      name: "Home & Living",
      description: "Curated Spaces",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500",
      href: "/products?category=Home"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-neutral to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl lg:text-6xl font-bold text-primary mb-6" data-testid="text-hero-title">
                Discover Your 
                <span className="text-accent"> Perfect Style</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed" data-testid="text-hero-description">
                Curated collection of premium fashion and lifestyle products that celebrate culture, comfort, and contemporary design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button className="bg-primary text-white px-8 py-3 hover:bg-gray-800" data-testid="button-shop-collection">
                    Shop New Collection
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="border-2 border-primary text-primary px-8 py-3 hover:bg-primary hover:text-white" data-testid="button-explore-categories">
                    Explore Categories
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000" 
                alt="Stylish woman in contemporary fusion fashion" 
                className="w-full h-auto rounded-2xl shadow-2xl"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-4" data-testid="text-categories-title">
              Shop by Category
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collections designed for the modern lifestyle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={category.name} href={category.href}>
                <div className="group cursor-pointer" data-testid={`category-card-${index}`}>
                  <div className="relative overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid={`img-category-${index}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-semibold text-lg" data-testid={`text-category-name-${index}`}>
                        {category.name}
                      </h4>
                      <p className="text-sm opacity-90" data-testid={`text-category-description-${index}`}>
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-2" data-testid="text-featured-title">
                Featured Products
              </h3>
              <p className="text-gray-600">Hand-picked favorites from our latest collection</p>
            </div>
            <Link href="/products">
              <Button variant="link" className="hidden sm:block text-accent font-semibold hover:text-pink-600" data-testid="button-view-all">
                View All Products →
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-300"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="bg-primary text-white px-8 py-3 hover:bg-gray-800" data-testid="button-load-more">
                Load More Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Trust badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-primary mb-2" data-testid="text-trust-shipping-title">Free Shipping</h4>
              <p className="text-sm text-gray-600">On orders over $100</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-primary mb-2" data-testid="text-trust-payment-title">Secure Payment</h4>
              <p className="text-sm text-gray-600">100% secure checkout</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-primary mb-2" data-testid="text-trust-returns-title">Easy Returns</h4>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-primary mb-2" data-testid="text-trust-support-title">24/7 Support</h4>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
          </div>

          {/* Customer testimonials */}
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-primary mb-4" data-testid="text-testimonials-title">
              What Our Customers Say
            </h3>
            <p className="text-gray-600">Join thousands of satisfied customers who love shopping with us</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral p-6 rounded-xl" data-testid="testimonial-card-0">
              <div className="flex items-center mb-4">
                <div className="flex text-secondary mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4" data-testid="text-testimonial-0">
                "Amazing quality and fast delivery! The kurta I ordered exceeded my expectations. Will definitely shop again."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60" 
                  alt="Customer testimonial" 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold text-primary">Priya Sharma</p>
                  <p className="text-sm text-gray-600">Verified Buyer</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral p-6 rounded-xl" data-testid="testimonial-card-1">
              <div className="flex items-center mb-4">
                <div className="flex text-secondary mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4" data-testid="text-testimonial-1">
                "Love the unique designs and excellent customer service. Desipalette has become my go-to for special occasions."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60" 
                  alt="Customer testimonial" 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold text-primary">Anjali Reddy</p>
                  <p className="text-sm text-gray-600">Verified Buyer</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral p-6 rounded-xl" data-testid="testimonial-card-2">
              <div className="flex items-center mb-4">
                <div className="flex text-secondary mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-gray-700 mb-4" data-testid="text-testimonial-2">
                "Excellent quality products at great prices. The men's collection is particularly impressive with modern cuts and premium fabrics."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60" 
                  alt="Customer testimonial" 
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold text-primary">Rajesh Patel</p>
                  <p className="text-sm text-gray-600">Verified Buyer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProductModal 
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

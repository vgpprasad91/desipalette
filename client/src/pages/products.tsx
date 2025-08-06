import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Filter, SortAsc, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { Product } from "@shared/schema";

export default function Products() {
  const [location] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("name");

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const category = urlParams.get('category') || '';
  const search = urlParams.get('search') || '';

  const { data: productsResponse, isLoading, error } = useQuery({
    queryKey: ["/api/products", { category, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    },
  });

  // Extract products and metadata from response
  const products = productsResponse?.products || [];
  const shopifyEnabled = productsResponse?.shopifyEnabled;

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating) - parseFloat(a.rating);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const categories = ["Women", "Men", "Accessories", "Home"];

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

  return (
    <div className="min-h-screen bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2" data-testid="text-products-title">
              {category ? `${category} Collection` : search ? `Search Results for "${search}"` : 'All Products'}
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <span data-testid="text-products-count">
                {isLoading ? 'Loading...' : `${sortedProducts.length} products found`}
              </span>
              <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                <ExternalLink className="h-3 w-3 inline mr-1" />
                Shopify Powered
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48" data-testid="select-sort">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter - Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden" data-testid="button-mobile-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <Button
                        key={cat}
                        variant={category === cat ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => window.location.href = `/products?category=${cat}`}
                        data-testid={`button-filter-category-${cat.toLowerCase()}`}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-4">Filter by Category</h3>
              <div className="space-y-2">
                <Button
                  variant={!category ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/products'}
                  data-testid="button-filter-all"
                >
                  All Products
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={category === cat ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => window.location.href = `/products?category=${cat}`}
                    data-testid={`button-filter-category-desktop-${cat.toLowerCase()}`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse" data-testid={`skeleton-product-${i}`}>
                    <div className="w-full h-64 bg-gray-300"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-16" data-testid="empty-products">
                <h3 className="text-xl font-semibold text-gray-600 mb-4">No products found</h3>
                <p className="text-gray-500 mb-8">
                  {search ? `No products match "${search}"` : `No products found in ${category || 'this'} category`}
                </p>
                <Button onClick={() => window.location.href = '/products'} data-testid="button-view-all-products">
                  View All Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductModal 
        product={selectedProduct}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}

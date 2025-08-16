import { useState } from "react";
import { Search, TrendingUp, Star, ExternalLink, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchResults from "@/components/SearchResults";
import TrendingSearches from "@/components/TrendingSearches";
import PriceAnalytics from "@/components/PriceAnalytics";
import AdvancedSearch from "@/components/AdvancedSearch";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (term: string, filters: any) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams({
        q: term,
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.priceMin && { priceMin: filters.priceMin }),
        ...(filters.priceMax && { priceMax: filters.priceMax }),
        ...(filters.concentration && { concentration: filters.concentration }),
        ...(filters.size && { size: filters.size })
      });

      const response = await fetch(`${API_BASE_URL}/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data);
      
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search. Please try again.');
      
      // Fallback to mock data for development
      const mockResults = {
        fragrance: {
          name: term,
          brand: "Premium Brand",
          image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
          concentration: "Eau de Parfum",
          size: "100ml",
          rating: 4.6,
          reviews: 1247
        },
        prices: [
          { 
            retailer: "FragranceNet", 
            price: 79.99, 
            stock: "In Stock", 
            url: "https://www.fragrancenet.com/", 
            savings: 25,
            originalPrice: 106.99,
            shipping: "Free shipping",
            eta: "2-3 business days",
            logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=32&h=32&fit=crop"
          },
          { 
            retailer: "Jomashop", 
            price: 72.99, 
            stock: "Limited", 
            url: "https://www.jomashop.com/", 
            savings: 32,
            originalPrice: 106.99,
            shipping: "$5.95",
            eta: "5-7 business days",
            logo: "https://images.unsplash.com/photo-1560472354-b43ff0c44a43?w=32&h=32&fit=crop"
          }
        ]
      };
      setSearchResults(mockResults);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ScentSavvy
                </h1>
                <p className="text-xs text-gray-500">Smart Fragrance Price Comparison</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>7 Trusted Retailers</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Real-time Prices</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>Updated Every Hour</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Enhanced Search */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="space-y-6 mb-12">
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Find the Best
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Perfume Deals</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Search across 7 major retailers instantly and save up to 50% on your favorite fragrances with real-time price comparison
            </p>
          </div>
          
          {/* Enhanced Search Interface */}
          <AdvancedSearch 
            onSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isLoading={isLoading}
          />

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Trending Searches */}
          {!searchResults && <TrendingSearches onSearchClick={setSearchTerm} />}

          {/* Trust Indicators */}
          {!searchResults && (
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">7</div>
                <div className="text-sm text-gray-600">Major Retailers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">50%</div>
                <div className="text-sm text-gray-600">Max Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">Price Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">100K+</div>
                <div className="text-sm text-gray-600">Fragrances</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search Results */}
      {searchResults && (
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchResults results={searchResults} />
            <div className="mt-16">
              <PriceAnalytics results={searchResults} />
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Features Section */}
      {!searchResults && (
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">Why Choose ScentSavvy?</h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The most comprehensive fragrance price comparison platform with advanced analytics and real-time monitoring
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Instant Search</h4>
                <p className="text-gray-600 leading-relaxed">
                  Search across 7 major retailers in seconds with our lightning-fast comparison engine and get real-time results
                </p>
              </div>
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Smart Analytics</h4>
                <p className="text-gray-600 leading-relaxed">
                  Track price trends, analyze market data, and get insights on the best times to buy your favorite fragrances
                </p>
              </div>
              <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-4 text-gray-900">Price Alerts</h4>
                <p className="text-gray-600 leading-relaxed">
                  Set custom price alerts and get notified instantly when your watched fragrances drop to your target price
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">ScentSavvy</h1>
            </div>
            <p className="text-gray-400 mb-6">The ultimate fragrance price comparison platform</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <span>✓ 7 Major Retailers</span>
              <span>✓ Real-time Pricing</span>
              <span>✓ Price History</span>
              <span>✓ Smart Alerts</span>
              <span>✓ Mobile Optimized</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

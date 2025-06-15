
import { useState } from "react";
import { Search, TrendingUp, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SearchResults from "@/components/SearchResults";
import TrendingSearches from "@/components/TrendingSearches";
import PriceAnalytics from "@/components/PriceAnalytics";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        fragrance: {
          name: searchTerm,
          brand: "Example Brand",
          image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop",
          concentration: "Eau de Parfum"
        },
        prices: [
          { retailer: "FragranceNet", price: 89.99, stock: "In Stock", url: "#", savings: 15 },
          { retailer: "FragranceX", price: 94.99, stock: "In Stock", url: "#", savings: 10 },
          { retailer: "Jomashop", price: 79.99, stock: "Limited", url: "#", savings: 25 },
          { retailer: "FragranceShop", price: 99.99, stock: "In Stock", url: "#", savings: 5 },
          { retailer: "AuraFragrance", price: 87.99, stock: "Out of Stock", url: "#", savings: 17 },
          { retailer: "FragFlex", price: 82.99, stock: "In Stock", url: "#", savings: 22 },
          { retailer: "FragranceBuy", price: 91.99, stock: "In Stock", url: "#", savings: 13 },
          { retailer: "PerfumeWorld", price: 86.99, stock: "In Stock", url: "#", savings: 18 }
        ]
      };
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ScentSavvy</h1>
            </div>
            <div className="text-sm text-gray-600">Compare prices across 8 retailers</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find the Best Perfume Deals
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Search across 8 major retailers instantly and save up to 50% on your favorite fragrances
          </p>
          
          {/* Search Interface */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for any perfume or cologne..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2 rounded-lg"
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {/* Trending Searches */}
          {!searchResults && <TrendingSearches onSearchClick={setSearchTerm} />}
        </div>
      </section>

      {/* Search Results */}
      {searchResults && (
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchResults results={searchResults} />
            <div className="mt-12">
              <PriceAnalytics results={searchResults} />
            </div>
          </div>
        </section>
      )}

      {/* Features Section (when no search results) */}
      {!searchResults && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ScentSavvy?</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Instant Search</h4>
                <p className="text-gray-600">Search across 8 major retailers in seconds</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Price Analytics</h4>
                <p className="text-gray-600">Track price trends and find the best deals</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Smart Alerts</h4>
                <p className="text-gray-600">Get notified when prices drop</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;

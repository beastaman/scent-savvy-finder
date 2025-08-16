import { useState, useRef, useEffect } from "react";
import { Search, Filter, TrendingUp, Star, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdvancedSearchProps {
  onSearch: (term: string, filters: any) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
}

const AdvancedSearch = ({ onSearch, searchTerm, setSearchTerm, isLoading }: AdvancedSearchProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    priceMin: "",
    priceMax: "",
    concentration: "",
    size: ""
  });

  const searchRef = useRef<HTMLDivElement>(null);

  // Enhanced suggestions with categories
  const popularSuggestions = [
    { name: "Dior Sauvage", category: "Men's", trending: true },
    { name: "Chanel No. 5", category: "Women's", trending: true },
    { name: "Tom Ford Black Orchid", category: "Unisex", trending: true },
    { name: "Creed Aventus", category: "Men's", trending: false },
    { name: "YSL Black Opium", category: "Women's", trending: true },
    { name: "Giorgio Armani Acqua di Gio", category: "Men's", trending: false },
    { name: "Bleu de Chanel", category: "Men's", trending: false },
    { name: "Versace Eros", category: "Men's", trending: true },
    { name: "Dolce & Gabbana Light Blue", category: "Unisex", trending: false },
    { name: "Calvin Klein Eternity", category: "Unisex", trending: false }
  ];

  const filteredSuggestions = popularSuggestions.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm.length > 0
  );

  const brands = [
    "Dior", "Chanel", "Tom Ford", "Creed", "YSL", "Giorgio Armani", 
    "Versace", "Calvin Klein", "Dolce & Gabbana", "Prada", "Gucci", "Hermès"
  ];
  const concentrations = ["EDT", "EDP", "Parfum", "Cologne"];
  const sizes = ["30ml", "50ml", "75ml", "100ml", "125ml", "150ml", "200ml"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm, filters);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion, filters);
  };

  const clearFilters = () => {
    setFilters({
      brand: "",
      priceMin: "",
      priceMax: "",
      concentration: "",
      size: ""
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Search Bar */}
      <div ref={searchRef} className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
              <Search className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search for your favorite fragrance... (e.g., Dior Sauvage, Chanel No. 5)"
              className="w-full pl-16 pr-32 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300 shadow-lg hover:shadow-xl bg-white"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-300 hover:border-blue-500 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </Button>
              <Button 
                type="submit" 
                disabled={!searchTerm.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Search Suggestions */}
        {showSuggestions && (searchTerm.length > 0 ? filteredSuggestions.length > 0 : true) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
            {searchTerm.length === 0 ? (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
                  Popular Searches
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {popularSuggestions.slice(0, 6).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(item.name)}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{item.name}</span>
                        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {item.category}
                        </span>
                      </div>
                      {item.trending && (
                        <Star className="w-4 h-4 text-orange-500 fill-current" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Suggestions</h3>
                {filteredSuggestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item.name)}
                    className="flex items-center justify-between w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    {item.trending && (
                      <Star className="w-4 h-4 text-orange-500 fill-current" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Advanced Filters
            </h3>
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <div className="relative">
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Min Price</label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
                placeholder="$0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Max Price</label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
                placeholder="$500"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Concentration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Concentration</label>
              <div className="relative">
                <select
                  value={filters.concentration}
                  onChange={(e) => setFilters(prev => ({ ...prev, concentration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="">All Types</option>
                  {concentrations.map(conc => (
                    <option key={conc} value={conc}>{conc}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <div className="relative">
                <select
                  value={filters.size}
                  onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="">All Sizes</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={() => onSearch(searchTerm, filters)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Quick Search Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {["Dior Sauvage", "Chanel No. 5", "Tom Ford", "Creed Aventus", "YSL Black Opium"].map((tag) => (
          <button
            key={tag}
            onClick={() => handleSuggestionClick(tag)}
            className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full text-sm font-medium transition-colors duration-200"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdvancedSearch;

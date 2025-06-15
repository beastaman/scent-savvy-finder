
import { useState, useRef, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const suggestions = [
    "Dior Sauvage",
    "Chanel No. 5",
    "Tom Ford Black Orchid",
    "Creed Aventus",
    "Yves Saint Laurent Black Opium",
    "Giorgio Armani Acqua di Gio",
    "Bleu de Chanel",
    "Versace Eros",
    "Dolce & Gabbana Light Blue",
    "Calvin Klein Eternity"
  ].filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm.length > 0
  );

  const brands = ["Dior", "Chanel", "Tom Ford", "Creed", "YSL", "Giorgio Armani", "Versace", "Calvin Klein"];
  const concentrations = ["EDT", "EDP", "Parfum", "Cologne"];
  const sizes = ["30ml", "50ml", "100ml", "150ml"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    onSearch(searchTerm, filters);
    setShowSuggestions(false);
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
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main Search Bar */}
      <div ref={searchRef} className="relative">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-500 transition-colors" />
          <Input
            type="text"
            placeholder="Search for any perfume or cologne..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => setShowSuggestions(searchTerm.length > 0)}
            className="pl-12 pr-20 py-6 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 bg-white"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className={`rounded-lg ${showFilters ? 'bg-blue-50 border-blue-300' : ''} ${hasActiveFilters ? 'bg-blue-100 border-blue-400' : ''}`}
            >
              <Filter className="w-4 h-4" />
              {hasActiveFilters && <span className="ml-1 text-xs bg-blue-500 text-white rounded-full w-2 h-2"></span>}
            </Button>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors first:rounded-t-xl last:rounded-b-xl border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Brand Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <div className="relative">
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({...filters, brand: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
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
              <label className="text-sm font-medium text-gray-700">Min Price</label>
              <Input
                type="number"
                placeholder="$0"
                value={filters.priceMin}
                onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Max Price</label>
              <Input
                type="number"
                placeholder="$500"
                value={filters.priceMax}
                onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                className="border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Concentration */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Concentration</label>
              <div className="relative">
                <select
                  value={filters.concentration}
                  onChange={(e) => setFilters({...filters, concentration: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
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
              <label className="text-sm font-medium text-gray-700">Size</label>
              <div className="relative">
                <select
                  value={filters.size}
                  onChange={(e) => setFilters({...filters, size: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
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
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;

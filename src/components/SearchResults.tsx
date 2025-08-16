import { useState } from "react";
import { Star, ExternalLink, ShoppingCart, Heart, Share2, TrendingDown, TrendingUp, Package, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  results: {
    fragrance: {
      name: string;
      brand: string;
      image: string;
      concentration: string;
      size: string;
      rating: number;
      reviews: number;
    };
    prices: Array<{
      retailer: string;
      price: number;
      stock: string;
      url: string;
      savings: number;
      originalPrice: number;
      shipping: string;
      eta: string;
      logo: string;
    }>;
  };
}

const SearchResults = ({ results }: SearchResultsProps) => {
  const [sortBy, setSortBy] = useState<'price' | 'savings' | 'retailer'>('price');
  const { fragrance, prices } = results;
  
  const sortedPrices = [...prices].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'savings':
        return b.savings - a.savings;
      case 'retailer':
        return a.retailer.localeCompare(b.retailer);
      default:
        return 0;
    }
  });

  const lowestPrice = Math.min(...prices.map(p => p.price));
  const highestPrice = Math.max(...prices.map(p => p.price));
  const averagePrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
  const totalSavings = Math.max(...prices.map(p => p.originalPrice - p.price));

  const getStockColor = (stock: string) => {
    switch (stock) {
      case "In Stock": return "bg-green-100 text-green-800 border-green-200";
      case "Limited": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Out of Stock": return "bg-red-100 text-red-800 border-red-200";
      case "Pre-order": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const getPriceChangeIcon = (price: number) => {
    if (price === lowestPrice) return <TrendingDown className="w-4 h-4 text-green-500" />;
    if (price === highestPrice) return <TrendingUp className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Enhanced Fragrance Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-shrink-0">
            <img
              src={fragrance.image}
              alt={fragrance.name}
              className="w-48 h-48 object-cover rounded-xl shadow-lg mx-auto lg:mx-0"
            />
          </div>
          
          <div className="flex-grow space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{fragrance.name}</h1>
              <p className="text-xl text-gray-600 mb-4">by {fragrance.brand}</p>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  {fragrance.concentration}
                </span>
                <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                  {fragrance.size}
                </span>
                <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium text-gray-700">
                    {fragrance.rating} ({fragrance.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-green-600">{formatPrice(lowestPrice)}</div>
                <div className="text-sm text-gray-500">Lowest Price</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{formatPrice(averagePrice)}</div>
                <div className="text-sm text-gray-500">Average Price</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{formatPrice(totalSavings)}</div>
                <div className="text-sm text-gray-500">Max Savings</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-purple-600">{prices.length}</div>
                <div className="text-sm text-gray-500">Retailers</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" className="flex items-center">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Price Comparison Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Price Comparison</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'savings' | 'retailer')}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price">Price (Low to High)</option>
                <option value="savings">Savings (High to Low)</option>
                <option value="retailer">Retailer (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retailer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Savings
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shipping
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPrices.map((retailer, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={retailer.logo}
                        alt={retailer.retailer}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{retailer.retailer}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Truck className="w-3 h-3 mr-1" />
                          {retailer.eta}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900 flex items-center">
                          {formatPrice(retailer.price)}
                          {getPriceChangeIcon(retailer.price)}
                          {retailer.price === lowestPrice && (
                            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                              Best Price
                            </span>
                          )}
                        </div>
                        {retailer.originalPrice > retailer.price && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(retailer.originalPrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      ${(retailer.originalPrice - retailer.price).toFixed(2)} ({retailer.savings}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStockColor(retailer.stock)}`}>
                      <Package className="w-3 h-3 mr-1" />
                      {retailer.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{retailer.shipping}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={retailer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Clock className="w-4 h-4 mr-2" />
          Set Price Alert
        </Button>
        <Button variant="outline">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Price History
        </Button>
        <Button variant="outline">
          <Package className="w-4 h-4 mr-2" />
          Compare Similar Fragrances
        </Button>
      </div>
    </div>
  );
};

export default SearchResults;

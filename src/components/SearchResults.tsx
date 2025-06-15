
import { ExternalLink, TrendingUp, Package, Star, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const { fragrance, prices } = results;
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0];
  const highestPrice = sortedPrices[sortedPrices.length - 1];
  const averagePrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
  const totalSavings = lowestPrice.originalPrice - lowestPrice.price;

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Fragrance Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-xl p-8 border border-blue-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="relative group">
            <img 
              src={fragrance.image} 
              alt={fragrance.name}
              className="w-40 h-40 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{fragrance.name}</h2>
              <p className="text-2xl text-blue-600 font-semibold mb-2">{fragrance.brand}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                  {fragrance.concentration}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                  {fragrance.size}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{fragrance.rating}</span>
                  <span className="text-sm text-gray-500">({fragrance.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-3xl font-bold text-green-600">{formatPrice(lowestPrice.price)}</p>
              <p className="text-sm text-gray-500">Best Price</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-3xl font-bold text-blue-600">{formatPrice(averagePrice)}</p>
              <p className="text-sm text-gray-500">Average</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-3xl font-bold text-purple-600">{formatPrice(totalSavings)}</p>
              <p className="text-sm text-gray-500">You Save</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md">
              <p className="text-3xl font-bold text-orange-600">{lowestPrice.savings}%</p>
              <p className="text-sm text-gray-500">Max Discount</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Price Comparison Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Price Comparison</h3>
              <p className="text-gray-600">Comparing prices across 8 major retailers</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Updated 2 minutes ago</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Retailer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Shipping
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Savings
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedPrices.map((item, index) => (
                <tr key={item.retailer} className={`
                  ${index === 0 ? "bg-green-50 border-l-4 border-green-400" : "hover:bg-gray-50"} 
                  transition-colors duration-200
                `}>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <img src={item.logo} alt={item.retailer} className="w-8 h-8 rounded" />
                      <div>
                        <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          {item.retailer}
                          {index === 0 && (
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              <Star className="w-3 h-3 mr-1" />
                              Best Deal
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{item.eta}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900">{formatPrice(item.price)}</div>
                      {item.originalPrice > item.price && (
                        <div className="text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <Badge className={`${getStockColor(item.stock)} border`}>
                      <Package className="w-3 h-3 mr-1" />
                      {item.stock}
                    </Badge>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.shipping}</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="text-lg font-bold text-green-600">{item.savings}% off</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap">
                    <Button 
                      variant={index === 0 ? "default" : "outline"}
                      size="sm"
                      disabled={item.stock === "Out of Stock"}
                      className={`
                        flex items-center gap-2 transition-all duration-200
                        ${index === 0 ? "bg-green-600 hover:bg-green-700 shadow-lg" : "hover:shadow-md"}
                        ${item.stock === "Out of Stock" ? "opacity-50" : "hover:scale-105"}
                      `}
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {item.stock === "Out of Stock" ? "Unavailable" : "Visit Store"}
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          variant="outline" 
          className="bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300"
        >
          <Star className="w-4 h-4 mr-2" />
          Add to Watchlist
        </Button>
        <Button 
          variant="outline"
          className="bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Set Price Alert
        </Button>
        <Button 
          variant="outline"
          className="bg-white hover:bg-green-50 border-green-200 hover:border-green-300"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Share Results
        </Button>
      </div>
    </div>
  );
};

export default SearchResults;

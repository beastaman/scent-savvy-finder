
import { ExternalLink, TrendingUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchResultsProps {
  results: {
    fragrance: {
      name: string;
      brand: string;
      image: string;
      concentration: string;
    };
    prices: Array<{
      retailer: string;
      price: number;
      stock: string;
      url: string;
      savings: number;
    }>;
  };
}

const SearchResults = ({ results }: SearchResultsProps) => {
  const { fragrance, prices } = results;
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedPrices[0];
  const highestPrice = sortedPrices[sortedPrices.length - 1];
  const averagePrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;

  const getStockColor = (stock: string) => {
    switch (stock) {
      case "In Stock": return "bg-green-100 text-green-800";
      case "Limited": return "bg-yellow-100 text-yellow-800";
      case "Out of Stock": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Fragrance Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <img 
            src={fragrance.image} 
            alt={fragrance.name}
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{fragrance.name}</h2>
            <p className="text-xl text-gray-600 mb-2">{fragrance.brand}</p>
            <p className="text-lg text-gray-500">{fragrance.concentration}</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">${lowestPrice.price}</p>
              <p className="text-sm text-gray-500">Best Price</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">${averagePrice.toFixed(2)}</p>
              <p className="text-sm text-gray-500">Average</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{lowestPrice.savings}%</p>
              <p className="text-sm text-gray-500">Max Savings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Comparison Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Price Comparison</h3>
          <p className="text-gray-600">Comparing prices across 8 retailers</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Retailer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Savings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPrices.map((item, index) => (
                <tr key={item.retailer} className={index === 0 ? "bg-green-50" : ""}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {item.retailer}
                        {index === 0 && (
                          <Badge className="ml-2 bg-green-100 text-green-800">Best Deal</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-semibold text-gray-900">${item.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStockColor(item.stock)}>
                      <Package className="w-3 h-3 mr-1" />
                      {item.stock}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">{item.savings}% off</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={item.stock === "Out of Stock"}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Site
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

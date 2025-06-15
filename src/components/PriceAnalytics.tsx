
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, BarChart3, Package, DollarSign } from "lucide-react";

interface PriceAnalyticsProps {
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

const PriceAnalytics = ({ results }: PriceAnalyticsProps) => {
  const { prices } = results;
  
  // Mock price history data
  const priceHistoryData = [
    { date: "1 week ago", price: 95 },
    { date: "5 days ago", price: 92 },
    { date: "3 days ago", price: 89 },
    { date: "Yesterday", price: 87 },
    { date: "Today", price: 85 }
  ];

  // Prepare data for retailer comparison chart
  const retailerData = prices.map(p => ({
    retailer: p.retailer.split(' ')[0], // Shorten names for chart
    price: p.price,
    inStock: p.stock === "In Stock" ? 1 : 0
  })).sort((a, b) => a.price - b.price);

  const lowestPrice = Math.min(...prices.map(p => p.price));
  const highestPrice = Math.max(...prices.map(p => p.price));
  const averagePrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
  const inStockCount = prices.filter(p => p.stock === "In Stock").length;

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Price Analytics</h3>
        <p className="text-gray-600">Detailed market insights and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">Lowest Price</h4>
          <p className="text-2xl font-bold text-green-600">${lowestPrice}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">Average Price</h4>
          <p className="text-2xl font-bold text-blue-600">${averagePrice.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">Price Range</h4>
          <p className="text-2xl font-bold text-purple-600">${(highestPrice - lowestPrice).toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-orange-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">In Stock</h4>
          <p className="text-2xl font-bold text-orange-600">{inStockCount}/{prices.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price History Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Price Trend (Last Week)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Retailer Comparison Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Retailer Price Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={retailerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="retailer" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="price" 
                fill="#8b5cf6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Market Insights */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Market Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Best Time to Buy</h5>
            <p className="text-sm text-gray-600">Prices have dropped 12% this week</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Stock Status</h5>
            <p className="text-sm text-gray-600">{inStockCount} of {prices.length} retailers have stock</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Price Volatility</h5>
            <p className="text-sm text-gray-600">Moderate - prices vary by ${(highestPrice - lowestPrice).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalytics;

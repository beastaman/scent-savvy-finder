import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, BarChart3, Package, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";

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
      originalPrice: number;
      shipping: string;
      eta: string;
    }>;
  };
}

const PriceAnalytics = ({ results }: PriceAnalyticsProps) => {
  const { prices } = results;
  
  // Mock price history data with more realistic trends
  const priceHistoryData = [
    { date: "30 days ago", price: 98, trend: "stable" },
    { date: "25 days ago", price: 95, trend: "down" },
    { date: "20 days ago", price: 92, trend: "down" },
    { date: "15 days ago", price: 89, trend: "down" },
    { date: "10 days ago", price: 87, trend: "stable" },
    { date: "5 days ago", price: 85, trend: "down" },
    { date: "Today", price: Math.min(...prices.map(p => p.price)), trend: "current" }
  ];

  // Prepare data for retailer comparison chart
  const retailerData = prices.map(p => ({
    retailer: p.retailer.split(' ')[0], // Shorten names for chart
    price: p.price,
    inStock: p.stock === "In Stock" ? 1 : 0,
    savings: p.savings || 0,
    shipping: p.shipping.includes('Free') ? 0 : 5.99
  })).sort((a, b) => a.price - b.price);

  // Stock distribution data
  const stockData = [
    { name: 'In Stock', value: prices.filter(p => p.stock === "In Stock").length, color: '#10b981' },
    { name: 'Limited Stock', value: prices.filter(p => p.stock === "Limited").length, color: '#f59e0b' },
    { name: 'Out of Stock', value: prices.filter(p => p.stock === "Out of Stock").length, color: '#ef4444' }
  ].filter(item => item.value > 0);

  const lowestPrice = Math.min(...prices.map(p => p.price));
  const highestPrice = Math.max(...prices.map(p => p.price));
  const averagePrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
  const inStockCount = prices.filter(p => p.stock === "In Stock").length;
  const totalSavings = Math.max(...prices.map(p => (p.originalPrice || p.price * 1.3) - p.price));
  const priceVolatility = ((highestPrice - lowestPrice) / averagePrice * 100).toFixed(1);

  // Price prediction (mock algorithm)
  const getPricePrediction = () => {
    const recentTrend = priceHistoryData.slice(-3);
    const avgRecentPrice = recentTrend.reduce((sum, item) => sum + item.price, 0) / recentTrend.length;
    const prediction = avgRecentPrice > lowestPrice ? "likely to drop" : "stable";
    return prediction;
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <div className="space-y-8">
      {/* Analytics Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">📊 Advanced Price Analytics</h3>
        <p className="text-gray-600">Deep market insights and intelligent price forecasting</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 text-center border border-green-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">Best Price</h4>
          <p className="text-2xl font-bold text-green-600">{formatPrice(lowestPrice)}</p>
          <p className="text-xs text-green-700 mt-1">🏆 Lowest available</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 text-center border border-blue-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">Market Average</h4>
          <p className="text-2xl font-bold text-blue-600">{formatPrice(averagePrice)}</p>
          <p className="text-xs text-blue-700 mt-1">📈 Across {prices.length} retailers</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl shadow-lg p-6 text-center border border-purple-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">Max Savings</h4>
          <p className="text-2xl font-bold text-purple-600">{formatPrice(totalSavings)}</p>
          <p className="text-xs text-purple-700 mt-1">💰 Potential savings</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-lg p-6 text-center border border-orange-100">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Package className="w-6 h-6 text-orange-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">Availability</h4>
          <p className="text-2xl font-bold text-orange-600">{inStockCount}/{prices.length}</p>
          <p className="text-xs text-orange-700 mt-1">📦 In stock now</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Price History Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Price Trend (30 Days)
            </h4>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              📉 {getPricePrediction()}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceHistoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                stroke="#64748b"
              />
              <YAxis 
                fontSize={12}
                stroke="#64748b"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value: any) => [`$${value}`, 'Price']}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 8, fill: "#1d4ed8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Retailer Comparison Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-purple-500" />
              Retailer Price Comparison
            </h4>
            <div className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Sorted by price
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={retailerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="retailer" 
                fontSize={12}
                stroke="#64748b"
              />
              <YAxis 
                fontSize={12}
                stroke="#64748b"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
                formatter={(value: any, name: string) => [
                  name === 'price' ? `$${value}` : value,
                  name === 'price' ? 'Price' : name
                ]}
              />
              <Bar 
                dataKey="price" 
                fill="url(#colorGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-green-500" />
            Stock Distribution
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {stockData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-yellow-500" />
            Market Insights
          </h4>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center mb-1">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-800">Best Time to Buy</span>
              </div>
              <p className="text-sm text-green-700">Prices dropped 12% this week - good time to purchase</p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center mb-1">
                <BarChart3 className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-blue-800">Price Volatility</span>
              </div>
              <p className="text-sm text-blue-700">{priceVolatility}% variation - moderate price range</p>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center mb-1">
                <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
                <span className="text-sm font-medium text-purple-800">Forecast</span>
              </div>
              <p className="text-sm text-purple-700">Prices {getPricePrediction()} in next 7 days</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-500" />
            Quick Stats
          </h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Price Range</span>
              <span className="font-medium">{formatPrice(highestPrice - lowestPrice)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Free Shipping</span>
              <span className="font-medium">{prices.filter(p => p.shipping.includes('Free')).length} retailers</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Avg Delivery</span>
              <span className="font-medium">3-5 days</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Best Deal</span>
              <span className="font-medium text-green-600">
                {prices.find(p => p.price === lowestPrice)?.retailer || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-blue-100">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🤖 AI-Powered Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h5 className="font-medium text-gray-900 mb-2">💡 Smart Buy Alert</h5>
            <p className="text-sm text-gray-600">
              Current price is {((averagePrice - lowestPrice) / averagePrice * 100).toFixed(0)}% below average. 
              <span className="text-green-600 font-medium"> Excellent deal!</span>
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h5 className="font-medium text-gray-900 mb-2">📈 Price Prediction</h5>
            <p className="text-sm text-gray-600">
              Based on 30-day trends, prices are {getPricePrediction()}. 
              <span className="text-blue-600 font-medium"> Consider buying soon.</span>
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h5 className="font-medium text-gray-900 mb-2">🚚 Shipping Tip</h5>
            <p className="text-sm text-gray-600">
              {prices.filter(p => p.shipping.includes('Free')).length} retailers offer free shipping. 
              <span className="text-purple-600 font-medium"> Save on delivery!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalytics;

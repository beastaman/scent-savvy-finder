import { TrendingUp, Star, ArrowUp, Minus, FireExtinguisher } from "lucide-react";

interface TrendingSearchesProps {
  onSearchClick: (term: string) => void;
}

const TrendingSearches = ({ onSearchClick }: TrendingSearchesProps) => {
  const trendingTerms = [
    { name: "Dior Sauvage", trend: "up", discount: "25%", searches: "+45%", category: "Men's" },
    { name: "Chanel No. 5", trend: "hot", discount: "15%", searches: "+82%", category: "Women's" },
    { name: "Tom Ford Black Orchid", trend: "up", discount: "30%", searches: "+23%", category: "Unisex" },
    { name: "Creed Aventus", trend: "hot", discount: "20%", searches: "+67%", category: "Men's" },
    { name: "YSL Black Opium", trend: "up", discount: "22%", searches: "+34%", category: "Women's" },
    { name: "Acqua di Gio", trend: "stable", discount: "18%", searches: "+12%", category: "Men's" },
    { name: "Versace Eros", trend: "up", discount: "28%", searches: "+56%", category: "Men's" },
    { name: "Dolce & Gabbana Light Blue", trend: "stable", discount: "19%", searches: "+8%", category: "Unisex" }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "hot":
        return <FireExtinguisher className="w-3 h-3 text-red-500 fill-current" />;
      case "up":
        return <ArrowUp className="w-3 h-3 text-green-500" />;
      case "stable":
        return <Minus className="w-3 h-3 text-gray-400" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "hot":
        return "from-red-50 to-orange-50 border-red-200 hover:border-red-300";
      case "up":
        return "from-green-50 to-emerald-50 border-green-200 hover:border-green-300";
      case "stable":
        return "from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300";
      default:
        return "from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300";
    }
  };

  return (
    <div className="mt-12 animate-fadeIn">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Trending Searches</h3>
        <div className="flex items-center gap-2">
          <div className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium animate-pulse">
            🔥 HOT
          </div>
          <div className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
            Updated hourly
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto mb-8">
        {trendingTerms.map((term, index) => (
          <button
            key={index}
            onClick={() => onSearchClick(term.name)}
            className={`group p-4 bg-gradient-to-br ${getTrendColor(term.trend)} border-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 text-left relative overflow-hidden`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTrendIcon(term.trend)}
                  <span className="text-xs font-medium text-gray-600 bg-white/70 px-2 py-1 rounded-full">
                    {term.category}
                  </span>
                </div>
                <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {term.discount} OFF
                </div>
              </div>
              
              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {term.name}
              </h4>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  🔍 {term.searches} searches
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-gray-600">4.{Math.floor(Math.random() * 9) + 1}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            🔥 <strong>Hot trends</strong> - 80%+ increase
          </span>
          <span className="flex items-center gap-1">
            📈 <strong>Rising</strong> - 20%+ increase
          </span>
          <span className="flex items-center gap-1">
            💰 <strong>Best deals</strong> - available now
          </span>
        </p>
        <p className="text-xs text-gray-500">
          Data based on searches in the last 24 hours • Updated every hour
        </p>
      </div>
    </div>
  );
};

export default TrendingSearches;

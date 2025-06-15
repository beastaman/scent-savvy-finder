
import { TrendingUp, Star } from "lucide-react";

interface TrendingSearchesProps {
  onSearchClick: (term: string) => void;
}

const TrendingSearches = ({ onSearchClick }: TrendingSearchesProps) => {
  const trendingTerms = [
    { name: "Dior Sauvage", trend: "up", discount: "25%" },
    { name: "Chanel No. 5", trend: "hot", discount: "15%" },
    { name: "Tom Ford Black Orchid", trend: "up", discount: "30%" },
    { name: "Creed Aventus", trend: "hot", discount: "20%" },
    { name: "YSL Black Opium", trend: "up", discount: "22%" },
    { name: "Acqua di Gio", trend: "stable", discount: "18%" }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "hot":
        return <Star className="w-3 h-3 text-orange-500 fill-current" />;
      case "up":
        return <TrendingUp className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-12 animate-fade-in">
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700">Trending Searches</h3>
        <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
          HOT
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
        {trendingTerms.map((term) => (
          <button
            key={term.name}
            onClick={() => onSearchClick(term.name)}
            className="group relative px-6 py-3 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-2">
              {getTrendIcon(term.trend)}
              <span className="font-medium">{term.name}</span>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded font-medium">
                {term.discount} off
              </span>
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          🔥 <span className="font-medium">Hot deals</span> updated every hour • 
          📈 <span className="font-medium">Trending</span> based on searches • 
          💰 <span className="font-medium">Best discounts</span> available now
        </p>
      </div>
    </div>
  );
};

export default TrendingSearches;

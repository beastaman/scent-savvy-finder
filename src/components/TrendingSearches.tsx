
import { TrendingUp } from "lucide-react";

interface TrendingSearchesProps {
  onSearchClick: (term: string) => void;
}

const TrendingSearches = ({ onSearchClick }: TrendingSearchesProps) => {
  const trendingTerms = [
    "Dior Sauvage",
    "Chanel No. 5",
    "Tom Ford Black Orchid",
    "Creed Aventus",
    "Yves Saint Laurent Black Opium",
    "Giorgio Armani Acqua di Gio"
  ];

  return (
    <div className="mt-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Trending Searches</span>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {trendingTerms.map((term) => (
          <button
            key={term}
            onClick={() => onSearchClick(term)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingSearches;

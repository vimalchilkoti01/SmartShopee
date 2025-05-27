import { useState, FormEvent, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { SearchHistory } from "@shared/schema";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState("");

  // Popular search terms
  const popularSearches = [
    "iPhone 14 Pro",
    "Samsung S23",
    "PlayStation 5",
    "Nike Air Max"
  ];

  // Recent searches
  const { data: recentSearches } = useQuery<SearchHistory[]>({
    queryKey: ['/api/recent-searches?limit=5'],
    refetchOnWindowFocus: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      // Send the search query to the parent component
      onSearch(searchInput.trim());
      
      // Navigate directly to the search results page with the query
      window.location.href = `/search?q=${encodeURIComponent(searchInput.trim())}`;
    }
  };

  const handlePopularSearch = (term: string) => {
    setSearchInput(term);
    onSearch(term);
    
    // Navigate directly to the search results page with the query
    window.location.href = `/search?q=${encodeURIComponent(term)}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-4 mt-6 text-gray-800 mx-auto max-w-3xl">
      <form onSubmit={handleSubmit} className="relative flex flex-col md:flex-row">
        <div className="flex-grow relative">
          <Input
            type="search"
            placeholder="Search for any product..."
            className="w-full py-6 pl-12 pr-4 rounded-lg text-lg mb-3 md:mb-0"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
        </div>
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary-dark text-white font-semibold py-6 px-6 rounded-lg transition md:ml-2 text-lg flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          Search Deals
        </Button>
      </form>

      {/* Popular searches */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <span className="text-sm text-gray-500 mr-2 mt-1">Popular:</span>
        {popularSearches.map((term) => (
          <button
            key={term}
            onClick={() => handlePopularSearch(term)}
            className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition"
          >
            {term}
          </button>
        ))}
      </div>

      {/* Recent searches - shown only if there are results */}
      {recentSearches && recentSearches.length > 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <span className="text-sm text-gray-500 mr-2 mt-1">Recent:</span>
          {recentSearches.map((search) => (
            <button
              key={search.id}
              onClick={() => handlePopularSearch(search.query)}
              className="text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full text-blue-700 transition"
            >
              {search.query}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

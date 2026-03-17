'use client';

import { Search, Sparkles, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onAISearch?: (query: string) => Promise<void>;
  placeholder?: string;
  aiEnabled?: boolean;
}

export default function SearchBar({ onSearch, onAISearch, placeholder = 'Search prompts...', aiEnabled = false }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isAISearching, setIsAISearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleAISearch = async () => {
    if (!onAISearch || !query.trim()) return;
    setIsAISearching(true);
    try {
      await onAISearch(query);
    } finally {
      setIsAISearching(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      {aiEnabled && (
        <button
          type="button"
          onClick={handleAISearch}
          disabled={isAISearching || !query.trim()}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium flex items-center gap-2 hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAISearching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          AI Search
        </button>
      )}
    </form>
  );
}

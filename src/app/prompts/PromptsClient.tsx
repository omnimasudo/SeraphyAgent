"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Sparkles, SlidersHorizontal, Loader2, FileQuestion, ChevronLeft, ChevronRight } from "lucide-react";
import PromptCard from "@/components/PromptCard";
import SeraphyChatWidget from "@/components/SeraphyChatWidget";
import Image from "next/image";

// Interface disesuaikan dengan struktur JSON baru
interface Prompt {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  type?: string;
  for_devs?: boolean;
  category?: string;
  tags?: string[];
  contributors?: string[];
  word_count?: number;
  char_count?: number;
  description?: string;
}

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface PromptsClientProps {
  initialPrompts: Prompt[];
  initialCategories: Category[];
}

export default function PromptsClient({ initialPrompts, initialCategories }: PromptsClientProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);

  // Filters & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset pagination ke halaman 1 setiap kali filter atau pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Filter Logic (Sekarang mencakup Tags dan Contributors)
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const searchLower = searchQuery.toLowerCase();

      // Search in title, content, description, tags, and contributors
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchLower) ||
        prompt.content.toLowerCase().includes(searchLower) ||
        prompt.description?.toLowerCase().includes(searchLower) ||
        prompt.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        prompt.contributors?.some(c => c.toLowerCase().includes(searchLower));

      // Category filter
      const matchesCategory =
        selectedCategory === "all" || prompt.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [prompts, searchQuery, selectedCategory]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  const paginatedPrompts = filteredPrompts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination Controls
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                AI Prompts
              </h1>
              <p className="text-slate-600 mt-1">
                Discover and use powerful AI prompts crafted by the community
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Sparkles className="w-4 h-4" />
                <span>{prompts.length} prompts available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search prompts by title, content, tags, or contributors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-600">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Category: {categories.find(c => c.slug === selectedCategory)?.name}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-slate-600">Loading prompts...</span>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <FileQuestion className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No prompts found</h3>
            <p className="text-slate-500">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}

        {/* Prompts Grid */}
        {!isLoading && paginatedPrompts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        page === currentPage
                          ? "bg-blue-500 text-white"
                          : "text-slate-500 bg-white border border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <SeraphyChatWidget />
    </div>
  );
}
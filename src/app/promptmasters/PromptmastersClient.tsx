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

interface PromptmastersClientProps {
  initialMasters: any[];
}

export default function PromptmastersClient({ initialMasters }: PromptmastersClientProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialMasters);
  const [categories, setCategories] = useState<Category[]>([]);
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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesRes = await fetch("/data/categories.json");
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];
        setCategories(categoriesData.length > 0 ? categoriesData : [
          { id: "1", slug: "coding", name: "Coding" },
          { id: "2", slug: "writing", name: "Writing" },
          { id: "3", slug: "marketing", name: "Marketing" },
          { id: "4", slug: "business", name: "Business" },
          { id: "5", slug: "development", name: "Development" },
        ]);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setCategories([
          { id: "1", slug: "coding", name: "Coding" },
          { id: "2", slug: "writing", name: "Writing" },
          { id: "3", slug: "marketing", name: "Marketing" },
          { id: "4", slug: "business", name: "Business" },
          { id: "5", slug: "development", name: "Development" },
        ]);
      }
    };
    loadCategories();
  }, []);

  // Filter Logic (Sekarang mencakup Tags dan Contributors)
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        prompt.title?.toLowerCase().includes(searchLower) ||
        prompt.content?.toLowerCase().includes(searchLower) ||
        prompt.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        prompt.contributors?.some(c => c.toLowerCase().includes(searchLower));
        
      const matchesCategory = 
        selectedCategory === "all" || prompt.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [prompts, searchQuery, selectedCategory]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  const currentPrompts = filteredPrompts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 pt-24 pb-20 relative">
      
      <SeraphyChatWidget />

      <section className="container mx-auto px-4 max-w-7xl mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider rounded-full bg-cyan-100 text-cyan-700 border border-cyan-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prompt Directory</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Prompts</span>
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Explore our curated collection of high-quality prompts. Search by keyword, tag, or creator to find exactly what you need.
            </p>
          </div>

          <div className="relative w-full md:w-96 flex-shrink-0 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search prompts, tags, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 bg-white border border-zinc-200 rounded-2xl text-sm shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500 mr-2 flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4" /> Filters:
          </div>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-zinc-900 text-white shadow-md"
                : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
            }`}
          >
            All Prompts
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                selectedCategory === category.slug
                  ? "bg-zinc-900 text-white shadow-md"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 max-w-7xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
            <p className="font-medium animate-pulse">Loading amazing prompts...</p>
          </div>
        ) : filteredPrompts.length > 0 ? (
          <>
            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {currentPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:border-cyan-200 hover:text-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1 px-4">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    if (totalPages > 5 && Math.abs(currentPage - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                      if (Math.abs(currentPage - pageNum) === 2) return <span key={idx} className="text-zinc-400 px-1">...</span>;
                      return null;
                    }
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                          currentPage === pageNum 
                            ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 scale-105" 
                            : "text-zinc-500 hover:bg-cyan-50 hover:text-cyan-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:border-cyan-200 hover:text-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white border border-zinc-200 rounded-3xl shadow-sm">
            <div className="w-20 h-20 mb-6 bg-zinc-100 rounded-full flex items-center justify-center">
              <FileQuestion className="w-10 h-10 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No prompts found</h3>
            <p className="text-zinc-500 max-w-md mx-auto mb-8">
              We couldn't find any prompts matching "{searchQuery}".
            </p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="px-6 py-3 bg-zinc-900 text-white font-semibold rounded-xl transition-all shadow-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
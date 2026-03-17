"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Zap, Loader2, Sparkles, Filter, X } from "lucide-react";
import SkillCard from "@/components/SkillCard";
import { getCategoryConfig } from "@/lib/categoryUtils";

interface SkillsClientProps {
  initialSkills: any[];
  initialCategories: any[];
}

export default function SkillsClient({ initialSkills, initialCategories }: SkillsClientProps) {
  const [skills, setSkills] = useState<any[]>(initialSkills);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [isLoading, setIsLoading] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Increased to 12 for better grid layout

  useEffect(() => {
    // Normalize skills data - initialSkills is always an array from server component
    const skillsArray = Array.isArray(initialSkills) ? initialSkills : [];

    // Sort categories by count if available, or just take top ones
    let sortedCats = Array.isArray(initialCategories) ? initialCategories : [];
    if (sortedCats.length > 0 && sortedCats[0].count !== undefined) {
      sortedCats = sortedCats.sort((a: any, b: any) => b.count - a.count);
    }

    setSkills(skillsArray);
    setCategories([{ name: "All", slug: "all" }, ...sortedCats]);
  }, [initialSkills, initialCategories]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const searchLower = searchQuery.toLowerCase();

      // Search in title, description, author, and tags
      const matchesSearch =
        skill.title?.toLowerCase().includes(searchLower) ||
        skill.description?.toLowerCase().includes(searchLower) ||
        skill.author?.toLowerCase().includes(searchLower) ||
        skill.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower));

      // Category filter
      const matchesCategory = activeCategory === "All" || skill.category === activeCategory || (categories.find(c => c.name === activeCategory)?.name === skill.category);

      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, activeCategory, categories]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const paginatedSkills = filteredSkills.slice(
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
                AI Skills
              </h1>
              <p className="text-slate-600 mt-1">
                Discover and use powerful AI skills crafted by the community
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Zap className="w-4 h-4" />
                <span>{skills.length} skills available</span>
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
                placeholder="Search skills by title, description, author, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || activeCategory !== "All") && (
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
              {activeCategory !== "All" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Category: {activeCategory}
                  <button
                    onClick={() => setActiveCategory("All")}
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
            <span className="ml-2 text-slate-600">Loading skills...</span>
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredSkills.length === 0 && (
          <div className="text-center py-12">
            <X className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No skills found</h3>
            <p className="text-slate-500">
              Try adjusting your search terms or category filter
            </p>
          </div>
        )}

        {/* Skills Grid */}
        {!isLoading && paginatedSkills.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedSkills.map((skill) => (
                <SkillCard key={skill.id || skill.slug} skill={skill} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
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
                  className="px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
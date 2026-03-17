"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Zap, Loader2, Cpu, ArrowRight, ChevronLeft, ChevronRight, X, Sparkles, Filter } from "lucide-react";
import SkillCard from "@/components/SkillCard";
import SeraphyChatModal from "@/components/SeraphyChatModal";

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Ask Seraphy State
  const [isSeraphyOpen, setIsSeraphyOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [skillsRes, catsRes] = await Promise.all([
          fetch("/data/skills.json"),
          fetch("/data/skills-categories.json")
        ]);

        const skillsData = skillsRes.ok ? await skillsRes.json() : {};
        const catsData = catsRes.ok ? await catsRes.json() : [];

        // Normalize skills data
        const skillsArray = Array.isArray(skillsData) ? skillsData : (skillsData.skills || []);
        
        setSkills(skillsArray);
        setCategories([{ name: "All", slug: "all" }, ...(Array.isArray(catsData) ? catsData : [])]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setSkills([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory]);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        skill.name?.toLowerCase().includes(searchLower) ||
        skill.title?.toLowerCase().includes(searchLower) ||
        skill.description?.toLowerCase().includes(searchLower);
      
      const matchesCategory = activeCategory === "All" || skill.category === activeCategory || (categories.find(c => c.name === activeCategory)?.name === skill.category);
      
      // Note: skills-categories.json logic can be implemented similarly if needed,
      // currently defaulting to categories.json for consistent UI.

      return matchesSearch && matchesCategory;
    });
  }, [skills, searchQuery, activeCategory, categories]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const currentSkills = filteredSkills.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 pt-24 pb-20">
      
      {/* Ask Seraphy Modal */}
      {isSeraphyOpen && (
          <SeraphyChatModal isOpen={isSeraphyOpen} onClose={() => setIsSeraphyOpen(false)} />
      )}

      {/* Header Section */}
      <section className="container mx-auto px-4 max-w-7xl mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider rounded-full bg-cyan-100 text-cyan-700 border border-cyan-200">
              <Zap className="w-3.5 h-3.5" />
              <span>Powerful Agents</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-zinc-900">
              AI Skills & Tools
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Supercharge your workflow with custom AI skills, agents, and specialized tools built for specific tasks.
            </p>
          </div>
        </div>

        {/* Distinct Search & Filter Bar */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-200 mb-8 max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
                
                {/* Search Input - Distinct Style - Larger and clearer */}
                <div className="relative w-full md:w-80 lg:w-96 flex-shrink-0 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-cyan-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-11 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all hover:bg-zinc-100 focus:bg-white"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600 p-1"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Ask Seraphy Button - Distinct CTA - Repositioned */}
                <button
                    onClick={() => setIsSeraphyOpen(true)}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cyan-500/25 group whitespace-nowrap"
                >
                    <Sparkles className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
                    <span>Ask Seraphy</span>
                </button>

            </div>
            
            {/* Category Filter - Responsive Grid Layout */}
            <div className="mt-6 pt-6 border-t border-zinc-100 w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id || cat.slug || cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold border transition-all select-none ${
                                activeCategory === cat.name
                                ? "bg-cyan-600 text-white border-cyan-600 shadow-md shadow-cyan-500/20 scale-105"
                                : "bg-white text-zinc-500 border-zinc-200 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Grid Content */}
      <section className="container mx-auto px-4 max-w-7xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-cyan-500" />
            <p className="font-medium animate-pulse">Initializing agents...</p>
          </div>
        ) : filteredSkills.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {currentSkills.map((skill, idx) => (
                <SkillCard key={skill.id || idx} skill={skill} />
              ))}
            </div>

            {/* Pagination Controls - Limited View */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 mb-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:border-cyan-200 hover:text-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1.5 px-4 hidden sm:flex">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isNearCurrent = Math.abs(currentPage - pageNum) <= 1;
                    const isEdge = pageNum === 1 || pageNum === totalPages;
                    
                    if (!isNearCurrent && !isEdge) {
                       if (pageNum === 2 || pageNum === totalPages - 1) {
                           return <span key={idx} className="text-zinc-300 px-1 text-xs">•••</span>;
                       }
                       return null;
                    }
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                          currentPage === pageNum 
                            ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/25 scale-110" 
                            : "bg-white border border-zinc-200 text-zinc-500 hover:bg-cyan-50 hover:text-cyan-600 hover:border-cyan-200"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                {/* Mobile Page Indicator */}
                <span className="text-sm font-medium text-zinc-500 sm:hidden px-4">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-500 hover:border-cyan-200 hover:text-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white border border-zinc-200 rounded-3xl shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 mb-6 bg-cyan-50 rounded-full flex items-center justify-center">
              <Filter className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No skills found</h3>
            <p className="text-zinc-500 max-w-md mx-auto mb-8">
              We couldn't find any tools matching your filters. Try adjusting your search query or category filter.
            </p>
            <button 
              onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
              className="px-6 py-3 bg-zinc-900 text-white font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 hover:bg-zinc-800"
            >
              Clear Filters <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

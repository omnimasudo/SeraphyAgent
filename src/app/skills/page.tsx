"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Zap, Loader2, Sparkles, Filter, X } from "lucide-react";
import SkillCard from "@/components/SkillCard";
import { getCategoryConfig } from "@/lib/categoryUtils";


export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Increased to 12 for better grid layout

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
        
        // Sort categories by count if available, or just take top ones
        let sortedCats = Array.isArray(catsData) ? catsData : [];
        if (sortedCats.length > 0 && sortedCats[0].count !== undefined) {
             sortedCats = sortedCats.sort((a: any, b: any) => b.count - a.count);
        }

        setSkills(skillsArray);
        setCategories([{ name: "All", slug: "all" }, ...sortedCats]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback or empty state
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

        {/* Enhanced Search Bar */}
        <div className="relative max-w-3xl mx-auto md:mx-0 mb-10 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-cyan-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search skills, agents, or tools..."
            className="block w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all shadow-sm hover:shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Enhanced Categories - Horizontal Scroll Pills */}
        <div className="relative">
          <div className="flex items-center gap-2 px-1 overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
             <div className="flex items-center gap-2 p-1">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.name;
                  // Use custom color if defined, otherwise default
                  const colorClass = isActive 
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/20 transform scale-105" 
                    : getCategoryConfig(cat.name).badge;
                  
                  return (
                    <button
                      key={cat.slug || cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`
                        whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                        ${colorClass}
                      `}
                    >
                      {cat.name}
                      {cat.count !== undefined && (
                        <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-500'}`}>
                          {cat.count}
                        </span>
                      )}
                    </button>
                  );
                })}
             </div>
          </div>
          {/* Fade effect on right for scrolling hints could be added here */}
        </div>
      </section>

      {/* Grid Content */}
      <section className="container mx-auto px-4 max-w-7xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-600 mb-4" />
            <p className="text-zinc-500 font-medium">Loading skills...</p>
          </div>
        ) : filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentSkills.map((skill, idx) => (
              <SkillCard key={skill.id || idx} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-zinc-300">
            <div className="p-4 bg-zinc-50 rounded-full mb-4">
               <Filter className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-2">No skills found</h3>
            <p className="text-zinc-500 max-w-md text-center">
              We couldn't find any skills matching "{searchQuery}" in {activeCategory}. 
              Try adjusting your search or category filter.
            </p>
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="mt-6 px-6 py-2 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Improved Pagination */}
        {!isLoading && filteredSkills.length > itemsPerPage && (
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-2 p-2 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-600 transition-colors"
                >
                    Previous
                </button>
                <div className="flex items-center gap-1 px-2 border-x border-zinc-100">
                   {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // Simple logic to show first few pages, in real app complex logic needed
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                             currentPage === pageNum 
                             ? 'bg-zinc-900 text-white shadow-sm' 
                             : 'text-zinc-500 hover:bg-zinc-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                   })}
                   {totalPages > 5 && <span className="px-1 text-zinc-400">...</span>}
                </div>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 disabled:opacity-30 disabled:hover:text-zinc-600 transition-colors"
                >
                    Next
                </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

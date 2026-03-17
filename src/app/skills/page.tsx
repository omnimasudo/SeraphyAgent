"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Zap, Loader2, Cpu, ArrowRight } from "lucide-react";
import SkillCard from "@/components/SkillCard";

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSkills = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/data/skills.json");
        const data = res.ok ? await res.json() : [];
        setSkills(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        skill.name?.toLowerCase().includes(searchLower) ||
        skill.title?.toLowerCase().includes(searchLower) ||
        skill.description?.toLowerCase().includes(searchLower)
      );
    });
  }, [skills, searchQuery]);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pt-24 pb-20">
      
      {/* Header Section */}
      <section className="container mx-auto px-4 max-w-7xl mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50">
              <Zap className="w-3.5 h-3.5" />
              <span>Powerful Agents</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              AI Skills & Tools
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Supercharge your workflow with custom AI skills, agents, and specialized tools built for specific tasks.
            </p>
          </div>

          <div className="relative w-full md:w-96 flex-shrink-0 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search skills or agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <section className="container mx-auto px-4 max-w-7xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
            <p className="font-medium animate-pulse">Initializing agents...</p>
          </div>
        ) : filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
            <div className="w-20 h-20 mb-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
              <Cpu className="w-10 h-10 text-indigo-400 dark:text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No skills found</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
              We couldn't find any tools matching "{searchQuery}". Try a different keyword.
            </p>
            <button 
              onClick={() => setSearchQuery("")}
              className="px-6 py-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              Clear Search <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

    </main>
  );
}
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, Trophy, Medal, Users, Loader2, Github, ExternalLink, Sparkles } from "lucide-react";

interface Promptmaster {
  id?: string;
  name: string;
  username: string;
  avatar_url?: string;
  prompts_count?: number;
  bio?: string;
}

export default function PromptmastersPage() {
  const [masters, setMasters] = useState<Promptmaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMasters = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/data/promptmasters.json");
        const data = res.ok ? await res.json() : [];
        
        // Sorting otomatis berdasarkan jumlah prompt (jika ada properti prompts_count)
        const sortedData = Array.isArray(data) 
          ? data.sort((a, b) => (b.prompts_count || 0) - (a.prompts_count || 0))
          : [];
          
        setMasters(sortedData);
      } catch (error) {
        console.error("Failed to fetch promptmasters:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMasters();
  }, []);

  const filteredMasters = useMemo(() => {
    return masters.filter((master) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        master.name?.toLowerCase().includes(searchLower) ||
        master.username?.toLowerCase().includes(searchLower) ||
        master.bio?.toLowerCase().includes(searchLower)
      );
    });
  }, [masters, searchQuery]);

  // Helper untuk menentukan medali (Top 1, 2, 3)
  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-md" />;
    if (index === 1) return <Medal className="w-5 h-5 text-zinc-400 drop-shadow-md" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700 drop-shadow-md" />;
    return <span className="text-sm font-bold text-zinc-400">#{index + 1}</span>;
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pt-24 pb-20">
      
      {/* Header Section */}
      <section className="container mx-auto px-4 max-w-5xl mb-12 text-center relative z-10 pt-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest rounded-full bg-white/50 text-zinc-800 border border-zinc-200/80 shadow-sm backdrop-blur-md transition-colors">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>Top Contributors</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 leading-[1.05]">
          Meet the <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">
            Promptmasters
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-700 leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
          The brilliant minds behind the most powerful AI prompts. Discover their work, follow their styles, and get inspired to create your own.
        </p>

        {/* Search Bar centered */}
        <div className="relative max-w-xl mx-auto group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-amber-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search creators by name or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm shadow-md placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
      </section>

      {/* Grid Content */}
      <section className="container mx-auto px-4 max-w-5xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-500" />
            <p className="font-medium animate-pulse">Loading creators...</p>
          </div>
        ) : filteredMasters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMasters.map((master, index) => (
              <div 
                key={master.username || index}
                className="group relative flex items-start gap-4 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:border-amber-500/30 dark:hover:border-amber-500/30 transition-all duration-300"
              >
                {/* Rank Badge (Absolute top right) */}
                <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-zinc-50 dark:bg-zinc-800 rounded-full">
                  {getRankBadge(index)}
                </div>

                {/* Avatar */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-2xl shadow-inner overflow-hidden border-2 border-white dark:border-zinc-800">
                  {master.avatar_url ? (
                    <img src={master.avatar_url} alt={master.name} className="w-full h-full object-cover" />
                  ) : (
                    master.name?.charAt(0).toUpperCase() || "?"
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow pr-8">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {master.name || master.username}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">@{master.username}</p>
                  
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                      <Users className="w-3.5 h-3.5 text-zinc-500" />
                      {master.prompts_count || Math.floor(Math.random() * 50) + 1} Prompts
                    </span>
                    <Link 
                      href={`https://github.com/${master.username}`} 
                      target="_blank"
                      className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" /> GitHub
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <h3 className="text-2xl font-bold mb-2">No creators found</h3>
            <p className="text-zinc-500">Try searching for a different name.</p>
          </div>
        )}
      </section>
    </main>
  );
}
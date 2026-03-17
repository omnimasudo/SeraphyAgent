"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, Trophy, Medal, Users, Loader2, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

interface Promptmaster {
  rank: number;
  username: string;
  prompt_count: number;
  prompt_ids?: number[];
  name?: string;
  avatar_url?: string;
  bio?: string;
}

const ITEMS_PER_PAGE = 20; // Anda bisa mengubah jumlah item per halaman di sini

export default function PromptmastersPage() {
  const [masters, setMasters] = useState<Promptmaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchMasters = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/data/promptmasters.json");
        const data = res.ok ? await res.json() : [];
        
        // Sorting otomatis berdasarkan jumlah prompt (prompt_count)
        const sortedData = Array.isArray(data) 
          ? data.sort((a, b) => (b.prompt_count || 0) - (a.prompt_count || 0))
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

  // 1. Filter data berdasarkan pencarian
  const filteredMasters = useMemo(() => {
    return masters.filter((master) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        master.name?.toLowerCase().includes(searchLower) ||
        master.username?.toLowerCase().includes(searchLower)
      );
    });
  }, [masters, searchQuery]);

  // Reset halaman ke 1 setiap kali pengguna mengetik di kolom pencarian
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 2. Hitung Paginasi
  const totalPages = Math.ceil(filteredMasters.length / ITEMS_PER_PAGE);
  const paginatedMasters = filteredMasters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Helper untuk menentukan medali membaca langsung dari "rank" di JSON
  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-md" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-zinc-400 drop-shadow-md" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700 drop-shadow-md" />;
    return <span className="text-sm font-bold text-zinc-500">#{rank}</span>;
  };

  return (
    // DIHAPUS: Semua class "dark:bg-..." dan "dark:text-..." untuk memaksa warna putih
    <main className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 selection:bg-cyan-200 pt-24 pb-20">
      
      {/* Header Section Mirip Landing Page */}
      <section className="relative w-full flex items-center justify-center overflow-hidden mb-12 border-b border-zinc-200/50 pb-16">
        {/* Efek glow biru di belakang */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10 pt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest rounded-full bg-white text-zinc-800 border border-zinc-200 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Top Contributors</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 leading-[1.05]">
            Meet the <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">
              Promptmasters
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-2xl mx-auto mb-12 font-medium">
            The brilliant minds behind the most powerful AI prompts. Discover their work, follow their styles, and get inspired.
          </p>

          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-400 group-focus-within:text-cyan-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search creators by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl text-sm shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <section className="container mx-auto px-4 max-w-5xl relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-cyan-500" />
            <p className="font-medium animate-pulse">Loading creators...</p>
          </div>
        ) : paginatedMasters.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {paginatedMasters.map((master) => (
                <Link 
                  href={`/promptmasters/${master.username}`}
                  key={master.username}
                  className="group block relative p-6 bg-white border border-zinc-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 bg-zinc-50 border border-zinc-100 rounded-full">
                      {getRankBadge(master.rank)}
                    </div>

                    {/* Avatar */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-white font-bold text-2xl shadow-inner overflow-hidden border-2 border-white">
                      {master.avatar_url ? (
                        <img src={master.avatar_url} alt={master.username} className="w-full h-full object-cover" />
                      ) : (
                        master.username.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-grow pr-8">
                      <h3 className="text-xl font-bold text-zinc-900 group-hover:text-cyan-700 transition-colors truncate">
                        {master.name || master.username}
                      </h3>
                      <p className="text-sm text-zinc-500 mb-3 truncate">@{master.username}</p>
                      
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="flex items-center gap-1.5 text-zinc-700 bg-zinc-100 px-3 py-1 rounded-lg">
                          <Users className="w-4 h-4 text-zinc-500" />
                          {master.prompt_count || 0} Prompts
                        </span>
                        <span className="flex items-center text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0">
                          View Profile <ArrowRight className="w-4 h-4 ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 flex items-center gap-2 bg-white border border-zinc-200 rounded-xl text-zinc-700 hover:bg-zinc-50 hover:text-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                
                <span className="text-sm font-medium text-zinc-500">
                  Page <span className="text-zinc-900 font-bold">{currentPage}</span> of <span className="text-zinc-900 font-bold">{totalPages}</span>
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 flex items-center gap-2 bg-white border border-zinc-200 rounded-xl text-zinc-700 hover:bg-zinc-50 hover:text-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-sm"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white border border-zinc-200 rounded-3xl shadow-sm">
            <h3 className="text-2xl font-bold mb-2 text-zinc-900">No creators found</h3>
            <p className="text-zinc-500">Try searching for a different username.</p>
          </div>
        )}
      </section>
    </main>
  );
}
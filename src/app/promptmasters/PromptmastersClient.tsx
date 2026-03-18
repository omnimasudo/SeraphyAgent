"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Loader2, ChevronLeft, ChevronRight, Trophy, Medal, Award, FileQuestion, BarChart2 } from "lucide-react";
import SeraphyChatWidget from "@/components/SeraphyChatWidget";
import Link from "next/link";

// Interface untuk Prompt Master
interface PromptMaster {
  rank: number;
  username: string;
  prompt_count: number;
  prompt_ids: number[];
}

interface PromptmastersClientProps {
  initialMasters: PromptMaster[];
}

export default function PromptmastersClient({ initialMasters }: PromptmastersClientProps) {
  const [masters, setMasters] = useState<PromptMaster[]>(initialMasters);
  const [isLoading, setIsLoading] = useState(false);

  // Filters & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Reset pagination ke halaman 1 setiap kali pencarian berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter Logic untuk Prompt Masters
  const filteredMasters = useMemo(() => {
    return masters.filter((master) => {
      const searchLower = searchQuery.toLowerCase();
      return master.username?.toLowerCase().includes(searchLower);
    });
  }, [masters, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredMasters.length / itemsPerPage);
  const currentMasters = filteredMasters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fungsi render Badge/Angka berdasarkan rank (Persis seperti referensi HTML)
  const renderRank = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-medium text-gray-500">{rank}</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white text-gray-800 pb-20 font-sans selection:bg-blue-500/30">
      
      <div className="container py-8 max-w-3xl mx-auto px-4 mt-10">
        
        {/* =========================================
            1. HEADER SECTION
            ========================================= */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-black">Promptmasters</h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base">
            Top contributors ranked by upvotes received on their prompts
          </p>
        </div>

        {/* =========================================
            2. SEARCH & TABS UI
            ========================================= */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search prompt masters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm font-medium placeholder-gray-500 transition-all"
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-end">
            {/* Action Button Icon (Chart) */}
            <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-100 hover:text-black size-9 shrink-0 transition-colors">
              <BarChart2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* =========================================
            3. MASTERS LIST
            ========================================= */}
        {currentMasters.length === 0 ? (
          <div className="text-center py-16 border-t border-gray-300">
            <FileQuestion className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">No prompt masters found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {currentMasters.map((master) => {
              // Extract inisial untuk fallback avatar (2 huruf pertama)
              const initials = master.username.substring(0, 2).toUpperCase();

              return (
                <Link
                  key={master.username}
                  href={`/promptmasters/${master.username}`}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors group"
                >
                  {/* Rank Icon / Number */}
                  <div className="w-8 flex justify-center">
                    {renderRank(master.rank)}
                  </div>

                  {/* Avatar (Menggunakan inisial krn tdk ada foto di data) */}
                  <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 items-center justify-center border border-gray-300 group-hover:border-gray-400 transition-colors">
                    <span className="text-xs font-semibold text-gray-700">{initials}</span>
                  </span>

                  {/* Username & Handle */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-gray-800 group-hover:text-black transition-colors">
                      {master.username}
                    </p>
                    <p className="text-sm text-gray-500">@{master.username.toLowerCase().replace(/\s+/g, '')}</p>
                  </div>

                  {/* Stats (Prompts & Upvotes) */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center min-w-[3rem]">
                      <p className="font-semibold text-gray-800">{master.prompt_count}</p>
                      <p className="text-[11px] text-gray-500">prompts</p>
                    </div>
                    <div className="text-center min-w-[3rem]">
                      {/* Asumsi dummy upvotes karena tidak ada di interface asli, saya kalikan sbg contoh */}
                      <p className="font-semibold text-blue-500">{master.prompt_count * 3}</p>
                      <p className="text-[11px] text-gray-500">upvotes</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* =========================================
            4. PAGINATION
            ========================================= */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center size-9 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`size-9 rounded-md text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center size-9 rounded-md border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Seraphy Chat Widget */}
      <SeraphyChatWidget />
    </main>
  );
}
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

interface PromptmastersClientProps {
  initialMasters: Promptmaster[];
}

const ITEMS_PER_PAGE = 20;

export default function PromptmastersClient({ initialMasters }: PromptmastersClientProps) {
  const [masters, setMasters] = useState<Promptmaster[]>(initialMasters);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Sort masters by prompt count
    const sortedData = Array.isArray(initialMasters)
      ? initialMasters.sort((a, b) => (b.prompt_count || 0) - (a.prompt_count || 0))
      : [];
    setMasters(sortedData);
  }, [initialMasters]);

  // Filter masters based on search
  const filteredMasters = useMemo(() => {
    return masters.filter((master) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        master.username?.toLowerCase().includes(searchLower) ||
        master.name?.toLowerCase().includes(searchLower) ||
        master.bio?.toLowerCase().includes(searchLower)
      );
    });
  }, [masters, searchQuery]);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredMasters.length / ITEMS_PER_PAGE);
  const paginatedMasters = filteredMasters.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Rank icon helper
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-md" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-zinc-400 drop-shadow-md" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700 drop-shadow-md" />;
    return <span className="text-sm font-bold text-slate-600">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Prompt Masters
              </h1>
              <p className="text-slate-600 mt-1">
                Discover the most prolific prompt creators in our community
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                <span>{masters.length} masters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prompt masters by username, name, or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-2 text-slate-600">Loading prompt masters...</span>
          </div>
        )}

        {/* Masters Grid */}
        {!isLoading && paginatedMasters.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedMasters.map((master, index) => (
                <Link
                  key={master.username}
                  href={`/promptmasters/${master.username}`}
                  className="group bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg hover:border-slate-300/60 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full">
                        {getRankIcon(master.rank || index + 1)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {master.name || master.username}
                        </h3>
                        <p className="text-sm text-slate-500">@{master.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">
                        {master.prompt_count || 0}
                      </div>
                      <div className="text-xs text-slate-500">prompts</div>
                    </div>
                  </div>

                  {master.bio && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {master.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-sm text-slate-600">View prompts</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          pageNum === currentPage
                            ? "bg-blue-500 text-white"
                            : "text-slate-500 bg-white border border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="text-slate-400 px-2">...</span>}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
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

        {/* No Results */}
        {!isLoading && filteredMasters.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No prompt masters found</h3>
            <p className="text-slate-500">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
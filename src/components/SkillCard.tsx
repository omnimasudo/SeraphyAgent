"use client";

import Link from "next/link";
import { ArrowUpRight, Cpu, Star } from "lucide-react";
import { getCategoryConfig } from "@/lib/categoryUtils";

export default function SkillCard({ skill }: { skill: any }) {
  // Clean, fallback values
  const category = skill.category || "General";
  const author = skill.author || "Unknown";
  // Truncate long category names for aesthetics if needed, but flex wrap handles it mostly
  const displayCategory = category.length > 25 ? category.split(' ')[0] + '...' : category;
  
  const { icon: CategoryIcon, color, border } = getCategoryConfig(category);
  
  return (
    <Link 
      href={`/skills/${skill.slug || skill.id}`}
      className="group flex flex-col h-full bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-cyan-300 transition-all duration-300 overflow-visible relative mt-4 cursor-pointer"
    >
    
      {/* Category Badge - Floating Absolutely "Outside" on Top Right */}
      <div className="absolute -top-3 right-4 z-20">
        <div className={`flex items-center gap-1.5 px-3 py-1 bg-white border rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wider transition-colors ${border} ${color}`}>
            <CategoryIcon className={`w-3 h-3 ${color}`} />
            <span>{displayCategory}</span>
        </div>
      </div>
      
      {/* Top Banner Accent - Inside main content */}
      <div className="absolute top-0 left-0 right-0 h-1.5 w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl z-10"></div>

      {/* Content Container */}
      <div className="p-5 flex flex-col h-full relative z-10 pt-6">
        
        {/* Minimal Header - Simplified without Category */}
        <div className="flex justify-between items-start mb-2">
            <div></div> {/* Spacer */}
            {skill.popular && (
                <div className="absolute top-4 left-4 z-20 text-xs font-bold text-amber-500 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    <Star className="w-3 h-3 fill-current" /> Popular
                </div>
            )}
        </div>

        {/* Title & Author */}
        <div className="mb-3 mt-1">
            <h3 className="text-base font-bold text-zinc-900 group-hover:text-cyan-600 transition-colors line-clamp-1 pr-4">
                {skill.name || skill.title}
            </h3>
            <p className="text-xs text-zinc-400">
                by <span className="font-semibold text-zinc-600 group-hover:text-cyan-600 transition-colors">{author}</span>
            </p>
        </div>
        
        {/* Description - Clamped to 2 lines for uniformity */}
        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
            {skill.description}
        </p>

        {/* Action Footer - Compact */}
        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
            
            <div className="flex items-center gap-1 text-xs font-medium text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                View Details <ArrowUpRight className="w-3 h-3" />
            </div>

            {/* Static Arrow for when not hovered, or just keep it clean */}
             <div className="p-1.5 text-zinc-300 group-hover:hidden transition-colors">
                <ArrowUpRight className="w-4 h-4" />
            </div>
        </div>
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Cpu, Terminal, Check, Star } from "lucide-react";

export default function SkillCard({ skill }: { skill: any }) {
  const [copied, setCopied] = useState(false);
  
  // Clean, fallback values
  const category = skill.category || "General";
  const author = skill.author || "Unknown";
  // Truncate long category names for aesthetics if needed, but flex wrap handles it mostly
  const displayCategory = category.length > 25 ? category.split(' ')[0] + '...' : category;
  
  const installCmd = skill.install_command || `npx clawhub install ${skill.name}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex flex-col h-full bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-cyan-300 transition-all duration-300 overflow-visible relative mt-4">
    
      {/* Category Badge - Floating Absolutely "Outside" on Top Right */}
      <div className="absolute -top-3 right-4 z-20">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-zinc-200 rounded-full shadow-sm text-[10px] font-bold uppercase tracking-wider text-zinc-500 group-hover:border-cyan-300 group-hover:text-cyan-600 transition-colors">
            <Cpu className="w-3 h-3" />
            {displayCategory}
        </div>
      </div>
      
      {/* Clickable Area Overlay */}
      <Link href={`/skills/${skill.slug || skill.id}`} className="absolute inset-0 z-0 rounded-2xl overflow-hidden" />

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
                by <span className="font-semibold text-zinc-600 hover:text-cyan-600 transition-colors z-20 relative">{author}</span>
            </p>
        </div>
        
        {/* Description - Clamped to 2 lines for uniformity */}
        <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
            {skill.description}
        </p>

        {/* Action Footer - Compact */}
        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
            
            {/* Install Command Button - Simplified */}
            <button 
                onClick={handleCopy}
                className="flex-1 flex items-center gap-2 px-2.5 py-1.5 bg-zinc-50 hover:bg-zinc-100 text-zinc-500 text-xs font-mono rounded-lg border border-zinc-200 transition-all hover:border-cyan-200 hover:text-cyan-700 relative z-20 group/btn"
                title="Copy install command"
            >
                {copied ? <Check className="w-3 h-3 text-green-500" /> : <Terminal className="w-3 h-3 text-zinc-400 group-hover/btn:text-cyan-500" />}
                <span className="truncate">{installCmd}</span>
            </button>

            {/* Detail Arrow */}
            <div className="p-1.5 text-zinc-300 group-hover:text-cyan-500 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
            </div>
        </div>
      </div>
    </div>
  );
}

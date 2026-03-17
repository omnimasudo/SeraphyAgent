"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Copy, Check, Terminal, FileText, ChevronDown, 
  Bot, Sparkles, BrainCircuit, Code, Image as ImageIcon
} from "lucide-react";

interface PromptProps {
  prompt: {
    id: string | number;
    title: string;
    slug: string;
    content: string;
    type?: string;
    for_devs?: boolean;
    category?: string;
    tags?: string[];
    contributors?: string[];
    word_count?: number;
    char_count?: number;
    description?: string;
    image?: string; // Key image baru
  }
}

export default function PromptCard({ prompt }: PromptProps) {
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (e: React.MouseEvent, redirectUrl?: string) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    const textToCopy = prompt.content || "No prompt content available.";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setIsDropdownOpen(false);
    
    if (redirectUrl) {
      window.open(redirectUrl, "_blank");
    }

    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = (cat: string) => {
    if (cat?.toLowerCase().includes("dev") || prompt.for_devs) return <Terminal className="w-3 h-3" />;
    return <FileText className="w-3 h-3" />;
  };

  const authorName = prompt.contributors && prompt.contributors.length > 0 
    ? prompt.contributors[0] 
    : "Community";

  return (
    <div className="group flex flex-col h-full bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-2xl hover:border-cyan-500/50 backdrop-blur-sm transition-all duration-300 overflow-hidden relative">
      
      {/* Highlight Glow saat Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      {/* 1. Thumbnail Image Area (Conditional) */}
      {prompt.image && (
        <div className="relative w-full aspect-video md:h-44 overflow-hidden border-b border-zinc-100 bg-zinc-100 flex-shrink-0">
          <img 
            src={prompt.image} 
            alt={prompt.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Overlay Gradient bawah gambar */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          {/* Badge Kategori mengambang di atas gambar jika ada gambar */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-black/50 text-white backdrop-blur-md border border-white/20">
              {getIcon(prompt.category || "")}
              {prompt.category || "General"}
            </span>
          </div>
        </div>
      )}

      {/* 2. Content Area */}
      <div className="p-5 pb-3 flex-grow flex flex-col z-10">
        {/* Render Badges disini jika TIDAK ada gambar */}
        {!prompt.image && (
          <div className="flex justify-between items-start gap-2 mb-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-zinc-100 text-zinc-600 border border-transparent">
                {getIcon(prompt.category || "")}
                {prompt.category || "General"}
              </span>
              {prompt.for_devs && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-cyan-50 text-cyan-600 border border-cyan-100">
                  <Code className="w-3 h-3" /> Devs
                </span>
              )}
            </div>
          </div>
        )}

        {/* Jika ada gambar, badge For Devs pindah ke atas judul */}
        {prompt.image && prompt.for_devs && (
          <div className="mb-2">
             <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-cyan-50 text-cyan-600 border border-cyan-100">
                <Code className="w-3 h-3" /> For Devs
              </span>
          </div>
        )}

        {/* Judul & Deskripsi */}
        <Link href={`/prompts/${prompt.slug || prompt.id}`} className="block group/link flex-grow">
          <h3 className="text-lg font-extrabold text-zinc-900 mb-2 leading-snug group-hover/link:text-cyan-600 transition-colors line-clamp-2">
            {prompt.title}
          </h3>
          <p className="text-sm text-zinc-500 line-clamp-2 md:line-clamp-3 leading-relaxed mb-4">
            {prompt.description || prompt.content}
          </p>
        </Link>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {prompt.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 bg-zinc-50 text-zinc-500 rounded-full border border-zinc-200">
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-[10px] font-medium px-1 text-zinc-400">+{prompt.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* 3. Footer Action */}
      <div className="p-4 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/50 z-10">
        
        {/* Kontributor */}
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 text-[#0B1115] flex items-center justify-center text-[10px] font-bold shadow-inner">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <span className="truncate max-w-[80px]" title={authorName}>{authorName}</span>
        </div>

        {/* Dropdown Action Shadcn-style */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center">
            <button
              onClick={(e) => handleCopy(e)}
              className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 text-xs font-bold rounded-l-lg border border-r-0 transition-colors ${
                copied 
                ? "bg-emerald-500 border-emerald-500 text-white" 
                : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setIsDropdownOpen(!isDropdownOpen); }}
              className="flex items-center px-1.5 py-1.5 bg-white border border-zinc-200 rounded-r-lg text-zinc-500 hover:bg-zinc-100 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-zinc-200 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100 bg-zinc-50">
                Run in AI
              </div>
              <div className="p-1 flex flex-col gap-0.5">
                <button onClick={(e) => handleCopy(e, "https://chatgpt.com/")} className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
                  <Bot className="w-4 h-4 text-emerald-500" /> ChatGPT
                </button>
                <button onClick={(e) => handleCopy(e, "https://claude.ai/new")} className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
                  <BrainCircuit className="w-4 h-4 text-amber-500" /> Claude
                </button>
                <button onClick={(e) => handleCopy(e, "https://gemini.google.com/app")} className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
                  <Sparkles className="w-4 h-4 text-blue-400" /> Gemini
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
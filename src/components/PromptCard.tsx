"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Copy, Check, Terminal, FileText, ChevronDown, 
  Bot, Sparkles, BrainCircuit, Code, Users
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
  }
}

export default function PromptCard({ prompt }: PromptProps) {
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
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

  // Ambil author pertama jika ada
  const authorName = prompt.contributors && prompt.contributors.length > 0 
    ? prompt.contributors[0] 
    : "Community";

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-300">
      
      {/* 1. Kategori & Badges Area */}
      <div className="p-5 pb-3">
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300">
              {getIcon(prompt.category || "")}
              {prompt.category || "General"}
            </span>
            {prompt.for_devs && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                <Code className="w-3 h-3" /> Devs
              </span>
            )}
          </div>
        </div>

        {/* 2. Judul & Konten (Klik untuk ke detail) */}
        <Link href={`/prompts/${prompt.slug || prompt.id}`} className="block group/link">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-snug group-hover/link:text-blue-600 transition-colors line-clamp-2">
            {prompt.title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-4">
            {prompt.description || prompt.content}
          </p>
        </Link>

        {/* 3. Tags (Max 3) */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {prompt.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[11px] font-medium px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 rounded-full border border-zinc-100 dark:border-zinc-800">
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-[11px] font-medium px-2 py-0.5 text-zinc-400">+{prompt.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* 4. Footer (Author, Stats, Dropdown Action) */}
      <div className="mt-auto p-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/20 rounded-b-2xl">
        
        {/* Kontributor */}
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center text-[10px] font-bold shadow-inner">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <span className="truncate max-w-[80px]" title={authorName}>{authorName}</span>
        </div>

        {/* Action Button: Shadcn Dropdown Style */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center">
            {/* Tombol Copy Utama */}
            <button
              onClick={(e) => handleCopy(e)}
              className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 text-xs font-bold rounded-l-lg border border-r-0 transition-colors ${
                copied 
                ? "bg-emerald-500 border-emerald-500 text-white" 
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            
            {/* Tombol Panah Dropdown */}
            <button
              onClick={(e) => { e.preventDefault(); setIsDropdownOpen(!isDropdownOpen); }}
              className="flex items-center px-1.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-r-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Isi Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                Copy & Run in...
              </div>
              <div className="p-1 flex flex-col gap-0.5">
                <button onClick={(e) => handleCopy(e, "https://chatgpt.com/")} className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                  <Bot className="w-4 h-4 text-emerald-500" /> ChatGPT
                </button>
                <button onClick={(e) => handleCopy(e, "https://claude.ai/new")} className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                  <BrainCircuit className="w-4 h-4 text-amber-600" /> Claude
                </button>
                <button onClick={(e) => handleCopy(e, "https://gemini.google.com/app")} className="flex items-center gap-2 w-full px-2 py-2 text-sm text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors">
                  <Sparkles className="w-4 h-4 text-blue-500" /> Gemini
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
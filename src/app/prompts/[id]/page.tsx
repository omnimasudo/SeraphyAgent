"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Copy, Check, User, Tag, Info, Loader2, 
  Code, Activity, Hash, ChevronDown, Bot, Sparkles, BrainCircuit 
} from "lucide-react";

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prompt, setPrompt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // States for Dropdown Button
  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await fetch("/data/prompts.json");
        const data = res.ok ? await res.json() : [];
        const found = data.find((p: any) => p.id.toString() === id || p.slug === id);
        setPrompt(found || null);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPrompt();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyAndRun = (redirectUrl?: string) => {
    const textToCopy = prompt?.content || "";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setIsDropdownOpen(false);
    
    if (redirectUrl) window.open(redirectUrl, "_blank");
    setTimeout(() => setCopied(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-white">Prompt Not Found</h1>
        <button onClick={() => router.back()} className="px-6 py-3 bg-zinc-900 text-white rounded-xl">Go Back</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20 text-zinc-900 dark:text-zinc-100">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Breadcrumb */}
        <button onClick={() => router.back()} className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 mb-8 hover:text-zinc-900 dark:hover:text-white transition-colors">
          <div className="p-1.5 rounded-lg bg-zinc-200/50 dark:bg-zinc-800 group-hover:bg-zinc-200 transition-colors"><ArrowLeft className="w-4 h-4" /></div>
          Back to Prompts
        </button>

        {/* Headers & Meta */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
              <Tag className="w-3 h-3" /> {prompt.category || "General"}
            </span>
            {prompt.for_devs && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                <Code className="w-3 h-3" /> For Devs
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-zinc-200/50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <User className="w-3 h-3" /> 
              {prompt.contributors?.[0] || "Community"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {prompt.title}
          </h1>

          {/* Tags */}
          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {prompt.tags.map((tag: string) => (
                <span key={tag} className="text-sm font-medium px-3 py-1 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Meta Stats Data */}
          <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            <div className="flex items-center gap-2"><Activity className="w-4 h-4" /> Type: {prompt.type}</div>
            {prompt.word_count && <div className="flex items-center gap-2"><Hash className="w-4 h-4" /> {prompt.word_count} Words</div>}
            {prompt.char_count && <div className="flex items-center gap-2"><Hash className="w-4 h-4" /> {prompt.char_count} Chars</div>}
          </div>
        </div>

        {/* Code Block Area */}
        <div className="relative mb-10 group">
          <div className="flex items-center justify-between px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-t-2xl">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xs font-medium text-zinc-400">Prompt Content</span>
          </div>

          <div className="relative bg-[#0d1117] border-x border-b border-zinc-800 rounded-b-2xl p-6 md:p-8">
            <pre className="whitespace-pre-wrap font-mono text-[15px] text-zinc-300 leading-relaxed selection:bg-blue-500/30">
              {prompt.content}
            </pre>
          </div>

          {/* Shadcn-like Big Dropdown Button */}
          <div className="absolute -bottom-6 right-8" ref={dropdownRef}>
            <div className="flex shadow-2xl rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
              
              <button
                onClick={() => handleCopyAndRun()}
                className={`flex items-center gap-2 px-6 py-3.5 font-bold transition-colors ${
                  copied ? "bg-emerald-500 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy Prompt"}
              </button>
              
              <div className="w-[1px] bg-blue-700 dark:bg-blue-800"></div>
              
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3 py-3.5 bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

            </div>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 p-1.5">
                <div className="px-3 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Copy & Run in AI
                </div>
                <button onClick={() => handleCopyAndRun("https://chatgpt.com/")} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <Bot className="w-5 h-5 text-emerald-500" /> Open in ChatGPT
                </button>
                <button onClick={() => handleCopyAndRun("https://claude.ai/new")} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <BrainCircuit className="w-5 h-5 text-amber-500" /> Open in Claude
                </button>
                <button onClick={() => handleCopyAndRun("https://gemini.google.com/app")} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                  <Sparkles className="w-5 h-5 text-blue-500" /> Open in Gemini
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mt-20 shadow-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" /> How to use this prompt
          </h3>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 ml-2">
            <li>Gunakan panah di samping tombol Copy untuk langsung membuka <strong>ChatGPT, Claude, atau Gemini</strong>.</li>
            <li>Teks prompt akan <strong>otomatis tersalin (copied)</strong> ke clipboard Anda.</li>
            <li>Paste (Ctrl+V / Cmd+V) langsung di kolom chat AI pilihan Anda.</li>
            {prompt.variables?.length > 0 && <li>Ganti variabel teks sesuai kebutuhan proyek Anda.</li>}
          </ul>
        </div>

      </div>
    </main>
  );
}
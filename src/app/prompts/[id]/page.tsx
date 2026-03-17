"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Copy, Check, User, Tag, Info, Loader2,
  Code, Activity, Hash, ChevronDown, Bot, Sparkles, BrainCircuit, Type, ShieldAlert
} from "lucide-react";

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prompt, setPrompt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-center px-4">
        <h1 className="text-4xl font-bold mb-4 text-zinc-900">Prompt Not Found</h1>
        <button onClick={() => router.back()} className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors">Go Back</button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 pb-20 text-zinc-900 selection:bg-cyan-200">

      {/* =========================================
          1. HERO IMAGE BANNER (If image exists)
          ========================================= */}
      {prompt.image ? (
        <div className="relative w-full h-[40vh] md:h-[50vh] xl:h-[60vh] overflow-hidden flex items-end">
          <img
            src={prompt.image}
            alt={prompt.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          {/* Gradient overlay for blending into content */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/50 to-transparent z-10"></div>

          <div className="container relative mx-auto px-4 max-w-4xl z-20 pb-10">
             <button onClick={() => router.back()} className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-600 mb-6 hover:text-zinc-900 transition-colors bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                <ArrowLeft className="w-4 h-4" /> Back to Prompts
             </button>
             <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                  <Tag className="w-3 h-3" /> {prompt.category || "General"}
                </span>
                {prompt.for_devs && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-lg bg-teal-500 text-white shadow-lg shadow-teal-500/20">
                    <Code className="w-3 h-3" /> For Devs
                  </span>
                )}
             </div>
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight drop-shadow-md">
                {prompt.title}
             </h1>
          </div>
        </div>
      ) : (
        // Non-Image Header
        <div className="container mx-auto px-4 max-w-4xl pt-32 pb-10 relative">
          <div className="absolute top-10 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
          <div className="relative z-10">
            <button onClick={() => router.back()} className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 mb-8 hover:text-zinc-900 transition-colors">
              <div className="p-1.5 rounded-lg bg-zinc-200/50 group-hover:bg-zinc-200 transition-colors border border-transparent"><ArrowLeft className="w-4 h-4" /></div>
              Back to Prompts
            </button>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-cyan-100 text-cyan-700 border border-cyan-200">
                <Tag className="w-3 h-3" /> {prompt.category || "General"}
              </span>
              {prompt.for_devs && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase rounded-lg bg-teal-100 text-teal-700 border border-teal-200">
                  <Code className="w-3 h-3" /> For Devs
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-tight">
              {prompt.title}
            </h1>
          </div>
        </div>
      )}

      {/* =========================================
          2. METADATA STATS GRID
          ========================================= */}
      <div className="container mx-auto px-4 max-w-4xl relative z-20 mt-4 md:-mt-8 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6 bg-white backdrop-blur-xl border border-zinc-200 rounded-[1.5rem] shadow-xl">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1"><User className="w-3 h-3" /> Creator</span>
            <span className="font-semibold text-sm md:text-base">{prompt.contributors?.[0] || "Community"}</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-zinc-200 pl-3 md:pl-4">
            <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1"><Type className="w-3 h-3" /> Format</span>
            <span className="font-semibold text-sm md:text-base">{prompt.type || "TEXT"}</span>
          </div>
          <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-zinc-200 pt-3 md:pt-0 pl-0 md:pl-4 mt-3 md:mt-0">
            <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1"><Activity className="w-3 h-3" /> Words</span>
            <span className="font-semibold text-sm md:text-base">{prompt.word_count || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-1 border-t md:border-t-0 border-l border-zinc-200 pt-3 md:pt-0 pl-3 md:pl-4 mt-3 md:mt-0">
            <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1"><Hash className="w-3 h-3" /> Characters</span>
            <span className="font-semibold text-sm md:text-base">{prompt.char_count || "N/A"}</span>
          </div>
        </div>

        {/* Tags */}
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {prompt.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-semibold px-3 py-1.5 bg-zinc-100 text-zinc-600 border border-zinc-200 rounded-full shadow-sm hover:border-cyan-500/50 hover:text-cyan-500 transition-colors cursor-default">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* =========================================
          3. CODE BLOCK (THE PROMPT ITSELF)
          ========================================= */}
      <div className="container mx-auto px-4 max-w-4xl relative z-20">
        <div className="relative mb-12 group">
          {/* Mac Terminal Header Style */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-100 border border-zinc-200 rounded-t-2xl">
            <div className="flex gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-inner"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-inner"></div>
            </div>
            <span className="text-xs font-bold text-zinc-500 tracking-wider">prompt.txt</span>
          </div>

          {/* Code Content */}
          <div className="relative bg-white border-x border-b border-zinc-200 rounded-b-2xl p-6 md:p-10 shadow-lg">
            <pre className="whitespace-pre-wrap font-mono text-[15px] md:text-base text-zinc-800 leading-relaxed">
              {prompt.content}
            </pre>
          </div>

          {/* Floating Copy & Run Button */}
          <div className="absolute -bottom-6 right-6 md:right-10" ref={dropdownRef}>
            <div className="flex shadow-2xl shadow-cyan-500/20 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 ring-1 ring-white/20">

              <button
                onClick={() => handleCopyAndRun()}
                className={`flex items-center gap-2 px-6 py-3.5 font-extrabold transition-colors ${
                  copied ? "bg-emerald-500 text-white" : "bg-cyan-500 hover:bg-cyan-400 text-white"
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? "Copied!" : "Copy Prompt"}
              </button>

              <div className="w-[1px] bg-black/10"></div>

              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-white transition-colors"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

            </div>

            {/* Shadcn-like Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-zinc-200 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 p-1.5">
                <div className="px-3 py-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                  Run Prompt Directly
                </div>
                <button onClick={() => handleCopyAndRun("https://chatgpt.com/")} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
                  <Bot className="w-5 h-5 text-emerald-500" /> Open in ChatGPT
                </button>
                <button onClick={() => handleCopyAndRun("https://claude.ai/new")} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
                  <BrainCircuit className="w-5 h-5 text-amber-500" /> Open in Claude
                </button>
                <button onClick={() => handleCopyAndRun("https://gemini.google.com/app")} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors">
                  <Sparkles className="w-5 h-5 text-blue-400" /> Open in Gemini
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            4. USAGE INSTRUCTIONS
            ========================================= */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 mt-24 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2 text-zinc-900 relative z-10">
            <ShieldAlert className="w-5 h-5 text-cyan-500" /> How to execute
          </h3>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 ml-2 text-sm md:text-base relative z-10 font-medium">
            <li>Click the arrow next to the Copy button to directly launch <strong>ChatGPT, Claude, or Gemini</strong>.</li>
            <li>The prompt text is <strong>automatically copied</strong> to your clipboard.</li>
            <li>Paste <kbd className="px-1.5 py-0.5 bg-zinc-100 rounded-md font-mono text-xs text-zinc-800 border border-zinc-200">Ctrl/Cmd + V</kbd> into the AI's input field.</li>
            <li>If the prompt contains <code>[bracketed variables]</code>, be sure to replace them with your specific data before pressing Enter.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}

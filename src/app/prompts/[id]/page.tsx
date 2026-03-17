"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Copy, Check, User, Tag, Loader2,
  Code, Activity, Hash, ChevronDown, Bot, Sparkles, BrainCircuit, Type, ShieldAlert,
  AlertCircle, X
} from "lucide-react";

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prompt, setPrompt] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // State untuk modal peringatan Gemini
  const [showGeminiWarning, setShowGeminiWarning] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        // Fetch dari kedua sumber seperti di halaman profil
        const [promptsRes, allPromptsRes] = await Promise.all([
          fetch(`${baseUrl}/data/prompts.json`).catch(() => null),
          fetch(`${baseUrl}/data/all_prompts.json`).catch(() => null)
        ]);

        const promptsData = promptsRes?.ok ? await promptsRes.json() : [];
        const allPromptsData = allPromptsRes?.ok ? await allPromptsRes.json() : [];
        
        const combinedPrompts = [...promptsData, ...allPromptsData];
        const found = combinedPrompts.find((p: any) => p.id.toString() === id || p.slug === id);
        
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

  // Logika Copy Standar
  const handleCopyOnly = () => {
    const textToCopy = prompt?.content || "";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setIsDropdownOpen(false);
    setTimeout(() => setCopied(false), 2500);
  };

  // Logika Eksekusi Prompt berdasarkan Platform
  const handleRunPrompt = (platform: "chatgpt" | "claude" | "gemini") => {
    const textToCopy = prompt?.content || "";
    
    // Selalu copy ke clipboard sebagai backup
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setIsDropdownOpen(false);
    setTimeout(() => setCopied(false), 2500);

    const encodedPrompt = encodeURIComponent(textToCopy);

    if (platform === "chatgpt") {
      window.open(`https://chatgpt.com/?q=${encodedPrompt}`, "_blank");
    } else if (platform === "claude") {
      window.open(`https://claude.ai/new?q=${encodedPrompt}`, "_blank");
    } else if (platform === "gemini") {
      // Tampilkan warning modal untuk Gemini, jangan langsung redirect
      setShowGeminiWarning(true);
    }
  };

  const proceedToGemini = () => {
    setShowGeminiWarning(false);
    window.open("https://gemini.google.com/app", "_blank");
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

      {/* --- MODAL WARNING GEMINI --- */}
      {showGeminiWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 fade-in duration-200 border border-zinc-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                <Sparkles className="w-6 h-6 text-blue-500" />
              </div>
              <button 
                onClick={() => setShowGeminiWarning(false)}
                className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-xl font-extrabold text-zinc-900 mb-2">Manual Paste Required</h3>
            <p className="text-zinc-600 mb-6 font-medium leading-relaxed text-sm">
              Google Gemini does not support auto-filling prompts via links yet. We have copied the prompt to your clipboard. 
              <br/><br/>
              Please use <kbd className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 rounded text-xs font-mono text-zinc-800 shadow-sm mx-1">Ctrl/Cmd + V</kbd> to paste it into the chat box once Gemini opens.
            </p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setShowGeminiWarning(false)}
                className="flex-1 px-4 py-3 bg-white border border-zinc-200 text-zinc-700 font-bold rounded-xl hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={proceedToGemini}
                className="flex-1 px-4 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                Open Gemini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          1. HERO SECTION
          ========================================= */}
      {prompt.image ? (
        <div className="relative w-full h-[40vh] md:h-[50vh] xl:h-[60vh] overflow-hidden flex items-end">
          <img
            src={prompt.image}
            alt={prompt.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/50 to-transparent z-10"></div>

          <div className="container relative mx-auto px-4 max-w-4xl z-20 pb-10">
             <button onClick={() => router.back()} className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-600 mb-6 hover:text-zinc-900 transition-colors bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
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
        <div className="container mx-auto px-4 max-w-4xl pt-32 pb-10 relative">
          <div className="absolute top-10 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none z-0"></div>
          <div className="relative z-10">
            <button onClick={() => router.back()} className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-500 mb-8 hover:text-zinc-900 transition-colors">
              <div className="p-1.5 rounded-lg bg-white border border-zinc-200 group-hover:bg-zinc-100 transition-colors shadow-sm"><ArrowLeft className="w-4 h-4" /></div>
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
            <span className="font-semibold text-sm md:text-base text-zinc-800">{prompt.contributors?.[0] || "Community"}</span>
          </div>
          <div className="flex flex-col gap-1 border-l border-zinc-200 pl-3 md:pl-4">
            <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1"><Type className="w-3 h-3" /> Format</span>
            <span className="font-semibold text-sm md:text-base text-zinc-800">{prompt.type || "TEXT"}</span>
          </div>
          <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-zinc-200 pt-3 md:pt-0 pl-0 md:pl-4 mt-3 md:mt-0">
            <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1"><Activity className="w-3 h-3" /> Words</span>
            <span className="font-semibold text-sm md:text-base text-zinc-800">{prompt.word_count || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-1 border-t md:border-t-0 border-l border-zinc-200 pt-3 md:pt-0 pl-3 md:pl-4 mt-3 md:mt-0">
            <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1"><Hash className="w-3 h-3" /> Characters</span>
            <span className="font-semibold text-sm md:text-base text-zinc-800">{prompt.char_count || "N/A"}</span>
          </div>
        </div>
        
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {prompt.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-bold px-3 py-1.5 bg-white text-zinc-600 border border-zinc-200 rounded-full shadow-sm hover:border-cyan-500/50 hover:text-cyan-600 transition-colors cursor-default">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* =========================================
          3. CODE BLOCK & DROPDOWN
          ========================================= */}
      <div className="container mx-auto px-4 max-w-4xl relative z-20">
        <div className="relative mb-12 group">
          <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-100 border border-zinc-200 rounded-t-2xl">
            <div className="flex gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-400 shadow-inner"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400 shadow-inner"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-inner"></div>
            </div>
            <span className="text-xs font-bold text-zinc-500 tracking-wider">prompt.txt</span>
          </div>

          <div className="relative bg-white border-x border-b border-zinc-200 rounded-b-2xl p-6 md:p-10 shadow-lg">
            <pre className="whitespace-pre-wrap font-mono text-[14px] md:text-[15px] text-zinc-800 leading-relaxed">
              {prompt.content}
            </pre>
          </div>

          {/* Floating Dropdown Group */}
          <div className="absolute -bottom-6 right-6 md:right-10" ref={dropdownRef}>
            <div className="flex shadow-xl shadow-cyan-500/20 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-300 ring-1 ring-zinc-900/5">

              {/* Tombol Copy Saja */}
              <button
                onClick={handleCopyOnly}
                className={`flex items-center gap-2 px-6 py-3.5 font-extrabold transition-colors text-sm ${
                  copied ? "bg-emerald-500 text-white" : "bg-zinc-900 hover:bg-zinc-800 text-white"
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Prompt"}
              </button>

              <div className="w-[1px] bg-white/20"></div>

              {/* Tombol Buka Dropdown */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white transition-colors flex items-center justify-center"
              >
                <ChevronDown className="w-5 h-5" />
              </button>

            </div>

            {/* Isi Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-zinc-200 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 p-2">
                <div className="px-3 py-2 text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Auto-Fill & Run
                </div>
                
                <button onClick={() => handleRunPrompt("chatgpt")} className="group flex flex-col items-start w-full px-3 py-2.5 hover:bg-zinc-50 rounded-xl transition-colors border border-transparent hover:border-zinc-200">
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-800 mb-0.5">
                    <Bot className="w-4 h-4 text-emerald-500" /> ChatGPT
                  </div>
                  <span className="text-[11px] font-medium text-zinc-500 pl-7">Direct input via URL</span>
                </button>
                
                <button onClick={() => handleRunPrompt("claude")} className="group flex flex-col items-start w-full px-3 py-2.5 hover:bg-zinc-50 rounded-xl transition-colors border border-transparent hover:border-zinc-200">
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-800 mb-0.5">
                    <BrainCircuit className="w-4 h-4 text-amber-500" /> Claude AI
                  </div>
                  <span className="text-[11px] font-medium text-zinc-500 pl-7">Direct input via URL</span>
                </button>
                
                <div className="h-[1px] bg-zinc-100 my-1 mx-2"></div>

                <button onClick={() => handleRunPrompt("gemini")} className="group flex flex-col items-start w-full px-3 py-2.5 hover:bg-zinc-50 rounded-xl transition-colors border border-transparent hover:border-zinc-200">
                  <div className="flex items-center gap-3 text-sm font-bold text-zinc-800 mb-0.5">
                    <Sparkles className="w-4 h-4 text-blue-500" /> Google Gemini
                  </div>
                  <span className="text-[11px] font-medium flex items-center gap-1 text-orange-500 pl-7">
                    <AlertCircle className="w-3 h-3" /> Manual paste needed
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            4. USAGE INSTRUCTIONS
            ========================================= */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 mt-24 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full pointer-events-none"></div>
          <h3 className="text-xl font-extrabold mb-4 flex items-center gap-2 text-zinc-900 relative z-10">
            <ShieldAlert className="w-5 h-5 text-cyan-500" /> Pro Tips
          </h3>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 ml-2 text-sm md:text-[15px] relative z-10 font-medium">
            <li>Click the arrow next to the Copy button to directly launch and auto-fill <strong>ChatGPT or Claude</strong>.</li>
            <li>For <strong>Gemini</strong>, the text is automatically copied, simply paste it in the chat box.</li>
            <li>If the prompt contains <code className="bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded text-xs border border-zinc-200">[bracketed variables]</code>, be sure to replace them with your specific data before pressing Enter.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
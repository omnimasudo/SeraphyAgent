import Link from "next/link";
import { ArrowRight, Sparkles, Terminal, Users, Search, Bot, ShieldCheck } from "lucide-react";
import PromptCard from "@/components/PromptCard";

interface Prompt {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  description?: string;
  category?: string;
  for_devs?: boolean;
  tags?: string[];
  contributors?: string[];
}

export default async function HomePage() {
  let prompts: Prompt[] = [];
  let categories = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const [promptsRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/data/prompts.json`, { cache: "no-store" }).catch(() => null),
      fetch(`${baseUrl}/data/categories.json`, { cache: "no-store" }).catch(() => null)
    ]);

    if (promptsRes?.ok) prompts = await promptsRes.json();
    if (categoriesRes?.ok) categories = await categoriesRes.json();
  } catch (error) {
    console.error("Error loading static data:", error);
  }

  const featuredPrompts = prompts.slice(0, 6);
  const displayCategories = categories.length > 0 ? categories.slice(0, 5) : [
    { id: "1", slug: "development", name: "Development" },
    { id: "2", slug: "writing", name: "Writing" },
    { id: "3", slug: "marketing", name: "Marketing" },
    { id: "4", slug: "business", name: "Business" },
  ];

  const sponsors = [
    { name: "Cognition", light: "/sponsors/cognition.svg", dark: "/sponsors/cognition-dark.svg" },
    { name: "CodeRabbit", light: "/sponsors/coderabbit.svg", dark: "/sponsors/coderabbit-dark.svg" },
    { name: "Sentry", light: "/sponsors/sentry.svg", dark: "/sponsors/sentry-dark.svg" },
    { name: "CommandCode", light: "/sponsors/commandcode.svg", dark: "/sponsors/commandcode-dark.svg" },
    { name: "Warp", light: "/sponsors/warp.svg", dark: "/sponsors/warp-dark.svg" },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-zinc-50 dark:bg-[#0B1115] text-zinc-900 dark:text-zinc-50 selection:bg-cyan-200 dark:selection:bg-cyan-900/50">
      
      {/* =========================================
          1. HERO SECTION (Full Background Image Adjusted)
          ========================================= */}
      <section className="relative w-full min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden border-b border-zinc-200/50 dark:border-white/5">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 bg-[#0B1115]">
          {/* Gambar Karakter: 
              1. Di-flip (-scale-x-100) agar wajah pindah ke kanan.
              2. Object position diatur ke center_20% agar wajah 1:1 tidak terpotong di layar lebar. */}
          <img 
            src="/hero-section.jpeg" 
            alt="Seraphy Background Mascot" 
            className="w-full h-full object-cover object-[center_20%] -scale-x-100 opacity-50 md:opacity-75 dark:opacity-60 transition-opacity duration-1000"
          />
          
          {/* Gradient Overlays: 
              Pekat di KIRI (untuk background teks agar terbaca jelas).
              Transparan di KANAN (agar wajah maskot terlihat sempurna). */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-50 via-zinc-50/95 to-transparent dark:from-[#0B1115] dark:via-[#0B1115]/95 dark:to-transparent"></div>
          
          {/* Gradient Bawah untuk transisi halus ke section berikutnya */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-transparent dark:from-[#0B1115] dark:via-transparent dark:to-transparent"></div>
        </div>

        {/* Subtle Turquoise/Cyan Glow behind text */}
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        {/* Main Hero Content */}
        <div className="container relative mx-auto px-4 max-w-7xl z-10 pt-24 pb-12">
          <div className="max-w-2xl lg:max-w-3xl">
            <Link 
              href="/about"
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest rounded-full bg-white/50 dark:bg-white/5 text-zinc-800 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/10 shadow-sm hover:border-cyan-500/50 backdrop-blur-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>SeraphyAgent 1.0</span>
            </Link>
            
            <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white leading-[1.05]">
              Master the Art of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 dark:from-teal-400 dark:to-cyan-300">
                AI Communication
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 mb-10 leading-relaxed font-medium drop-shadow-sm">
              The most sophisticated open-source directory for AI prompts and agents. Discover, copy, and orchestrate workflows with elegance and precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
              <Link 
                href="/prompts" 
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white dark:bg-cyan-500 dark:text-[#0B1115] font-extrabold rounded-2xl hover:bg-zinc-800 dark:hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 dark:shadow-cyan-500/20 hover:-translate-y-1"
              >
                <Search className="w-5 h-5" /> Explore Library
              </Link>
              <Link 
                href="/prompts/new" 
                className="w-full sm:w-auto px-8 py-4 bg-white/80 text-zinc-900 dark:bg-white/5 dark:text-white font-bold rounded-2xl border border-zinc-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md hover:-translate-y-1"
              >
                <Terminal className="w-5 h-5" /> Submit Prompt
              </Link>
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap items-center gap-2 relative z-20">
              <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mr-2 drop-shadow-sm">Trending:</span>
              {displayCategories.map((category: any) => (
                <Link 
                  key={category.id} 
                  href={`/prompts?category=${category.slug}`}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/60 dark:bg-black/20 border border-zinc-200/50 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-cyan-700 dark:hover:text-cyan-400 backdrop-blur-md transition-colors shadow-sm"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          2. SPONSORED BY SECTION
          ========================================= */}
      <section className="w-full py-12 bg-white dark:bg-[#0B1115] border-b border-zinc-200/50 dark:border-white/5 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <p className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8">
            Supported by the Community & Innovators
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {sponsors.map((sponsor) => (
              <div key={sponsor.name} className="relative h-7 md:h-9 w-28 md:w-36 flex items-center justify-center">
                <img src={sponsor.light} alt={sponsor.name} className="max-h-full max-w-full dark:hidden object-contain" />
                <img src={sponsor.dark} alt={sponsor.name} className="max-h-full max-w-full hidden dark:block object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          3. TRENDING PROMPTS SECTION
          ========================================= */}
      <section className="w-full py-24 bg-zinc-50/80 dark:bg-[#070b0e] relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                Curated Collection <Sparkles className="w-6 h-6 text-cyan-500" />
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                High-fidelity prompts crafted by the community, for the community.
              </p>
            </div>
            <Link 
              href="/prompts" 
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-all group"
            >
              View directory <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrompts.map((prompt: any) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
            
            {featuredPrompts.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-3xl text-zinc-500 font-medium">
                No prompts available yet. The canvas is yours.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================
          4. FEATURES SECTION
          ========================================= */}
      <section className="w-full py-24 bg-white dark:bg-[#0B1115] border-y border-zinc-200/50 dark:border-white/5 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-zinc-900 dark:text-white">
              Why SeraphyAgent?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              A minimalist, powerful toolset designed to bridge the gap between human intent and machine execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 hover:border-cyan-500/30 transition-colors group">
              <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <Terminal className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">Frictionless Workflow</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                One-click copy. Execute complex prompts instantly on your preferred AI models without breaking your focus.
              </p>
            </div>
            
            <div className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 hover:border-teal-500/30 transition-colors group">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">Quality Assured</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every prompt is community-vetted. We prioritize clarity, efficiency, and structural integrity over noise.
              </p>
            </div>

            <div className="p-8 rounded-[2rem] bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 hover:border-blue-500/30 transition-colors group">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">Advanced Agents</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Unlock specialized AI Skills. Go beyond text generation and automate intricate, multi-step tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          5. CALL TO ACTION
          ========================================= */}
      <section className="w-full py-32 bg-zinc-50/50 dark:bg-[#070b0e] relative z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-zinc-900 dark:bg-gradient-to-br dark:from-[#0f171e] dark:to-[#0B1115] border border-zinc-800 dark:border-white/10 rounded-[2.5rem] p-10 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                Leave your mark.
              </h2>
              <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
                Become a Promptmaster. Share your private collection with the world and shape how we interact with artificial intelligence.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/prompts/new" 
                  className="px-8 py-4 bg-cyan-500 text-[#0B1115] font-extrabold rounded-2xl hover:bg-cyan-400 transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/25"
                >
                  Contribute Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/promptmasters" 
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-colors border border-white/10 flex items-center gap-2 backdrop-blur-sm"
                >
                  <Users className="w-5 h-5" /> View Creators
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
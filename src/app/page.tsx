import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowRight, Sparkles, Terminal, Users, Search, Bot, ShieldCheck, Plus } from "lucide-react";
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
  image?: string;
}

export default async function HomePage() {
  let prompts: Prompt[] = [];
  let categories = [];

  try {
    // Read directly from filesystem which is more reliable for server components
    const promptsPath = path.join(process.cwd(), "public/data/prompts.json");
    const categoriesPath = path.join(process.cwd(), "public/data/categories.json");
    
    if (fs.existsSync(promptsPath)) {
      const promptsData = fs.readFileSync(promptsPath, "utf-8");
      prompts = JSON.parse(promptsData);
    }
    
    if (fs.existsSync(categoriesPath)) {
      const categoriesData = fs.readFileSync(categoriesPath, "utf-8");
      categories = JSON.parse(categoriesData);
    }
  } catch (error) {
    console.error("Error loading static data:", error);
  }

  // Handle both array and object format { prompts: [...] }
  const promptsArray = Array.isArray(prompts) ? prompts : (prompts as any).prompts || [];
  const featuredPrompts = promptsArray.slice(0, 6);
  
  const displayCategories = Array.isArray(categories) ? (categories as any[]).slice(0, 5) : [
    { id: "1", slug: "development", name: "Development" },
    { id: "2", slug: "writing", name: "Writing" },
    { id: "3", slug: "marketing", name: "Marketing" },
    { id: "4", slug: "business", name: "Business" },
  ];

  const sponsors = [
    { name: "Warp", logo: "/warp.png", className: "bg-white/80 backdrop-blur-sm p-2 rounded-lg" },
    { name: "Sentry", logo: "/sentry.png", className: "scale-125 origin-center" },
    { name: "CommandCode", logo: "/commandCodeAI.png", className: "bg-white/80 backdrop-blur-sm p-2 rounded-lg" },
    { name: "Cognition", logo: "/Cognition_PrimaryLockup_Black.png", className: "bg-white/80 backdrop-blur-sm p-2 rounded-lg scale-125 origin-center" },
    { name: "CodeRabbit", logo: "/code-rabbit.png" },
    { name: "Each Labs", logo: "/each-labs.jpg", className: "bg-white/80 backdrop-blur-sm p-2 rounded-lg" },
    { name: "Wiro", logo: "/wiro.png", className: "bg-white/80 backdrop-blur-sm p-2 rounded-lg" },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-zinc-50 text-zinc-900 selection:bg-cyan-200">
      
      {/* =========================================
          1. HERO SECTION (Full Background Image Adjusted)
          ========================================= */}
      <section className="relative w-full min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden border-b border-zinc-200/50">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 bg-white">
          <img 
            src="/hero-section.jpeg" 
            alt="Seraphy Background Mascot" 
            className="w-full h-full object-cover object-[center_20%] -scale-x-100 opacity-75 transition-opacity duration-1000"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-50 via-zinc-50/95 to-transparent"></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-transparent to-transparent"></div>
        </div>

        {/* Subtle Turquoise/Cyan Glow behind text */}
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-cyan-500/15 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        {/* Main Hero Content */}
        <div className="container relative mx-auto px-4 max-w-7xl z-10 pt-24 pb-12">
          <div className="max-w-2xl lg:max-w-3xl">
            <Link 
              href="/about"
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest rounded-full bg-white/50 text-zinc-800 border border-zinc-200/80 shadow-sm hover:border-cyan-500/50 backdrop-blur-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>SeraphyAgent 1.0</span>
            </Link>
            
            <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold tracking-tight mb-6 text-zinc-900 leading-[1.05]">
              Master the Art of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500">
                AI Communication
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-700 mb-10 leading-relaxed font-medium drop-shadow-sm">
              The most sophisticated open-source directory for AI prompts and agents. Discover, copy, and orchestrate workflows with elegance and precision.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
              <Link 
                href="/prompts" 
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white font-extrabold rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 hover:-translate-y-1"
              >
                <Search className="w-5 h-5" /> Explore Library
              </Link>
              <Link 
                href="/prompts/new" 
                className="w-full sm:w-auto px-8 py-4 bg-white/80 text-zinc-900 font-bold rounded-2xl border border-zinc-200 hover:bg-white transition-all flex items-center justify-center gap-2 backdrop-blur-md hover:-translate-y-1"
              >
                <Terminal className="w-5 h-5" /> Submit Prompt
              </Link>
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap items-center gap-2 relative z-20">
              <span className="text-sm font-semibold text-zinc-600 mr-2 drop-shadow-sm">Trending:</span>
              {displayCategories.map((category: any) => (
                <Link 
                  key={category.id} 
                  href={`/prompts?category=${category.slug}`}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/60 border border-zinc-200/50 text-zinc-700 hover:text-cyan-700 backdrop-blur-md transition-colors shadow-sm"
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
      <section className="w-full py-12 bg-white border-b border-zinc-200/50 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <p className="text-center text-xs md:text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8">
            Supported by the Community & Innovators
          </p>
          <div className="overflow-hidden">
            <div 
              className="flex gap-8 md:gap-16 opacity-75 hover:opacity-100 transition-all duration-500"
              style={{
                animation: 'scroll-horizontal 30s linear infinite',
              }}
            >
              <style dangerouslySetInnerHTML={{
                __html: `
                  @keyframes scroll-horizontal {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                `
              }} />
              {/* Duplicate sponsors for seamless infinite scroll */}
              {[...sponsors, ...sponsors].map((sponsor, index) => (
                <div key={`${sponsor.name}-${index}`} className={`relative h-12 w-32 md:w-40 flex items-center justify-center flex-shrink-0 ${sponsor.className || ''}`}>
                  <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. TRENDING PROMPTS SECTION
          ========================================= */}
      <section className="w-full py-24 bg-white relative z-10">
        <div className="container mx-auto px-1 max-w-screen-xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-zinc-900 tracking-tight flex items-center gap-3">
                Curated Collection <Sparkles className="w-6 h-6 text-cyan-500" />
              </h2>
              <p className="text-zinc-600 text-lg">
                High-fidelity prompts crafted by the community, for the community.
              </p>
            </div>
            <Link 
              href="/prompts" 
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition-all group"
            >
              View directory <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrompts.map((prompt: any) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
            
            {featuredPrompts.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-200 rounded-3xl text-zinc-500 font-medium">
                No prompts available yet. The canvas is yours.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================
          4. WHY US / BENEFITS SECTION
          ========================================= */}
      <section className="w-full py-32 bg-white border-y border-zinc-200/50 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            
            <div className="md:w-1/3 sticky top-32">
              <span className="text-cyan-600 font-bold uppercase tracking-widest text-xs mb-4 block">
                The Seraphy Standard
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-zinc-900 leading-tight">
                Not just prompts.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-800">
                  Engineering.
                </span>
              </h2>
              <p className="text-lg text-zinc-600 mb-8 leading-relaxed">
                We treat prompt engineering like software development. Versioned, tested, and optimized for maximum token efficiency.
              </p>
              <Link href="/about" className="inline-flex items-center text-sm font-bold border-b border-zinc-900 pb-0.5 hover:text-cyan-500 hover:border-cyan-500 transition-all">
                Read our philosophy <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="md:w-2/3 grid grid-cols-1 gap-8">
              
              <div className="flex gap-6 p-8 rounded-3xl bg-zinc-50/50 border border-zinc-100 hover:border-cyan-500/20 transition-all group">
                <div className="flex-shrink-0 w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all shadow-sm">
                  <Terminal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-zinc-900">Zero-Shot Precision</h3>
                  <p className="text-zinc-600 leading-relaxed">
                    Stop wrestling with hallucinations. Our prompts are structured to force the AI into a specific cognitive framework from the very first token.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-zinc-50/50 border border-zinc-100 hover:border-cyan-500/20 transition-all group">
                <div className="flex-shrink-0 w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all shadow-sm">
                   <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-zinc-900">Model Agnostic</h3>
                  <p className="text-zinc-600 leading-relaxed">
                    Whether you're running Llama 3 locally or using GPT-4o via API, our syntax is designed to be universally understood by LLM architectures.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 p-8 rounded-3xl bg-zinc-50/50 border border-zinc-100 hover:border-cyan-500/20 transition-all group">
                <div className="flex-shrink-0 w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center border border-zinc-200 group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500 transition-all shadow-sm">
                   <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-zinc-900">Agent-Ready Skills</h3>
                  <p className="text-zinc-600 leading-relaxed">
                    Beyond simple Q&A. Use our "Skills" library to give your AI agent capabilities like code review, sentiment analysis, and data extraction.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          5. COMMUNITY / CTA SECTION
          ========================================= */}
      <section className="w-full py-32 bg-white relative z-10 overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold uppercase tracking-wider rounded-full bg-white border border-zinc-200 text-zinc-500">
             <Users className="w-3.5 h-3.5" /> Join 2,000+ Prompt Engineers
          </div>
          
          <h2 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tighter text-zinc-900 leading-[0.9]">
            Build the future,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
              one prompt at a time.
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-zinc-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
             Don't just consume AI. Master it. Share your best workflows and help others navigate the latent space.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/prompts" 
              className="px-8 py-4 bg-white border border-zinc-200 text-zinc-900 font-bold text-lg rounded-2xl hover:bg-zinc-50 transition-all flex items-center gap-2"
            >
              Explore Collection
            </Link>
          </div>

        
        </div>
      </section>

    </main>
  );
}
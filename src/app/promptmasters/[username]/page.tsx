import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, FileText, Activity, Heart, Share2, Calendar } from "lucide-react";
import PromptCard from "@/components/PromptCard";
import { getPromptmastersSync } from "@/lib/data";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function PromptmasterProfilePage({ params }: PageProps) {
  const resolvedParams = await params;
  const username = decodeURIComponent(resolvedParams.username);

  // Ambil data Master
  const allMasters = getPromptmastersSync();
  const master = allMasters.find((m) => m.username.toLowerCase() === username.toLowerCase());

  if (!master) {
    notFound();
  }

  // --- LOGIKA FETCH PROMPT YANG DIPERBAIKI ---
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  let allPrompts: any[] = [];
  
  try {
    // Menarik data dari prompts.json dan all_prompts.json sekaligus
    const [promptsRes, allPromptsRes] = await Promise.all([
      fetch(`${baseUrl}/data/prompts.json`, { cache: "no-store" }).catch(() => null),
      fetch(`${baseUrl}/data/all_prompts.json`, { cache: "no-store" }).catch(() => null)
    ]);

    const promptsData = promptsRes?.ok ? await promptsRes.json() : [];
    const allPromptsData = allPromptsRes?.ok ? await allPromptsRes.json() : [];
    
    // Gabungkan array-nya
    allPrompts = [...promptsData, ...allPromptsData];
  } catch (error) {
    console.error("Error fetching prompts:", error);
  }

  // Ubah semua target ID ke String agar aman saat dicocokkan
  const masterPromptIds = master.prompt_ids?.map(String) || [];
  
  // Filter prompt yang dimiliki user ini
  const rawUserPrompts = allPrompts.filter((p) => {
     const pid = String(p.id);
     // Cocokkan jika ID ada di array prompt_ids ATAU nama dia ada di contributors
     return masterPromptIds.includes(pid) || 
            p.contributors?.some((c: string) => c.toLowerCase() === username.toLowerCase());
  });

  // Hapus duplikat (jika prompt yang sama ada di prompts.json & all_prompts.json)
  const userPrompts = Array.from(new Map(rawUserPrompts.map(item => [item.id, item])).values());


  // --- MOCKUP DATA UNTUK GITHUB CONTRIBUTION GRAPH ---
  const weeks = 52;
  const days = 7;
  const totalDays = weeks * days;
  const seed = username.length + (master.prompt_count || 1); 
  
  const targetContributions = 12 + (seed % 8); 
  const contributionData = Array(totalDays).fill(0);
  
  const pseudoRandom = (i: number) => {
    const x = Math.sin(seed + i) * 10000;
    return x - Math.floor(x);
  };

  let mockTotalContributions = 0;
  for (let i = 0; i < targetContributions; i++) {
    const randomDayIndex = Math.floor(pseudoRandom(i) * totalDays);
    contributionData[randomDayIndex] = Math.min(contributionData[randomDayIndex] + 1, 4);
    mockTotalContributions++;
  }

  const getSquareColor = (level: number) => {
    switch (level) {
      case 4: return "bg-emerald-600";
      case 3: return "bg-emerald-500";
      case 2: return "bg-emerald-400";
      case 1: return "bg-emerald-200";
      default: return "bg-zinc-100";
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 pb-20 selection:bg-cyan-200 pt-16">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/70 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <Link 
            href="/promptmasters" 
            className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Directory
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-zinc-100 transition-colors border border-transparent hover:border-zinc-200">
              <Share2 className="w-4 h-4 text-zinc-500" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-4 pt-12">
        
        {/* Profile Info Section */}
        <section className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-white font-bold text-4xl shadow-xl border-4 border-white flex-shrink-0">
             {username.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">
                {username}
              </h1>
              {master.rank <= 10 && (
                <BadgeCheck className="w-7 h-7 text-cyan-500 fill-cyan-500/20" title="Top 10 Contributor" />
              )}
            </div>
            <p className="text-zinc-500 text-base mb-5 font-medium">@{username}</p>
            
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm">
                <FileText className="w-4 h-4 text-zinc-400" />
                <span className="font-extrabold text-zinc-900">{master.prompt_count || 0}</span>
                <span className="text-zinc-500 font-medium">Prompts</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm">
                <Activity className="w-4 h-4 text-zinc-400" />
                <span className="font-extrabold text-zinc-900">Rank #{master.rank}</span>
                <span className="text-zinc-500 font-medium">Global</span>
              </div>
            </div>
          </div>
        </section>

        {/* GitHub-like Contribution Graph */}
        <section className="mb-10 bg-white border border-zinc-200 rounded-2xl p-5 md:p-6 shadow-sm max-w-fit">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-bold text-zinc-700">
              {mockTotalContributions} contributions in the last year
            </h2>
          </div>
          
          <div className="overflow-x-auto pb-2 custom-scrollbar">
            <div className="min-w-max grid grid-rows-7 grid-flow-col gap-[2px]">
              {contributionData.map((level, i) => (
                <div 
                  key={i} 
                  className={`w-2.5 h-2.5 rounded-[1px] ${getSquareColor(level)} hover:ring-1 hover:ring-zinc-400 transition-all cursor-crosshair`}
                  title={`${level > 0 ? level : 'No'} contributions on this day`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-1.5 mt-3 text-[11px] font-medium text-zinc-500">
            <span>Less</span>
            <div className="flex gap-[2px]">
              <div className="w-2.5 h-2.5 rounded-[1px] bg-zinc-100"></div>
              <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-200"></div>
              <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-400"></div>
              <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-500"></div>
              <div className="w-2.5 h-2.5 rounded-[1px] bg-emerald-600"></div>
            </div>
            <span>More</span>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="border-b border-zinc-200 mb-8">
          <nav className="flex gap-8">
            <button className="flex items-center gap-2 px-2 py-3 text-sm font-bold border-b-2 border-zinc-900 text-zinc-900">
              <FileText className="w-4 h-4" /> Prompts
            </button>
            <button className="flex items-center gap-2 px-2 py-3 text-sm font-medium border-b-2 border-transparent text-zinc-500 hover:text-cyan-600 hover:border-cyan-600 transition-all">
              <Heart className="w-4 h-4" /> Liked
            </button>
          </nav>
        </div>

        {/* Prompt Grid Content */}
        <section>
          {userPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPrompts.map((prompt: any) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-zinc-200 bg-white rounded-3xl">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                <FileText className="w-8 h-8 text-zinc-300" />
              </div>
              <h3 className="text-xl font-bold text-zinc-800 mb-2">No Prompts Yet</h3>
              <p className="text-zinc-500 font-medium max-w-sm mx-auto">
                This promptmaster hasn't published any public prompts. Check back later!
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Terminal, 
  Shield, 
  Zap,
  Github,
  Loader2,
  Share2
} from "lucide-react";

export default function SkillDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  
  const [skill, setSkill] = useState<any>(null);
  const [loading, setLoading] = useState(true); // Default to loading
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    // Only fetch if slug is available
    if (!slug) return;

    const fetchSkill = async () => {
      setLoading(true);
      try {
        const res = await fetch("/data/skills.json");
        if (!res.ok) throw new Error("Failed to fetch skills");
        const data = await res.json();
        const skillsArray = Array.isArray(data) ? data : (data.skills || []);
        
        const foundSkill = skillsArray.find((s: any) => s.slug === slug || s.id.toString() === slug);
        setSkill(foundSkill || null);
      } catch (error) {
        console.error("Error loading skill:", error);
        setSkill(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSkill();
  }, [slug]);

  const copyCommand = async () => {
    const command = skill?.install_command || (skill?.name ? `npx clawhub install ${skill.name}` : "");
    if (!command) return;
    
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    // Simple toggle for UI demo purposes
    setBookmarked(!bookmarked);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center space-y-4 bg-zinc-50 px-4">
        <div className="p-4 bg-zinc-100 rounded-full mb-4">
            <Zap className="w-12 h-12 text-zinc-300" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900">Skill not found</h2>
        <p className="text-zinc-500 max-w-md">The skill you are looking for doesn't exist or has been removed.</p>
        <Link 
            href="/skills" 
            className="px-6 py-2.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors font-medium shadow-sm"
        >
            Return to Skills
        </Link>
      </div>
    );
  }

  const installCmd = skill.install_command || `npx clawhub install ${skill.name}`;

  return (
    <main className="min-h-screen bg-zinc-50 pt-32 pb-20 animate-in fade-in duration-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-cyan-600 transition-colors w-fit group cursor-pointer" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Browse</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-8 md:items-start justify-between">
          <div className="space-y-6 flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="p-5 rounded-3xl bg-white border border-zinc-100 text-cyan-600 shadow-xl shadow-cyan-500/10">
                <Terminal className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-3">
                  {skill.name}
                </h1>
                <div className="flex items-center flex-wrap gap-4 text-sm font-medium">
                  <span className="flex items-center gap-2 text-zinc-500 bg-white px-3 py-1 rounded-full border border-zinc-200 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-zinc-300"></span>
                    by <span className="text-zinc-900 font-bold">{skill.author}</span>
                  </span>
                  
                  <span className="px-3 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-wide shadow-sm">
                    {skill.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleBookmark}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border transition-all font-semibold shadow-sm active:scale-95 ${
                bookmarked
                  ? 'bg-cyan-50 border-cyan-200 text-cyan-600'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
              }`}
            >
              {bookmarked ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
              <span className="">{bookmarked ? 'Saved' : 'Save'}</span>
            </button>
            
            {skill.github_url && (
                <a
                href={skill.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all font-semibold shadow-sm active:scale-95"
                >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
                </a>
            )}

            <button className="p-3 rounded-2xl bg-white border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm active:scale-95">
                <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero / Install Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Install Command - Prominent */}
          <div className="lg:col-span-3 rounded-3xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl shadow-zinc-900/20 group relative">
             {/* Glow Effect */}
             <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative bg-zinc-900 rounded-3xl h-full flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-xs font-bold font-mono text-zinc-400 tracking-widest uppercase">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                    <span className="ml-2 text-zinc-500">Installation</span>
                </div>
                <button
                    onClick={copyCommand}
                    className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-600"
                >
                    {copied ? (
                    <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> <span className="text-emerald-400">COPIED</span>
                    </>
                    ) : (
                    <>
                        <Copy className="w-3.5 h-3.5" /> <span>COPY COMMAND</span>
                    </>
                    )}
                </button>
                </div>
                <div className="p-8 md:p-10 font-mono text-base md:text-lg flex items-center overflow-x-auto scrollbar-hide">
                <span className="text-cyan-400 font-bold mr-4 select-none">$</span>
                <span className="text-zinc-100">{installCmd}</span>
                </div>
            </div>
          </div>
        </div>

        {/* Description & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                   <Zap className="w-32 h-32" />
               </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
                    <Zap className="w-5 h-5" />
                </div>
                About this Skill
              </h3>
              <div className="prose prose-zinc max-w-none relative z-10 text-zinc-600 leading-relaxed">
                {skill.description}
              </div>
            </section>

            {/* Capabilities */}
            <section className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
               <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Shield className="w-5 h-5" />
                 </div>
                 Capabilities
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-3 p-5 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-colors">
                   <Zap className="w-6 h-6 text-amber-500" />
                   <div>
                        <h4 className="font-bold text-zinc-900 text-sm">Low Latency</h4>
                        <p className="text-sm text-zinc-500 mt-1">Optimized for high-performance execution environments.</p>
                   </div>
                 </div>
                 <div className="flex flex-col gap-3 p-5 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-zinc-200 transition-colors">
                   <Shield className="w-6 h-6 text-emerald-500" />
                   <div>
                        <h4 className="font-bold text-zinc-900 text-sm">Secure Sandbox</h4>
                        <p className="text-sm text-zinc-500 mt-1">Runs with strict permission boundaries for safety.</p>
                   </div>
                 </div>
               </div>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-6 text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-500 rounded-full"></span>
                Metadata
              </h4>
              <div className="space-y-0 text-sm divide-y divide-zinc-100">
                <div className="flex justify-between items-center py-4">
                  <span className="text-zinc-500 font-medium">Version</span>
                  <span className="font-mono bg-zinc-100 text-zinc-700 px-2 py-1 rounded-md text-xs font-bold">1.0.0</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-zinc-500 font-medium">License</span>
                  <span className="text-zinc-900 font-medium">MIT</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-zinc-500 font-medium">Updated</span>
                  <span className="text-zinc-900 font-medium">3 days ago</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-zinc-500 font-medium">Downloads</span>
                  <span className="text-zinc-900 font-bold flex items-center gap-1">
                    1.2k <ArrowLeft className="w-3 h-3 rotate-[-135deg] text-green-500" />
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-6 text-sm uppercase tracking-wide flex items-center gap-2">
                <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {(skill.tags || ['ai', 'agent', 'tool']).map((tag: string) => (
                  <span key={tag} className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-bold text-zinc-600 hover:border-cyan-200 hover:text-cyan-700 hover:bg-cyan-50 transition-all cursor-default shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

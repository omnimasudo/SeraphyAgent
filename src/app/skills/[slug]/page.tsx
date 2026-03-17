"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  Terminal,
  Github,
  Zap,
  Shield, 
} from "lucide-react";

import { useSkills } from "@/hooks/useSkills";
import { useAuth } from "@/context/AuthContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { LoadingSpinner } from "@/components/Loading";
import { getCategoryConfig } from "@/lib/categoryUtils";


export default function SkillDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter(); 
  
  const { getSkillBySlug, loading } = useSkills();
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const [copied, setCopied] = useState(false);

  const skill = getSkillBySlug(slug);
  const bookmarked = skill ? isBookmarked(skill.id) : false;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-zinc-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 bg-zinc-50">
        <h2 className="text-2xl font-bold text-zinc-900">Skill not found</h2>
        <p className="text-zinc-500">The skill you are looking for doesn't exist or has been removed.</p>
        <Link href="/browse" className="text-primary hover:underline">Return to Browse</Link>
      </div>
    );
  }

  const { icon: CategoryIcon, color: catColor, bg: catBg, border: catBorder } = getCategoryConfig(skill.category);

  const copyCommand = async () => {
    if (skill.install_command) {
      await navigator.clipboard.writeText(skill.install_command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    await toggleBookmark(skill.id);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500">
        
        {/* Breadcrumb / Back */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <Link href="/skills">Back to Skills</Link>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white border border-zinc-200 text-zinc-900 shadow-sm">
                <Terminal className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-900">{skill.name}</h1>
                <div className="flex items-center gap-3 text-zinc-500 text-sm mt-3">
                  <span className="font-medium">by {skill.author}</span>
                  <span className="text-zinc-300">•</span>
                  
                  {/* Updated Category Badge - Clean & Colorful */}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide ${catBg} ${catBorder} ${catColor}`}>
                    <CategoryIcon className="w-3.5 h-3.5" />
                    {skill.category}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border font-medium transition-all shadow-sm ${
                bookmarked
                  ? 'bg-cyan-50 border-cyan-200 text-cyan-700'
                  : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
              }`}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{bookmarked ? 'Saved' : 'Save'}</span>
            </button>
            
            <a
              href={skill.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 text-white border border-zinc-900 hover:bg-zinc-800 hover:border-zinc-800 transition-all shadow-md hover:shadow-lg"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Hero / Install Block - Full Width now since Test Drive is removed */}
        <div className="w-full">
          <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between px-5 py-3 bg-zinc-50 border-b border-zinc-100">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>Installation</span>
              </div>
              <button
                onClick={copyCommand}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-cyan-600 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Command
                  </>
                )}
              </button>
            </div>
            <div className="p-6 font-mono text-sm md:text-base bg-zinc-900 text-zinc-100 flex items-center justify-between group cursor-pointer" onClick={copyCommand}>
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
                <span className="text-cyan-400 select-none">$</span>
                <span className="whitespace-nowrap">{skill.install_command}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                About this Skill
              </h3>
              <p className="text-zinc-600 leading-relaxed whitespace-pre-line text-base">
                {skill.description}
              </p>
            </section>

            {/* Features / Capabilities Mockup */}
            <section className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
               <h3 className="text-xl font-bold text-zinc-900 mb-5 flex items-center gap-2">
                 <Shield className="w-5 h-5 text-emerald-500" />
                 Capabilities
               </h3>
               <ul className="space-y-4">
                 <li className="flex items-start gap-3">
                   <div className="mt-1 p-1 rounded-full bg-cyan-100 text-cyan-700">
                      <Zap className="w-3 h-3" />
                   </div>
                   <span className="text-zinc-600">Optimized for low-latency execution environments.</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="mt-1 p-1 rounded-full bg-emerald-100 text-emerald-700">
                      <Shield className="w-3 h-3" />
                   </div>
                   <span className="text-zinc-600">Sandboxed execution with strict permission boundaries.</span>
                 </li>
                 <li className="flex items-start gap-3">
                   <div className="mt-1 p-1 rounded-full bg-purple-100 text-purple-700">
                      <Terminal className="w-3 h-3" />
                   </div>
                   <span className="text-zinc-600">Native CLI integration for seamless workflow.</span>
                 </li>
               </ul>
            </section>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-4 text-lg">Metadata</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Version</span>
                  <span className="font-medium text-zinc-900">1.0.0</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">License</span>
                  <span className="font-medium text-zinc-900">MIT</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100">
                  <span className="text-zinc-500">Updated</span>
                  <span className="font-medium text-zinc-900">2 days ago</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-500">Downloads</span>
                  <span className="font-medium text-zinc-900">1.2k</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <h4 className="font-bold text-zinc-900 mb-4 text-lg">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {(skill.tags || ['ai', 'automation', 'productivity']).map((tag: string) => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 border border-zinc-200 text-xs font-medium hover:bg-zinc-200 transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

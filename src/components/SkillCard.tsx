"use client";

import Link from "next/link";
import { Zap, ArrowUpRight, Cpu } from "lucide-react";

export default function SkillCard({ skill }: { skill: any }) {
  return (
    <Link 
      href={`/skills/${skill.slug || skill.id}`}
      className="group relative flex flex-col p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Aksen Warna di bagian atas kartu */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-40 group-hover:opacity-100 transition-opacity"></div>

      {/* Ikon & Panah Navigasi */}
      <div className="flex justify-between items-start mb-5">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <Cpu className="w-6 h-6" />
        </div>
        <div className="p-1 rounded-full group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800 transition-colors">
          <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </div>
      </div>

      {/* Info Skill */}
      <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {skill.name || skill.title}
      </h3>
      
      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-6 flex-grow leading-relaxed">
        {skill.description}
      </p>

      {/* Footer Call to Action */}
      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
          <Zap className="w-3 h-3 text-amber-600 dark:text-amber-400" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          Gunakan Skill Ini
        </span>
      </div>
    </Link>
  );
}
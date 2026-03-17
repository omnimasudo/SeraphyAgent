"use client";

import Link from "next/link";
import { Zap, ArrowUpRight, Cpu } from "lucide-react";

export default function SkillCard({ skill }: { skill: any }) {
  return (
    <Link 
      href={`/skills/${skill.slug || skill.id}`}
      className="group relative flex flex-col p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Aksen Warna di bagian atas kartu */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-40 group-hover:opacity-100 transition-opacity"></div>

      {/* Ikon & Panah Navigasi */}
      <div className="flex justify-between items-start mb-5">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
          <Cpu className="w-6 h-6" />
        </div>
        <div className="p-1 rounded-full group-hover:bg-zinc-100 transition-colors">
          <ArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 transition-colors" />
        </div>
      </div>

      {/* Info Skill */}
      <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">
        {skill.name || skill.title}
      </h3>
      
      <p className="text-sm text-zinc-600 line-clamp-2 mb-6 flex-grow leading-relaxed">
        {skill.description}
      </p>

      {/* Footer Call to Action */}
      <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-100">
        <div className="p-1 bg-amber-100 rounded-full">
          <Zap className="w-3 h-3 text-amber-600" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 group-hover:text-amber-600 transition-colors">
          Gunakan Skill Ini
        </span>
      </div>
    </Link>
  );
}
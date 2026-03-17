import Link from "next/link";
import { Github, Twitter, MessageCircle, Heart, Sparkles, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-[#070b0e] border-t border-zinc-200/50 dark:border-white/5 pt-16 pb-8 mt-auto relative z-10 overflow-hidden">
      
      {/* Dekorasi Cahaya Latar (Subtle Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-cyan-500/5 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          
          {/* Brand & Deskripsi (Kolom Besar) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 group mb-6">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-white/10 shadow-sm group-hover:scale-105 group-hover:border-cyan-500/50 transition-all duration-300">
                <img 
                  src="/logo.jpeg" 
                  alt="Seraphy Mascot" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Seraphy<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-400">Agent</span>
              </span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 max-w-sm">
              The premier open-source directory for AI prompts and agents. Discover, share, and master the art of communicating with artificial intelligence.
            </p>
            <Link 
              href="/prompts/new" 
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors group"
            >
              Submit your prompt <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Menu Platform */}
          <div className="lg:col-span-3 lg:col-start-6">
            <h4 className="text-zinc-900 dark:text-white font-bold mb-6 tracking-wide">Platform</h4>
            <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              <li><Link href="/prompts" className="hover:text-cyan-500 transition-colors">Explore Prompts</Link></li>
              <li><Link href="/skills" className="hover:text-cyan-500 transition-colors">AI Skills & Agents</Link></li>
              <li><Link href="/promptmasters" className="hover:text-cyan-500 transition-colors">Promptmasters</Link></li>
              <li><Link href="/prompts?category=development" className="hover:text-cyan-500 transition-colors">For Developers <span className="ml-1.5 inline-block px-1.5 py-0.5 bg-teal-500/10 text-teal-500 text-[9px] rounded uppercase">Hot</span></Link></li>
            </ul>
          </div>

          {/* Menu Resources & Legal */}
          <div className="lg:col-span-2">
            <h4 className="text-zinc-900 dark:text-white font-bold mb-6 tracking-wide">Resources</h4>
            <ul className="space-y-4 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              <li><Link href="/about" className="hover:text-cyan-500 transition-colors">About Us</Link></li>
              <li><Link href="/docs/api" className="hover:text-cyan-500 transition-colors">API Documentation</Link></li>
              <li><Link href="/privacy" className="hover:text-cyan-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Kolom Social Media / Komunitas */}
          <div className="lg:col-span-2">
            <h4 className="text-zinc-900 dark:text-white font-bold mb-6 tracking-wide">Community</h4>
            <div className="flex flex-col gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-white transition-colors group">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors border border-transparent dark:border-white/5">
                  <Github className="w-4 h-4" />
                </div>
                GitHub
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-white transition-colors group">
                <div className="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors border border-transparent dark:border-white/5">
                  <Twitter className="w-4 h-4" />
                </div>
                Twitter / X
              </a>
            </div>
          </div>

        </div>

        {/* Garis Pemisah & Copyright */}
        <div className="pt-8 border-t border-zinc-200/80 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-500">
          <p>© {currentYear} SeraphyAgent. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by the open source community.
          </p>
        </div>
      </div>
    </footer>
  );
}
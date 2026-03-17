"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Users, Zap, Menu, X, Plus } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Efek blur saat scroll (Apple/Glassmorphism style)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update Navigasi "Creators" -> "Promptmasters"
  const navLinks = [
    { name: "Prompts", href: "/prompts", icon: Terminal },
    { name: "Skills", href: "/skills", icon: Zap },
    { name: "Promptmasters", href: "/promptmasters", icon: Users },
  ];

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        isScrolled 
          ? "bg-white/80 dark:bg-[#0B1115]/80 backdrop-blur-md border-zinc-200 dark:border-white/10 shadow-sm py-3" 
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        
        {/* Brand Logo with Avatar Image */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Container Maskot Bulat */}
          <div className="relative w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white dark:border-white/10 shadow-sm group-hover:scale-105 group-hover:border-cyan-500/50 transition-all duration-300">
            {/* Pastikan file ini ada di public/logo.jpeg */}
            <img 
              src="/logo.jpeg" 
              alt="Seraphy Mascot" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Seraphy<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-400">Agent</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-1 p-1 bg-zinc-100/50 dark:bg-white/5 rounded-full border border-zinc-200/50 dark:border-white/5 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-white dark:bg-cyan-500/10 text-zinc-900 dark:text-cyan-400 shadow-sm border border-zinc-200/50 dark:border-cyan-500/20" 
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/prompts/new" 
            className="flex items-center gap-1.5 px-5 py-2.5 bg-zinc-900 text-white dark:bg-cyan-500 dark:text-[#0B1115] text-sm font-extrabold rounded-xl transition-all shadow-md dark:shadow-cyan-500/20 hover:shadow-lg hover:-translate-y-0.5 dark:hover:bg-cyan-400"
          >
            <Plus className="w-4 h-4" /> Submit
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:text-cyan-500 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0B1115] border-b border-zinc-200 dark:border-white/10 shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                    isActive 
                      ? "bg-zinc-100 dark:bg-cyan-500/10 text-zinc-900 dark:text-cyan-400 border border-transparent dark:border-cyan-500/20" 
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
            <hr className="my-2 border-zinc-100 dark:border-white/10" />
            <Link 
              href="/prompts/new" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 text-white dark:bg-cyan-500 dark:text-[#0B1115] text-base font-extrabold rounded-xl w-full shadow-lg dark:shadow-cyan-500/20"
            >
              <Plus className="w-5 h-5" /> Submit Prompt
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
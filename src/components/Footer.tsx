"use client";

import Link from "next/link";
import { Mail, Github, Twitter, Linkedin, Heart, Terminal, Zap, ShieldCheck } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[#0B1115] border-t border-zinc-200 dark:border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-100 dark:border-white/10 shadow-sm group-hover:border-cyan-400 transition-colors">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/logo.jpeg" 
                  alt="Seraphy Mascot" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Seraphy<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">Agent</span>
              </span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-sm">
              The ultimate directory for high-quality AI prompts and skills. 
              Empowering creators and developers to build better with AI.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} label="Twitter" />
              <SocialLink href="#" icon={<Github className="w-5 h-5" />} label="GitHub" />
              <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
            </div>
          </div>

          {/* Links Column 1: Explore */}
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Explore</h3>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li><FooterLink href="/prompts">All Prompts</FooterLink></li>
              <li><FooterLink href="/skills">AI Skills</FooterLink></li>
              <li><FooterLink href="/promptmasters">Top Contributors</FooterLink></li>
              <li><FooterLink href="/categories">Categories</FooterLink></li>
            </ul>
             <div className="mt-6 flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1.5 rounded-full w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              System Operational
             </div>
          </div>

          {/* Links Column 2: Resources */}
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Resources</h3>
            <ul className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400">
              <li><FooterLink href="/blog">Blog</FooterLink></li>
              <li><FooterLink href="/docs">Documentation</FooterLink></li>
              <li><FooterLink href="/guides">Prompt Engineering Guide</FooterLink></li>
              <li><FooterLink href="/api">API Access</FooterLink></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-6">Stay Updated</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">
              Get the latest prompts and AI tricks delivered to your inbox weekly.
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all placeholder:text-zinc-400"
              />
              <button className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-cyan-500 dark:text-[#0B1115] text-sm font-bold hover:bg-zinc-800 dark:hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/10">
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="pt-8 border-t border-zinc-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500 dark:text-zinc-500">
          <p>© {currentYear} SeraphyAgent Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/cookies">Cookie Settings</FooterLink>
          </div>
        </div>

      </div>
    </footer>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      aria-label={label}
      className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-cyan-600 dark:text-zinc-400 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-colors"
    >
      {icon}
    </Link>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
    >
      {children}
    </Link>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

// Menggunakan font Inter untuk kesan bersih/clean
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SeraphyAgent | AI Prompts & Skills Directory",
  description: "Discover, copy, and use the best AI prompts and skills for ChatGPT, Claude, and Gemini.",
};

export default function RootLayout({
  children,
}: ReadReadOnly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased`}>
        {/* Global Navbar */}
        <Navbar />
        
        {/* Konten Halaman */}
        <div className="flex flex-col min-h-screen">
          {children}
        </div>

        {/* Global Footer (Revised) */}
        <Footer />
      </body>
    </html>
  );
}
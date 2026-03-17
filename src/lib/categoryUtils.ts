import { 
  Globe, 
  Server, 
  Brain, 
  PenTool, 
  Database, 
  Box, 
  Code,
  Zap,
  Cpu, 
  Search,
  CheckCircle,
  Terminal
} from "lucide-react";

export const getCategoryConfig = (category: string) => {
  const norm = (category || "").toLowerCase();
  
  // Specific mappings first
  if (norm.includes("web") || norm.includes("frontend")) {
    return { icon: Globe, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200" };
  }
  if (norm.includes("coding") || norm.includes("agent") || norm.includes("dev")) {
    return { icon: Terminal, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200" };
  }
  if (norm.includes("backend") || norm.includes("api") || norm.includes("cloud")) {
    return { icon: Server, color: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200", badge: "bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200" };
  }
  if (norm.includes("ai") || norm.includes("llm") || norm.includes("machine") || norm.includes("data")) {
    return { icon: Brain, color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200" };
  }
  if (norm.includes("design") || norm.includes("ui") || norm.includes("ux")) {
    return { icon: PenTool, color: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200", badge: "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200" };
  }
  if (norm.includes("search") || norm.includes("research")) {
    return { icon: Search, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200" };
  }
  if (norm.includes("productivity") || norm.includes("task")) {
    return { icon: CheckCircle, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200" };
  }
  if (norm.includes("tool") || norm.includes("util") || norm.includes("claw")) {
    return { icon: Box, color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", badge: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200" };
  }

  // Fallback
  return { icon: Cpu, color: "text-zinc-700", bg: "bg-zinc-100", border: "border-zinc-200", badge: "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200" };
};
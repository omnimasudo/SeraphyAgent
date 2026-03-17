"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { Skill } from "@/types";

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  skill?: Skill;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatWindow({ isOpen, onClose, skill }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm ready to demonstrate the ${skill?.name || "skill"} capabilities. How can I help you?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && skill) {
      setMessages([
        { role: 'assistant', content: `Hello! I'm ready to demonstrate the ${skill.name} capabilities. How can I help you?` }
      ]);
    }
  }, [isOpen, skill]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = `I am simulating the behavior of ${skill?.name}. You said: "${userMsg}". This is a test drive environment.`;
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[80vh] overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Test Drive: {skill?.name}</h3>
              <p className="text-xs text-white/40">Interactive Demo Environment</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${msg.role === 'user' ? 'bg-white/10 text-white' : 'bg-primary/20 text-primary'}
              `}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`
                max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed
                ${msg.role === 'user' 
                  ? 'bg-white text-black rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'}
              `}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-white/5">
          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${skill?.name} something...`}
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
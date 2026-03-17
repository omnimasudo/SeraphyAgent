"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Loader2, Send, X, Bot, Sparkles } from "lucide-react";

export default function SeraphyChatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hi! I'm Seraphy. I can help you find the perfect AI skill or agent for your workflow. What are you looking for?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMsg }],
        }),
      });

      if (!response.ok) {
         throw new Error(`API Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.reply || "I'm having trouble connecting right now. Please try again later."
      }]);
    } catch (error) {
       console.error("Chat Error:", error);
       setMessages(prev => [...prev, { 
           role: 'assistant', 
           content: "Sorry, I encountered an error connecting to my brain. Please check your API key configuration." 
       }]);
    } finally {
       setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 m-4 flex flex-col max-h-[600px]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-xl text-white shadow-lg shadow-cyan-500/20">
                 <Bot className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="font-bold text-zinc-900">Ask Seraphy</h3>
                 <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> AI Assistant
                 </p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-zinc-200 rounded-full transition-colors text-zinc-500">
              <X className="w-5 h-5" />
           </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
           {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-zinc-900 text-white rounded-br-none' 
                    : 'bg-zinc-100 text-zinc-700 rounded-bl-none'
                 }`}>
                    {msg.content}
                 </div>
              </div>
           ))}
           {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-zinc-100 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                    <span className="text-xs text-zinc-400">Thinking...</span>
                 </div>
              </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-zinc-100 bg-zinc-50">
           <div className="relative flex items-center">
              <input 
                 type="text" 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Ask about skills..."
                 className="w-full pl-4 pr-12 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                 <Send className="w-4 h-4" />
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}

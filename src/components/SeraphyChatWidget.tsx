"use client";

import { useState, useRef, useEffect } from "react";
import { Send, X, Loader2, Sparkles, MessageCircle } from "lucide-react";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function SeraphyChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm Seraphy! ✨ Looking for a specific prompt? Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-seraphy', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ message: userMessage, history: messages })
      });
      
      const data = await res.json();
      
      if (data.content) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      } else {
          setMessages(prev => [...prev, { role: 'assistant', content: "Oops! Something went wrong. 😅" }]);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I can't reach my brain right now! 🧠💥" }]);
    } finally {
      setIsLoading(false);
    }
  };

  // HELPER: Mengubah markdown **bold** menjadi <strong> dan \n menjadi <br/>
  const formatMessage = (text: string) => {
    // Pisahkan teks berdasarkan pola **teks**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      // Jika bagian tersebut adalah bold text
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      
      // Handle enter / baris baru untuk teks biasa
      return (
        <span key={index}>
          {part.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i !== arr.length - 1 && <br />}
            </span>
          ))}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        <span className="font-bold text-sm tracking-wide hidden md:inline-block">Ask Seraphy</span>
        {!isOpen && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping border-2 border-white"></div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[550px] z-50 bg-white rounded-3xl shadow-2xl shadow-cyan-900/10 border border-zinc-200/80 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 flex items-center justify-between text-white shadow-sm relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/40 shadow-sm bg-white flex-shrink-0">
                <img 
                  src="/logo.jpeg" 
                  alt="Seraphy" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-[15px] tracking-tight">Seraphy Agent</h3>
                <span className="text-[11px] font-bold text-cyan-50 flex items-center gap-1.5 uppercase tracking-widest mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse shadow-[0_0_5px_rgba(110,231,183,0.8)]"></span> Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors border border-transparent hover:border-white/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-zinc-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm font-medium ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-tr from-cyan-600 to-teal-500 text-white rounded-br-sm shadow-cyan-500/10' 
                      : 'bg-white text-zinc-800 border border-zinc-200/80 rounded-bl-sm'
                  }`}
                >
                   {msg.role === 'assistant' && (
                     <div className="flex items-center gap-1.5 mb-1.5 opacity-60 text-[10px] uppercase tracking-wider font-extrabold text-cyan-700">
                       <Sparkles className="w-3 h-3" /> Seraphy
                     </div>
                   )}
                   {/* Gunakan helper di sini */}
                   {formatMessage(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white p-3.5 rounded-2xl rounded-bl-sm border border-zinc-200/80 shadow-sm flex items-center gap-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                    <span className="text-xs text-zinc-500 font-semibold tracking-wide">Typing...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2 relative z-10">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a prompt..." 
              className="flex-1 px-4 py-3 bg-zinc-100/80 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:bg-white transition-all placeholder:text-zinc-400 text-zinc-800 border border-transparent focus:border-cyan-500/20"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="p-3 bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
        </div>
      )}
    </>
  );
}
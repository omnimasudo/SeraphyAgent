"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Loader2, Sparkles, MessageCircle } from "lucide-react";

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

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        <span className="font-bold hidden md:inline-block">Ask Seraphy</span>
        {/* Simple Mascot Indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-96 h-[500px] z-50 bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Seraphy Agent</h3>
                <span className="text-xs text-cyan-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/10 p-1.5 rounded-full hover:bg-white/20 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-none'
                  }`}
                >
                   {msg.role === 'assistant' && (
                     <div className="flex items-center gap-1.5 mb-1 opacity-50 text-[10px] uppercase tracking-wider font-bold">
                       <Sparkles className="w-3 h-3" /> Seraphy
                     </div>
                   )}
                   {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-zinc-200 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                    <span className="text-xs text-zinc-400 font-medium">Thinking...</span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a prompt..." 
              className="flex-1 px-4 py-2.5 bg-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-zinc-500 text-zinc-800"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
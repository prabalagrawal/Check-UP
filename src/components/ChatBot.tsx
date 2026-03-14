import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, ArrowUpRight } from 'lucide-react';
import { chatWithOllie } from '../services/aiService';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; sources?: any[] }[]>([
    { role: 'model', text: "Hoot! I am Ollie, your wise digital health twin. I can translate the internet's vast medical knowledge into simple wisdom for you. How may I guide you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await chatWithOllie(userMessage, history);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || "My apologies, the digital winds are silent on this matter.",
        sources: response.sources
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Hoot! My internet feathers are a bit ruffled. Let us try again shortly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-white text-white rounded-full shadow-[0_20px_50px_rgba(30,58,138,0.3)] flex items-center justify-center z-[100] border-4 border-white overflow-hidden"
      >
        <img src="/ollie-logo.png" alt="Ollie" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-[#22C55E] rounded-full border-2 border-white" 
        />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 100, scale: 0.9, filter: 'blur(10px)' }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[420px] h-[650px] bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] z-[100] flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-owl-blue to-[#3B82F6] p-8 text-white flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-md overflow-hidden">
                  <img src="/ollie-logo.png" alt="Ollie" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-black text-lg tracking-tight">Ollie the Owl</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Wise & Online</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 p-2 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#F8FAFC]">
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-owl-blue text-white rounded-tr-none shadow-lg' 
                      : 'bg-white text-gray-800 shadow-sm border border-owl-brown/5 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Wisdom Sources</p>
                        <div className="flex flex-wrap gap-2">
                          {m.sources.map((source, si) => (
                            <a 
                              key={si} 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] text-owl-blue font-bold hover:underline flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 transition-all hover:bg-white"
                            >
                              {source.title || 'Link'}
                              <ArrowUpRight className="w-2 h-2 ml-1" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-5 rounded-[2rem] rounded-tl-none shadow-sm border border-gray-100">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-owl-blue rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-owl-blue rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-owl-blue rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-gray-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Ollie for wisdom..."
                  className="w-full pl-6 pr-14 py-5 bg-gray-50 border border-owl-brown/10 rounded-[2rem] focus:ring-2 focus:ring-owl-blue outline-none transition-all text-sm font-medium"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-3 bg-owl-blue text-white rounded-2xl hover:bg-owl-blue/90 transition-all disabled:opacity-50 shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center space-x-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>Powered by Global Medical Knowledge</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

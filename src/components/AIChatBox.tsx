import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, X, MessageSquare, Loader2 } from 'lucide-react';
import type { FinancialResult } from '../utils/finance';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface AIChatBoxProps {
  financialData: any;
  financialResult: FinancialResult;
}

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const AIChatBox = ({ financialData, financialResult }: AIChatBoxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: `Hello! I've analyzed your financial health. Your score is ${financialResult.score}/100 with a ${financialResult.riskLevel} risk level. How can I help you improve your roadmap today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "google/gemini-2.0-flash-lite-001",
          "messages": [
            {
              "role": "system",
              "content": `You are an expert AI Financial Advisor. You have access to the user's financial data:
              Score: ${financialResult.score}/100
              Risk Level: ${financialResult.riskLevel}
              Total Income: ₹${financialResult.incomeTotal}
              Total Expenses: ₹${financialResult.totalExpenses}
              Savings Ratio: ${(financialResult.savingsRatio * 100).toFixed(1)}%
              Debt Ratio: ${(financialResult.debtRatio * 100).toFixed(1)}%
              
              Raw Data: ${JSON.stringify(financialData)}
              
              Provide concise, professional, and actionable financial advice. Be encouraging but realistic.`
            },
            ...messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })),
            { role: "user", content: userMessage }
          ]
        })
      });

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-yellow-500 text-slate-900 rounded-full shadow-2xl hover:bg-yellow-400 transition-all hover:scale-110 active:scale-95 z-40 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col border border-gray-100 dark:border-slate-800 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-yellow-500 text-slate-900 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-black/10 rounded-lg">
                  <Bot className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">FinHealth AI Assistant</h3>
                  <p className="text-[10px] text-slate-800 uppercase tracking-widest font-semibold opacity-70">Online & Analyzing</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:rotate-90 transition-transform p-1 hover:bg-black/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-950/50 scroll-smooth"
            >
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, x: m.role === 'ai' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex max-w-[85%] space-x-2 ${m.role === 'ai' ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                    <div className={`p-2 rounded-lg shrink-0 h-fit ${m.role === 'ai' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                      {m.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'ai' 
                        ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-slate-700' 
                        : 'bg-yellow-500 text-slate-900 rounded-tr-none font-medium'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-center space-x-2 p-2 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
                  <span className="text-xs font-medium">AI is thinking...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about your financial plan..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-slate-950 border-none rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 outline-none transition-all dark:text-white placeholder-gray-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-yellow-500 text-slate-900 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

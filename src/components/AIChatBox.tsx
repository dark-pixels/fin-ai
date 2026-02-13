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

const OPENROUTER_API_KEY = "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";

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
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 z-40 group"
      >
        <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col border border-gray-100 dark:border-slate-700 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">FinHealth AI Assistant</h3>
                  <p className="text-[10px] text-indigo-100 uppercase tracking-widest font-semibold">Online & Analyzing</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:rotate-90 transition-transform p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-900/50 scroll-smooth"
            >
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, x: m.role === 'ai' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex max-w-[85%] space-x-2 ${m.role === 'ai' ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                    <div className={`p-2 rounded-lg shrink-0 h-fit ${m.role === 'ai' ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}>
                      {m.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      m.role === 'ai' 
                        ? 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none' 
                        : 'bg-indigo-600 text-white rounded-tr-none'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-center space-x-2 p-2 text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="text-xs font-medium">AI is thinking...</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about your financial plan..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

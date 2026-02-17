import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PieChart, ShieldCheck, Wallet } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 max-w-4xl"
      >
        <span className="bg-yellow-500/10 text-yellow-500 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide border border-yellow-500/20">
          Financial Health Advisor
        </span>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
          Master Your Money with <br />
          <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            AI-Powered Insights
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Get a comprehensive analysis of your income, expenses, and savings in minutes. No sign-up required.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => navigate('/check')}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-slate-900 transition-all duration-200 bg-yellow-400 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 hover:bg-yellow-300 shadow-lg shadow-yellow-500/30 hover:scale-105 active:scale-95"
        >
          Start Financial Check
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl"
      >
        {[
          {
            icon: PieChart,
            title: "Smart Analysis",
            desc: "Understand your spending patterns with interactive visualization."
          },
          {
            icon: ShieldCheck,
            title: "Risk Assessment",
            desc: "Calculate your financial stability score and potential risks."
          },
          {
            icon: Wallet,
            title: "Personalized Roadmap",
            desc: "Get an actionable 6-month plan to improve your wealth."
          },
        ].map((feature, idx) => (
          <div key={idx} className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-xl hover:border-yellow-500/30 transition-all group">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto border border-yellow-500/20">
              <feature.icon className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

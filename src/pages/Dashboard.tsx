import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  TrendingUp, CheckCircle, Brain
} from 'lucide-react';
import type { FinancialResult } from '../utils/finance';

const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#84cc16'];

import { AIChatBox } from '../components/AIChatBox';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, RefreshCw } from 'lucide-react';

export const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState<FinancialResult | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleDownloadPDF = async () => {
    if (!result || !data) return;

    const doc = new jsPDF();
    const pdfWidth = doc.internal.pageSize.getWidth();
    
    // Load Logo
    const logoUrl = '/logodp.jpeg';
    const logoImg = new Image();
    logoImg.src = logoUrl;
    
    try {
        await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = reject;
        });
        
        const imgProps = doc.getImageProperties(logoImg);
        // Maintain aspect ratio, width 30
        const imgHeight = (imgProps.height * 30) / imgProps.width;
        doc.addImage(logoImg, 'JPEG', 15, 10, 30, imgHeight);
    } catch (e) {
        console.error("Could not load logo for PDF", e);
    }

    // Header Text
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("DarkPixels FinHealth Report", 50, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 28);
    doc.text(`Risk Level: ${result.riskLevel}`, 50, 34);

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(15, 45, pdfWidth - 15, 45);

    let yPos = 55;

    // Executive Summary
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Executive Summary", 15, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Financial Score: ${result.score}/100`, 15, yPos);
    yPos += 8;
    doc.text(`Monthly Savings Ratio: ${(result.savingsRatio * 100).toFixed(1)}%`, 15, yPos);
    yPos += 8;
    doc.text(`Debt-to-Income Ratio: ${(result.debtRatio * 100).toFixed(1)}%`, 15, yPos);
    yPos += 15;

    // Financial Breakdown Table
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Financial Breakdown", 15, yPos);
    yPos += 5;

    const tableData = [
      ['Total Income', `INR ${result.incomeTotal.toLocaleString()}`],
      ['Total Expenses', `INR ${result.totalExpenses.toLocaleString()}`],
      ['Savings', `INR ${(result.incomeTotal - result.totalExpenses).toLocaleString()}`],
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Category', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [234, 179, 8] }, // Yellow-500
      margin: { left: 15 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Suggestions
    doc.setFontSize(14);
    doc.text("AI Recommendations", 15, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    result.suggestions.forEach((suggestion) => {
      // Split text to fit
      const splitText = doc.splitTextToSize(`• ${suggestion}`, pdfWidth - 30);
      doc.text(splitText, 15, yPos);
      yPos += (splitText.length * 6); 
    });

    yPos += 10;

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text("Developed by DarkPixels", pdfWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Save PDF
    doc.save("DarkPixels_FinHealth_Report.pdf");
  };

  useEffect(() => {
    if (location.state?.result) {
      // Simulate AI processing time
      setTimeout(() => {
        setResult(location.state.result);
        setData(location.state.data);
        setLoading(false);
      }, 2000);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-yellow-900/30 border-t-yellow-500 rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">
          AI is analyzing your financial health...
        </p>
      </div>
    );
  }

  if (!result) return null;

  const scoreColor = result.score >= 80 ? 'text-cyan-400' : result.score >= 50 ? 'text-yellow-400' : 'text-red-400';
  const riskColor = result.riskLevel === 'Excellent' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : result.riskLevel === 'Moderate' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20';

  const pieData = [
    { name: 'Savings', value: Math.max(0, result.savingsRatio) },
    { name: 'Expenses', value: result.expenseRatio },
    { name: 'Debt', value: result.debtRatio },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Health Report</h1>
          <p className="text-gray-500 dark:text-gray-400">Generated by AI Advisor • {new Date().toLocaleDateString()}</p>
        </div>
        <span className={`px-4 py-2 rounded-full font-bold text-sm uppercase tracking-wide ${riskColor}`}>
          {result.riskLevel} Risk
        </span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="md:col-span-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center relative overflowbg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent pointer-events-none" />
          <h3 className="text-gray-500 font-medium mb-4 z-10">Overall Score</h3>
          <div className="relative w-48 h-48 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[{ value: result.score }, { value: 100 - result.score }]}
                    innerRadius={70}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={result.score >= 80 ? '#10b981' : result.score >= 50 ? '#f59e0b' : '#ef4444'} />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${scoreColor}`}>{result.score}</span>
                <span className="text-sm text-gray-400">/100</span>
             </div>
          </div>
        </div>

        {/* Breakdown Charts */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
           {/* Income vs Expense */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
             <h3 className="text-gray-500 font-medium mb-4">Cash Flow</h3>
             <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={[
                   { name: 'In', amount: result.incomeTotal },
                   { name: 'Out', amount: result.totalExpenses },
                 ]} barSize={40}>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} />
                   <Tooltip 
                     formatter={(value: any) => `₹${Number(value).toLocaleString('en-IN')}`}
                     cursor={{ fill: 'transparent' }} 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                   />
                   <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                     {
                       [0, 1].map((_, index) => (
                         <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#ef4444'} />
                       ))
                     }
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </div>

           {/* Financial Distribution Pie */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-slate-700">
             <h3 className="text-gray-500 font-medium mb-4">Financial Ratios</h3>
             <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} itemStyle={{ color: '#333' }} />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
             </div>
           </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zinc-900 border border-yellow-500/20 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent pointer-events-none" />
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">AI Recommendations</h3>
          </div>
          <div className="space-y-4">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3 bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                <CheckCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-sm md:text-base text-gray-200 font-medium leading-relaxed">
                  {suggestion}
                </p>
              </div>
            ))}
            {result.suggestions.length === 0 && (
               <div className="flex items-start space-x-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-cyan-300" />
                <p className="text-violet-50">Great job! Your financial health looks solid. Keep monitoring your expenses.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 }}
           className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700"
        >
           <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">6-Month Roadmap</h3>
          </div>
          
          <div className="relative pl-8 border-l-2 border-yellow-500/20 space-y-8">
            {result.roadmap.map((step, index) => (
              <div key={index} className="relative">
                <span className="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-4 border-slate-900 bg-yellow-500 ring-4 ring-yellow-500/20" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider mb-1">
                    {step.month}
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 font-medium bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                    {step.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="flex justify-center pt-8 gap-4">
        <button 
          onClick={() => navigate('/check')}
          className="flex items-center space-x-2 text-yellow-500 hover:text-yellow-400 font-medium transition-colors px-6 py-3 rounded-lg hover:bg-yellow-500/10"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Start New Analysis</span>
        </button>

        <button 
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2 text-slate-900 bg-yellow-500 hover:bg-yellow-400 font-medium transition-colors px-6 py-3 rounded-lg shadow-lg shadow-yellow-500/20"
        >
          <Download className="w-5 h-5" />
          <span>Download Report</span>
        </button>
      </div>

      <AIChatBox financialData={data} financialResult={result} />
    </div>
  );
};

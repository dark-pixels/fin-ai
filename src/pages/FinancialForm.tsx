import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { calculateFinancialHealth } from '../utils/finance';
import type { FinancialData } from '../utils/finance';

const steps = [
  { id: 1, title: 'Income', description: 'What are your earnings?' },
  { id: 2, title: 'Expenses', description: 'Where does your money go?' },
  { id: 3, title: 'Loans', description: 'Do you have any debts?' },
  { id: 4, title: 'Savings', description: 'How much have you saved?' },
];

const initialData: FinancialData = {
  income: { monthly: 0, other: 0 },
  expenses: { rent: 0, food: 0, transport: 0, utilities: 0, entertainment: 0, others: 0 },
  loans: { emi: 0, outstanding: 0 },
  savings: { current: 0, emergencyFund: 0 },
};

export const FinancialForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FinancialData>(initialData);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      setDirection(1);
    } else {
      // Calculate and navigate
      const result = calculateFinancialHealth(data);
      navigate('/dashboard', { state: { result, data } });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setDirection(-1);
    }
  };

  const handleChange = (section: keyof FinancialData, field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: numValue
      }
    }));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((s) => (
            <div key={s.id} className={`flex flex-col items-center flex-1 ${s.id === step ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-2 transition-colors ${
                  s.id <= step 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'border-gray-300 bg-white dark:bg-slate-800'
                }`}
              >
                {s.id < step ? <CheckCircle2 className="w-5 h-5" /> : s.id}
              </div>
              <span className="text-xs hidden sm:block">{s.title}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-600"
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 min-h-[400px] relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{steps[step-1].title}</h2>
              <p className="text-gray-500 dark:text-gray-400">{steps[step-1].description}</p>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <InputGroup label="Monthly Income" value={data.income.monthly} onChange={(v) => handleChange('income', 'monthly', v)} />
                <InputGroup label="Other Income (Bonus, Freelance)" value={data.income.other} onChange={(v) => handleChange('income', 'other', v)} />
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputGroup label="Rent / Housing" value={data.expenses.rent} onChange={(v) => handleChange('expenses', 'rent', v)} />
                <InputGroup label="Food & Groceries" value={data.expenses.food} onChange={(v) => handleChange('expenses', 'food', v)} />
                <InputGroup label="Transport" value={data.expenses.transport} onChange={(v) => handleChange('expenses', 'transport', v)} />
                <InputGroup label="Utilities" value={data.expenses.utilities} onChange={(v) => handleChange('expenses', 'utilities', v)} />
                <InputGroup label="Entertainment" value={data.expenses.entertainment} onChange={(v) => handleChange('expenses', 'entertainment', v)} />
                <InputGroup label="Others" value={data.expenses.others} onChange={(v) => handleChange('expenses', 'others', v)} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <InputGroup label="Monthly EMI Amount" value={data.loans.emi} onChange={(v) => handleChange('loans', 'emi', v)} />
                <InputGroup label="Total Loan Outstanding" value={data.loans.outstanding} onChange={(v) => handleChange('loans', 'outstanding', v)} />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <InputGroup label="Current Savings" value={data.savings.current} onChange={(v) => handleChange('savings', 'current', v)} />
                <InputGroup label="Emergency Fund" value={data.savings.emergencyFund} onChange={(v) => handleChange('savings', 'emergencyFund', v)} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            step === 1 
              ? 'opacity-0 cursor-default' 
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'
          }`}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        
        <button
          onClick={handleNext}
          className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
        >
          {step === 4 ? 'See Results' : 'Next'}
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange }: { label: string, value: number, onChange: (val: string) => void }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" // Fixed placeholder
        placeholder="0.00"
      />
    </div>
  </div>
);

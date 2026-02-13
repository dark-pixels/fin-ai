export interface FinancialData {
  income: {
    monthly: number;
    other: number;
  };
  expenses: {
    rent: number;
    food: number;
    transport: number;
    utilities: number;
    entertainment: number;
    others: number;
  };
  loans: {
    emi: number;
    outstanding: number;
  };
  savings: {
    current: number;
    emergencyFund: number;
  };
}

export interface FinancialResult {
  score: number;
  riskLevel: 'Excellent' | 'Moderate' | 'High Risk';
  incomeTotal: number;
  totalExpenses: number;
  savingsRatio: number;
  debtRatio: number;
  expenseRatio: number;
  suggestions: string[];
  roadmap: { month: string; action: string }[];
}

export const calculateFinancialHealth = (data: FinancialData): FinancialResult => {
  const { income, expenses, loans, savings } = data;

  const incomeTotal = income.monthly + income.other;
  
  const totalExpenses =
    expenses.rent +
    expenses.food +
    expenses.transport +
    expenses.utilities +
    expenses.entertainment +
    expenses.others;

  // Avoid division by zero
  const safeIncome = incomeTotal === 0 ? 1 : incomeTotal;

  // Calculate Monthly Savings as Income - Expenses - EMI
  const monthlySavings = incomeTotal - totalExpenses - loans.emi;
  const savingsRatio = monthlySavings / safeIncome;
  
  const debtRatio = loans.emi / safeIncome;
  const expenseRatio = totalExpenses / safeIncome;

  let score = 0;

  // Scoring Logic
  if (savingsRatio > 0.30) score += 30;
  if (debtRatio < 0.20) score += 30;
  if (expenseRatio < 0.60) score += 20;

  // Emergency Fund Logic
  // Check if Emergency Fund > 6 * Monthly Expenses
  const monthlyNeeds = totalExpenses + loans.emi; // Expenses usually include Needs. EMI is obligation.
  const requiredEmergencyFund = monthlyNeeds * 6;
  if (savings.emergencyFund > requiredEmergencyFund) score += 20;

  // Normalize score to max 100?
  // 30 + 30 + 20 + 20 = 100.
  // What if ratios are intermediate? 
  // Prompt implies binary conditions. "If > 0.30 -> +30".
  // I might want to add partial scores for better UX, but rigorous prompt following says distinct actions.
  // Use generic logic for smoother score? Prompt says "Financial Score (0-100)".
  // I will stick to the logic provided but maybe add partial logic if it falls short, 
  // but strictly, the prompt was specific. I will implement exactly as requested first.
  
  // Actually, let's make it a bit more granular so users don't just get 0 or 30.
  // But the prompt was specific "If ... -> +30". It sounds like a rule based system.
  // I will stick to the rules for the core, maybe add base points or gradations if valid.
  // "If SavingsRatio > 0.30 -> +30".
  // I'll stick to exact logic.
  
  // Risk Level
  let riskLevel: 'Excellent' | 'Moderate' | 'High Risk' = 'High Risk';
  if (score >= 80) riskLevel = 'Excellent';
  else if (score >= 50) riskLevel = 'Moderate';

  // Suggestions
  const suggestions: string[] = [];
  if (savingsRatio < 0.30) {
    suggestions.push("Increase your savings rate by 10% monthly.");
  }
  if (savings.emergencyFund < monthlyNeeds * 6) {
    suggestions.push("Build emergency fund covering 6 months expenses.");
  }
  if (score >= 80) {
    suggestions.push("Start SIP investments for long-term wealth.");
  }
  if (debtRatio > 0.40) { // arbitrary threshold for advice
     suggestions.push("Consider consolidating high-interest loans.");
  }
  if (expenseRatio > 0.70) {
      suggestions.push("Review discretionary spending (Entertainment, Shopping).");
  }

  // Roadmap (Static generation based on rules)
  const roadmap = [
    { month: "Month 1", action: "Track spending & Reduce entertainment expenses" },
    { month: "Month 2", action: "Build emergency fund buffer" },
    { month: "Month 3", action: score >= 80 ? "Start SIP & Diversify" : "Clear high interest debt" },
    { month: "Month 4", action: "Increase savings by 5%" },
    { month: "Month 5", action: "Reduce EMI burden by prepaying if possible" },
    { month: "Month 6", action: "Review financial goals & Diversify investments" },
  ];

  return {
    score,
    riskLevel,
    incomeTotal,
    totalExpenses,
    savingsRatio,
    debtRatio,
    expenseRatio,
    suggestions,
    roadmap,
  };
};

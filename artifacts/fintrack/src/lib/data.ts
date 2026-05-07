export const INCOME_TYPES_DEFAULT = [
  "Salary", "LIC Pension", "Tour Allowance", "Balance Carried Forward",
  "Freelance Income", "Bonus / Incentive", "Rental Income", "Interest Income", "Other Income"
];

export const EXPENSE_CATEGORIES_DEFAULT = [
  "Home Loan EMI", "House Rent", "Savings (3 A/C)", "Car EMI (Gadi)",
  "Nipu Expenses", "Electricity Bill", "Grocery", "DTH / D2H", "Credit Card Bill",
  "Nexon Car Servicing", "Jio Recharge", "Abacus + Dance + Tuition Fees", "Scooty Maintenance",
  "Insurance Premium", "Bangalore House Maintenance", "Gym Membership", "Own Shop Expenses",
  "Nipu Course Fees", "Vodafone Bill", "Maid Salary", "School Van Fees", "Household Items / Misc"
];

export interface MasterItem { id: number; name: string; isSystem: boolean }

export function loadIncomeTypes(): MasterItem[] {
  try {
    const stored = localStorage.getItem('ft_income_types');
    if (stored) return JSON.parse(stored);
  } catch {}
  return INCOME_TYPES_DEFAULT.map((name, i) => ({ id: i, name, isSystem: true }));
}

export function saveIncomeTypes(items: MasterItem[]) {
  localStorage.setItem('ft_income_types', JSON.stringify(items));
}

export function loadExpenseCategories(): MasterItem[] {
  try {
    const stored = localStorage.getItem('ft_expense_categories');
    if (stored) return JSON.parse(stored);
  } catch {}
  return EXPENSE_CATEGORIES_DEFAULT.map((name, i) => ({ id: i, name, isSystem: true }));
}

export function saveExpenseCategories(items: MasterItem[]) {
  localStorage.setItem('ft_expense_categories', JSON.stringify(items));
}

export interface IncomeItem { type: string; amount: number }
export interface ExpenseItem { category: string; description: string; amount: number }
export interface MonthlyEntry {
  month: number;
  year: number;
  incomeItems: IncomeItem[];
  expenseItems: ExpenseItem[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
}

function seedEntries(): MonthlyEntry[] {
  return [
    {
      month: 1, year: 2025,
      incomeItems: [{ type: "Salary", amount: 80000 }, { type: "Freelance Income", amount: 15000 }],
      expenseItems: [
        { category: "Home Loan EMI", description: "HDFC", amount: 18000 },
        { category: "Grocery", description: "", amount: 8000 },
        { category: "Electricity Bill", description: "", amount: 2800 },
        { category: "Insurance Premium", description: "LIC", amount: 8000 },
        { category: "School Van Fees", description: "", amount: 3000 },
        { category: "Household Items / Misc", description: "", amount: 4200 },
        { category: "Gym Membership", description: "", amount: 1500 },
        { category: "Jio Recharge", description: "", amount: 500 },
        { category: "Abacus + Dance + Tuition Fees", description: "", amount: 8300 },
        { category: "Credit Card Bill", description: "", amount: 17700 },
      ],
      totalIncome: 95000, totalExpense: 72000, balance: 23000, savingsRate: 24.2
    },
    {
      month: 2, year: 2025,
      incomeItems: [{ type: "Salary", amount: 80000 }, { type: "Bonus / Incentive", amount: 18500 }],
      expenseItems: [
        { category: "Home Loan EMI", description: "HDFC", amount: 18000 },
        { category: "Grocery", description: "", amount: 7500 },
        { category: "Electricity Bill", description: "", amount: 2200 },
        { category: "Insurance Premium", description: "LIC", amount: 8000 },
        { category: "School Van Fees", description: "", amount: 3000 },
        { category: "Household Items / Misc", description: "", amount: 3800 },
        { category: "Gym Membership", description: "", amount: 1500 },
        { category: "Jio Recharge", description: "", amount: 1200 },
        { category: "Abacus + Dance + Tuition Fees", description: "", amount: 8300 },
        { category: "DTH / D2H", description: "", amount: 500 },
        { category: "Scooty Maintenance", description: "", amount: 14000 },
      ],
      totalIncome: 98500, totalExpense: 68000, balance: 30500, savingsRate: 30.96
    },
    {
      month: 3, year: 2025,
      incomeItems: [{ type: "Salary", amount: 80000 }, { type: "Freelance Income", amount: 15000 }],
      expenseItems: [
        { category: "Home Loan EMI", description: "HDFC Home Loan", amount: 18000 },
        { category: "Grocery", description: "Monthly groceries", amount: 8000 },
        { category: "Electricity Bill", description: "", amount: 2500 },
        { category: "Jio Recharge", description: "", amount: 1200 },
        { category: "Gym Membership", description: "", amount: 1500 },
        { category: "School Van Fees", description: "", amount: 3000 },
        { category: "Household Items / Misc", description: "", amount: 4500 },
        { category: "Insurance Premium", description: "LIC", amount: 8000 },
        { category: "Abacus + Dance + Tuition Fees", description: "", amount: 8300 },
      ],
      totalIncome: 95000, totalExpense: 55000, balance: 40000, savingsRate: 42.1
    }
  ];
}

export function loadEntries(): MonthlyEntry[] {
  try {
    const stored = localStorage.getItem('ft_entries');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const seed = seedEntries();
  localStorage.setItem('ft_entries', JSON.stringify(seed));
  return seed;
}

export function saveEntries(entries: MonthlyEntry[]) {
  localStorage.setItem('ft_entries', JSON.stringify(entries));
}

export function computeEntry(
  month: number, year: number,
  incomeItems: IncomeItem[], expenseItems: ExpenseItem[]
): MonthlyEntry {
  const totalIncome = incomeItems.reduce((s, r) => s + r.amount, 0);
  const totalExpense = expenseItems.reduce((s, r) => s + r.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  return { month, year, incomeItems, expenseItems, totalIncome, totalExpense, balance, savingsRate };
}

export interface InvestmentSuggestion {
  tier: number;
  label: string;
  color: string;
  bgColor: string;
  heading: string;
  points: string[];
  allocation: Record<string, number> | null;
}

export function getInvestmentSuggestion(balance: number): InvestmentSuggestion {
  if (balance < 0) return {
    tier: 1, label: "Deficit Month", color: "#EF4444", bgColor: "#FEE2E2",
    heading: "Expenses Exceed Income This Month",
    points: [
      "Review and reduce DTH/D2H and Gym subscriptions",
      "Pause credit card spending; clear outstanding balance first",
      "Check if any loan EMI restructuring is possible",
      "Set a strict grocery and household budget for next month",
      "Target: bring balance to at least ₹0 next month"
    ],
    allocation: null
  };
  if (balance <= 5000) return {
    tier: 2, label: "Low Savings", color: "#F59E0B", bgColor: "#FEF3C7",
    heading: "Small Balance — Build the Habit",
    points: [
      "Open or top-up a Recurring Deposit (RD) with this amount",
      "Add to your emergency fund (target: 3–6 months of expenses)",
      "Even ₹1,000/month in RD over 3 years = ₹36,000+ with interest",
      "Avoid impulse purchases next month to grow this surplus"
    ],
    allocation: { "Recurring Deposit": 60, "Emergency Fund": 40 }
  };
  if (balance <= 15000) return {
    tier: 3, label: "Moderate Savings", color: "#0D9488", bgColor: "#CCFBF1",
    heading: "Good Discipline — Start Investing",
    points: [
      "50% to Liquid Mutual Fund (e.g. SBI Liquid Fund, Parag Parikh)",
      "30% to PPF or NPS contribution (tax-saving + long-term)",
      "20% to Emergency savings account",
      "Tip: Set up an automatic SIP on salary day"
    ],
    allocation: { "Liquid Mutual Fund": 50, "PPF / NPS": 30, "Emergency Fund": 20 }
  };
  if (balance <= 40000) return {
    tier: 4, label: "Strong Savings", color: "#1A4FBA", bgColor: "#EBF3FF",
    heading: "Strong Savings — Diversify Now",
    points: [
      "40% to Equity mutual funds (Nifty 50 index fund)",
      "30% to PPF / NPS",
      "20% to Recurring Deposit",
      "10% to Gold ETF or Digital Gold (Sovereign Gold Bond)",
      "Tip: Review portfolio quarterly"
    ],
    allocation: { "Equity Mutual Funds": 40, "PPF / NPS": 30, "Recurring Deposit": 20, "Gold ETF": 10 }
  };
  return {
    tier: 5, label: "Excellent Savings", color: "#10B981", bgColor: "#D1FAE5",
    heading: "Excellent! Maximize Your Wealth",
    points: [
      "50% to Equity: mix of large-cap + mid-cap index funds",
      "20% to Debt mutual funds for stability",
      "15% to PPF / NPS (maximize 80C + 80CCD benefits)",
      "10% to Gold ETF or Sovereign Gold Bond",
      "5% to High-yield Fixed Deposit (1-year tenure)",
      "Tip: Increase SIP by 10% every year (step-up SIP)"
    ],
    allocation: { "Equity Funds": 50, "Debt Funds": 20, "PPF / NPS": 15, "Gold ETF": 10, "Fixed Deposit": 5 }
  };
}

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export const fmt = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export const PIE_COLORS = ['#1A4FBA','#0EA5E9','#10B981','#F59E0B','#7C3AED','#EF4444'];

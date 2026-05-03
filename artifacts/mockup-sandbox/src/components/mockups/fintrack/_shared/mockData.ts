export const MOCK_USER = { name: "Ravi Shankar", employeeId: "EMP001", role: "EMPLOYEE" };

export const INCOME_TYPES = ["Salary", "LIC Pension", "Tour Allowance", "Balance Carried Forward",
  "Freelance Income", "Bonus / Incentive", "Rental Income", "Interest Income", "Other Income"];

export const EXPENSE_CATEGORIES = ["Home Loan EMI", "House Rent", "Savings (3 A/C)", "Car EMI (Gadi)",
  "Nipu Expenses", "Electricity Bill", "Grocery", "DTH / D2H", "Credit Card Bill",
  "Nexon Car Servicing", "Jio Recharge", "Abacus + Dance + Tuition Fees", "Scooty Maintenance",
  "Insurance Premium", "Bangalore House Maintenance", "Gym Membership", "Own Shop Expenses",
  "Nipu Course Fees", "Vodafone Bill", "Maid Salary", "School Van Fees", "Household Items / Misc"];

export const MONTHLY_DATA = [
  { month: "February", year: 2025, totalIncome: 95000, totalExpense: 72000, balance: 23000, savingsRate: 24.2 },
  { month: "March", year: 2025, totalIncome: 98500, totalExpense: 68000, balance: 30500, savingsRate: 30.96 },
  { month: "April", year: 2025, totalIncome: 95000, totalExpense: 55000, balance: 40000, savingsRate: 42.1 },
];

export const CURRENT_MONTH_ENTRY = {
  month: "April", year: 2025,
  incomeItems: [
    { type: "Salary", amount: 80000 },
    { type: "Freelance Income", amount: 15000 },
  ],
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
};

export function getInvestmentSuggestion(balance: number) {
  if (balance < 0) return { tier: 1, label: "Deficit Month", color: "#EF4444", bgColor: "#FEE2E2",
    heading: "Expenses Exceed Income This Month",
    points: ["Review and reduce DTH/D2H and Gym subscriptions","Pause credit card spending; clear outstanding balance first","Check if any loan EMI restructuring is possible","Set a strict grocery and household budget for next month","Target: bring balance to at least ₹0 next month"],
    allocation: null };
  if (balance <= 5000) return { tier: 2, label: "Low Savings", color: "#F59E0B", bgColor: "#FEF3C7",
    heading: "Small Balance — Build the Habit",
    points: ["Open or top-up a Recurring Deposit (RD) with this amount","Add to your emergency fund (target: 3–6 months of expenses)","Even ₹1,000/month in RD over 3 years = ₹36,000+ with interest","Avoid impulse purchases next month to grow this surplus"],
    allocation: { "Recurring Deposit": 60, "Emergency Fund": 40 } };
  if (balance <= 15000) return { tier: 3, label: "Moderate Savings", color: "#0D9488", bgColor: "#CCFBF1",
    heading: "Good Discipline — Start Investing",
    points: ["50% to Liquid Mutual Fund (e.g. SBI Liquid Fund, Parag Parikh)","30% to PPF or NPS contribution (tax-saving + long-term)","20% to Emergency savings account","Tip: Set up an automatic SIP on salary day"],
    allocation: { "Liquid Mutual Fund": 50, "PPF / NPS": 30, "Emergency Fund": 20 } };
  if (balance <= 40000) return { tier: 4, label: "Strong Savings", color: "#1A4FBA", bgColor: "#EBF3FF",
    heading: "Strong Savings — Diversify Now",
    points: ["40% to Equity mutual funds (Nifty 50 index fund)","30% to PPF / NPS","20% to Recurring Deposit","10% to Gold ETF or Digital Gold (Sovereign Gold Bond)","Tip: Review portfolio quarterly"],
    allocation: { "Equity Mutual Funds": 40, "PPF / NPS": 30, "Recurring Deposit": 20, "Gold ETF": 10 } };
  return { tier: 5, label: "Excellent Savings", color: "#10B981", bgColor: "#D1FAE5",
    heading: "Excellent! Maximize Your Wealth",
    points: ["50% to Equity: mix of large-cap + mid-cap index funds","20% to Debt mutual funds for stability","15% to PPF / NPS (maximize 80C + 80CCD benefits)","10% to Gold ETF or Sovereign Gold Bond","5% to High-yield Fixed Deposit (1-year tenure)","Tip: Increase SIP by 10% every year (step-up SIP)"],
    allocation: { "Equity Funds": 50, "Debt Funds": 20, "PPF / NPS": 15, "Gold ETF": 10, "Fixed Deposit": 5 } };
}
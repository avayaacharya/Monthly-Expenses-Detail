import React, { useState } from 'react';
import './_shared/_group.css';
import { MOCK_USER, INCOME_TYPES, EXPENSE_CATEGORIES, CURRENT_MONTH_ENTRY, getInvestmentSuggestion } from './_shared/mockData';
import { AppLayout } from './_shared/AppLayout';
import { Plus, X, ChevronRight, ChevronLeft, Check, Save, Lightbulb } from 'lucide-react';

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

interface IncomeRow { id: number; type: string; amount: string }
interface ExpenseRow { id: number; category: string; description: string; amount: string }

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEARS = [2023, 2024, 2025, 2026, 2027];

export function MonthlyEntry() {
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [month, setMonth] = useState(3); // April (0-indexed)
  const [year, setYear] = useState(2025);
  const [saved, setSaved] = useState(false);
  const [incomeRows, setIncomeRows] = useState<IncomeRow[]>(
    CURRENT_MONTH_ENTRY.incomeItems.map((r, i) => ({ id: i, type: r.type, amount: String(r.amount) }))
  );
  const [expenseRows, setExpenseRows] = useState<ExpenseRow[]>(
    CURRENT_MONTH_ENTRY.expenseItems.map((r, i) => ({ id: i, category: r.category, description: r.description, amount: String(r.amount) }))
  );

  const totalIncome = incomeRows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const totalExpense = expenseRows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  const suggestion = getInvestmentSuggestion(balance);

  const addIncome = () => setIncomeRows(r => [...r, { id: Date.now(), type: INCOME_TYPES[0], amount: '' }]);
  const removeIncome = (id: number) => setIncomeRows(r => r.filter(x => x.id !== id));
  const updateIncome = (id: number, field: keyof IncomeRow, val: string) => setIncomeRows(r => r.map(x => x.id === id ? { ...x, [field]: val } : x));

  const addExpense = () => setExpenseRows(r => [...r, { id: Date.now(), category: EXPENSE_CATEGORIES[0], description: '', amount: '' }]);
  const removeExpense = (id: number) => setExpenseRows(r => r.filter(x => x.id !== id));
  const updateExpense = (id: number, field: keyof ExpenseRow, val: string) => setExpenseRows(r => r.map(x => x.id === id ? { ...x, [field]: val } : x));

  const handleSave = () => { setSaved(true); setTimeout(() => setNavTarget('dashboard'), 1500); };

  if (navTarget) {
    const labels: Record<string, string> = { dashboard: 'Dashboard', suggestions: 'Investment Suggestions', masters: 'Masters', entry: 'Entry', reports: 'Reports', login: 'Logout' };
    return (
      <div style={{ minHeight: '100vh', background: '#F5F8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 64px', textAlign: 'center', boxShadow: '0 4px 24px rgba(26,79,186,0.1)', maxWidth: 420, border: '1px solid #D1E3FF' }}>
          {saved ? (
            <>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Check size={32} color="#10B981" />
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#0F1E3C', marginBottom: 10 }}>Entry Saved Successfully!</h2>
              <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>Redirecting to your dashboard...</p>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#0F1E3C', marginBottom: 10 }}>Navigated to {labels[navTarget] || navTarget}</h2>
              <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>In the full app, this would take you there.</p>
            </>
          )}
          <button onClick={() => { setNavTarget(null); setSaved(false); }} style={{ background: '#1A4FBA', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Back to Entry</button>
        </div>
      </div>
    );
  }

  const stepLabels = ['Select Period', 'Income', 'Expenses', 'Review & Submit'];
  const inputStyle: React.CSSProperties = { padding: '8px 12px', border: '1.5px solid #D1E3FF', borderRadius: 8, fontSize: 14, fontFamily: "'Inter', sans-serif", color: '#0F1E3C', background: '#fff', outline: 'none' };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };

  return (
    <AppLayout currentPage="entry" onNavigate={setNavTarget} user={MOCK_USER}>
      <div style={{ animation: 'fadeSlideIn 0.3s ease', maxWidth: 900, margin: '0 auto' }}>
        <style>{`@keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }`}</style>

        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: '#0F1E3C', marginBottom: 6 }}>Monthly Income & Expense Entry</h1>
          <p style={{ color: '#64748B', fontSize: 14 }}>Enter your financial data step by step</p>
        </div>

        {/* Progress bar */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', marginBottom: 28, border: '1px solid #D1E3FF', boxShadow: '0 2px 8px rgba(26,79,186,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            {stepLabels.map((label, i) => {
              const idx = i + 1;
              const isActive = step === idx;
              const isDone = step > idx;
              const canClick = isDone || idx === step;
              return (
                <React.Fragment key={label}>
                  <div onClick={() => canClick && setStep(idx)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: canClick ? 'pointer' : 'default', flex: 1 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: isActive ? '#1A4FBA' : isDone ? '#10B981' : '#E8F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive || isDone ? '#fff' : '#94A3B8', fontWeight: 700, fontSize: 15, transition: 'all 0.2s' }}>
                      {isDone ? <Check size={18} /> : idx}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? '#1A4FBA' : isDone ? '#10B981' : '#94A3B8', whiteSpace: 'nowrap' }}>{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: step > i + 1 ? '#10B981' : '#E8F0FF', margin: '0 4px', marginBottom: 24, transition: 'background 0.3s' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)' }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#0F1E3C', marginBottom: 24 }}>Select Month & Year</h2>
            <div style={{ display: 'flex', gap: 20, marginBottom: 24, maxWidth: 500 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F1E3C', marginBottom: 8 }}>Month</label>
                <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ ...selectStyle, width: '100%' }}>
                  {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F1E3C', marginBottom: 8 }}>Year</label>
                <select value={year} onChange={e => setYear(Number(e.target.value))} style={{ ...selectStyle, width: '100%' }}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            {month === 3 && year === 2025 && (
              <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#92400E' }}>
                <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>!</div>
                You have an existing entry for this month. Continuing will update it.
              </div>
            )}
            <button onClick={() => setStep(2)} style={{ background: 'linear-gradient(90deg, #1A4FBA, #2A7BDE)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 15, fontWeight: 600, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(26,79,186,0.2)' }}>
              Continue <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#0F1E3C', marginBottom: 4 }}>Enter Income for {MONTHS[month]} {year}</h2>
                <button onClick={() => setNavTarget('masters')} style={{ background: 'none', border: 'none', color: '#1A4FBA', fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Manage Income Types</button>
              </div>
              <div style={{ background: '#EBF3FF', borderRadius: 12, padding: '12px 20px', textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>Total Income</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: '#1A4FBA' }}>{fmt(totalIncome)}</div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F5F8FF' }}>
                    {['#', 'Income Type', 'Amount (₹)', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748B', borderBottom: '1px solid #D1E3FF' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {incomeRows.map((row, i) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #F1F5FF' }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#94A3B8', width: 40 }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <select value={row.type} onChange={e => updateIncome(row.id, 'type', e.target.value)} style={{ ...selectStyle, width: '100%', minWidth: 200 }}>
                          {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <input type="number" value={row.amount} onChange={e => updateIncome(row.id, 'amount', e.target.value)} placeholder="0" style={{ ...inputStyle, width: 120, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }} />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button onClick={() => removeIncome(row.id)} style={{ width: 28, height: 28, borderRadius: '50%', background: '#FEE2E2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addIncome} style={{ marginTop: 16, background: 'none', border: '1.5px dashed #D1E3FF', borderRadius: 10, padding: '10px 20px', color: '#1A4FBA', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> Add Income Source
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 24, borderTop: '1px solid #EBF3FF' }}>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: '1.5px solid #D1E3FF', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><ChevronLeft size={16} /> Back</button>
              <button onClick={() => setStep(3)} style={{ background: 'linear-gradient(90deg, #1A4FBA, #2A7BDE)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(26,79,186,0.2)' }}>Next: Add Expenses <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#0F1E3C', marginBottom: 4 }}>Enter Expenses for {MONTHS[month]} {year}</h2>
                <button onClick={() => setNavTarget('masters')} style={{ background: 'none', border: 'none', color: '#1A4FBA', fontSize: 12, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Manage Expense Categories</button>
              </div>
              <div style={{ background: '#FEF3C7', borderRadius: 12, padding: '12px 20px', textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: '#92400E', marginBottom: 2 }}>Total Expenses</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: '#F59E0B' }}>{fmt(totalExpense)}</div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F5F8FF' }}>
                    {['#', 'Category', 'Description', 'Amount (₹)', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748B', borderBottom: '1px solid #D1E3FF' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expenseRows.map((row, i) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #F1F5FF' }}>
                      <td style={{ padding: '10px 16px', fontSize: 13, color: '#94A3B8', width: 40 }}>{i + 1}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <select value={row.category} onChange={e => updateExpense(row.id, 'category', e.target.value)} style={{ ...selectStyle, width: '100%', minWidth: 180 }}>
                          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <input type="text" value={row.description} onChange={e => updateExpense(row.id, 'description', e.target.value)} placeholder="Optional" style={{ ...inputStyle, width: 140 }} />
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <input type="number" value={row.amount} onChange={e => updateExpense(row.id, 'amount', e.target.value)} placeholder="0" style={{ ...inputStyle, width: 100, textAlign: 'right' }} />
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <button onClick={() => removeExpense(row.id)} style={{ width: 28, height: 28, borderRadius: '50%', background: '#FEE2E2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addExpense} style={{ marginTop: 16, background: 'none', border: '1.5px dashed #D1E3FF', borderRadius: 10, padding: '10px 20px', color: '#1A4FBA', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Plus size={16} /> Add Expense
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 24, borderTop: '1px solid #EBF3FF' }}>
              <button onClick={() => setStep(2)} style={{ background: 'none', border: '1.5px solid #D1E3FF', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><ChevronLeft size={16} /> Back</button>
              <button onClick={() => setStep(4)} style={{ background: 'linear-gradient(90deg, #1A4FBA, #2A7BDE)', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(26,79,186,0.2)' }}>Next: Review <ChevronRight size={16} /></button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Income summary */}
              <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)' }}>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#0F1E3C', marginBottom: 16 }}>Income Summary</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead><tr style={{ background: '#F5F8FF' }}><th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #D1E3FF' }}>Type</th><th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #D1E3FF' }}>Amount</th></tr></thead>
                  <tbody>
                    {incomeRows.map(r => <tr key={r.id} style={{ borderBottom: '1px solid #F1F5FF' }}><td style={{ padding: '10px 12px', color: '#0F1E3C' }}>{r.type}</td><td style={{ padding: '10px 12px', textAlign: 'right', color: '#1A4FBA', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(parseFloat(r.amount) || 0)}</td></tr>)}
                  </tbody>
                  <tfoot><tr style={{ background: '#EBF3FF' }}><td style={{ padding: '10px 12px', fontWeight: 700, color: '#0F1E3C' }}>Total</td><td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#1A4FBA', fontSize: 15 }}>{fmt(totalIncome)}</td></tr></tfoot>
                </table>
              </div>
              {/* Expense summary */}
              <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)' }}>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#0F1E3C', marginBottom: 16 }}>Expense Summary</h3>
                <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead><tr style={{ background: '#F5F8FF' }}><th style={{ padding: '8px 12px', textAlign: 'left', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #D1E3FF' }}>Category</th><th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #D1E3FF' }}>Amount</th></tr></thead>
                    <tbody>
                      {expenseRows.map(r => <tr key={r.id} style={{ borderBottom: '1px solid #F1F5FF' }}><td style={{ padding: '10px 12px', color: '#0F1E3C' }}>{r.category}</td><td style={{ padding: '10px 12px', textAlign: 'right', color: '#F59E0B', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(parseFloat(r.amount) || 0)}</td></tr>)}
                    </tbody>
                    <tfoot><tr style={{ background: '#FEF3C7' }}><td style={{ padding: '10px 12px', fontWeight: 700, color: '#0F1E3C' }}>Total</td><td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#F59E0B', fontSize: 15 }}>{fmt(totalExpense)}</td></tr></tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Balance box */}
            <div style={{ background: 'linear-gradient(135deg, #0F1E3C, #1A4FBA)', borderRadius: 20, padding: 32, color: '#fff', boxShadow: '0 8px 32px rgba(26,79,186,0.2)' }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Balance Summary — {MONTHS[month]} {year}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                {[
                  { label: 'Total Income', value: fmt(totalIncome), color: '#0EA5E9' },
                  { label: 'Total Expenses', value: fmt(totalExpense), color: '#F59E0B' },
                  { label: 'Net Balance', value: fmt(balance), color: balance >= 0 ? '#10B981' : '#EF4444' },
                  { label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, color: '#38BDF8' },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: '20px 16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>{s.label}</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestion preview */}
            <div style={{ background: suggestion.bgColor, border: `1px solid ${suggestion.color}40`, borderRadius: 20, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: suggestion.bgColor, border: `1px solid ${suggestion.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lightbulb size={22} color={suggestion.color} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#0F1E3C', marginBottom: 4 }}>{suggestion.heading}</div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>{suggestion.points[0]}</div>
                </div>
              </div>
              <button onClick={() => setNavTarget('suggestions')} style={{ background: 'none', border: 'none', color: suggestion.color, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                See full suggestion <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#1A4FBA', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>Edit Income</button>
                <button onClick={() => setStep(3)} style={{ background: 'none', border: 'none', color: '#1A4FBA', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>Edit Expenses</button>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button onClick={() => setStep(3)} style={{ background: 'none', border: '1.5px solid #D1E3FF', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><ChevronLeft size={16} /> Back</button>
                <button onClick={handleSave} style={{ background: 'linear-gradient(90deg, #10B981, #059669)', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontSize: 15, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 16px rgba(16,185,129,0.3)' }}>
                  <Save size={18} /> Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

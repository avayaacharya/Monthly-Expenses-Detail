import { useState } from "react";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { ArrowLeft, Download, Plus, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { loadEntries, getInvestmentSuggestion, fmt, MONTHS } from "@/lib/data";

export default function ReportsPage() {
  const [, setLocation] = useLocation();
  const entries = loadEntries();
  const [selectedIdx, setSelectedIdx] = useState(entries.length - 1);

  const selectedEntry = entries[selectedIdx];

  const trendData = entries.map(m => ({
    month: MONTHS[m.month].slice(0, 3),
    Income: m.totalIncome,
    Expenses: m.totalExpense,
    Balance: m.balance,
  }));

  const expenseBreakdown = selectedEntry
    ? [...selectedEntry.expenseItems]
        .sort((a, b) => b.amount - a.amount)
        .map((e, i) => ({ category: e.category.slice(0, 24) + (e.category.length > 24 ? "…" : ""), amount: e.amount, top: i < 3 }))
    : [];

  return (
    <AppLayout>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>
              <span style={{ cursor: "pointer", color: "#1A4FBA" }} onClick={() => setLocation("/dashboard")}>Dashboard</span>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#0F1E3C" }}>Financial Reports</span>
            </div>
            <h1 className="font-heading" style={{ fontSize: 26, fontWeight: 800, color: "#0F1E3C", marginBottom: 6 }}>Financial Reports</h1>
            <p style={{ color: "#64748B", fontSize: 14 }}>Track your income, expenses, and savings over time</p>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            {entries.length > 0 && (
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>Selected Month</label>
                <select data-testid="select-reports-month" value={selectedIdx} onChange={e => setSelectedIdx(Number(e.target.value))}
                  style={{ padding: "10px 16px", border: "1.5px solid #D1E3FF", borderRadius: 10, fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#0F1E3C", background: "#fff", outline: "none", cursor: "pointer" }}>
                  {[...entries].reverse().map((e, i) => (
                    <option key={i} value={entries.length - 1 - i}>{MONTHS[e.month]} {e.year}</option>
                  ))}
                </select>
              </div>
            )}
            <button data-testid="btn-download-pdf" onClick={() => window.print()}
              style={{ background: "#1A4FBA", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>

        {selectedEntry ? (
          <>
            <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
              {[
                { title: "Total Income", value: fmt(selectedEntry.totalIncome), color: "#1A4FBA", testId: "report-income" },
                { title: "Total Expenses", value: fmt(selectedEntry.totalExpense), color: "#F59E0B", testId: "report-expenses" },
                { title: "Net Balance", value: fmt(selectedEntry.balance), color: "#10B981", testId: "report-balance" },
                { title: "Savings Rate", value: `${selectedEntry.savingsRate.toFixed(1)}%`, color: "#0D9488", testId: "report-savings-rate" },
              ].map(k => (
                <div key={k.title} data-testid={k.testId} style={{ flex: 1, minWidth: 140, background: "#fff", borderRadius: 16, padding: "20px 20px", border: "1px solid #D1E3FF", boxShadow: "0 4px 12px rgba(26,79,186,0.05)", transition: "transform 0.2s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = "none"}>
                  <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>{k.title}</div>
                  <div className="font-heading" style={{ fontSize: 24, fontWeight: 800, color: k.color, fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, marginBottom: 24 }}>
              <style>{`@media(max-width:800px){.reports-grid{grid-template-columns:1fr!important}}`}</style>
              <div className="reports-grid" style={{ display: "contents" }}>
                <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid #D1E3FF", boxShadow: "0 4px 16px rgba(26,79,186,0.06)" }}>
                  <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: "#0F1E3C", marginBottom: 20 }}>Income vs Expenses — All Months</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EBF3FF" />
                      <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 13 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                      <Tooltip formatter={(v: number) => [fmt(v)]} contentStyle={{ borderRadius: 12, border: "1px solid #D1E3FF", fontFamily: "'Inter', sans-serif" }} />
                      <Legend iconType="circle" iconSize={10} />
                      <Bar dataKey="Income" fill="#1A4FBA" radius={[6, 6, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="Expenses" fill="#F59E0B" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #D1E3FF", boxShadow: "0 4px 16px rgba(26,79,186,0.06)" }}>
                  <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: "#0F1E3C", marginBottom: 16 }}>Suggestion Summary</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[...entries].reverse().map((m, i) => {
                      const s = getInvestmentSuggestion(m.balance);
                      return (
                        <div key={i} style={{ background: s.bgColor, borderRadius: 14, padding: "14px 16px", border: `1px solid ${s.color}20` }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F1E3C" }}>{MONTHS[m.month]} {m.year}</span>
                            <span style={{ background: s.color, color: "#fff", borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{s.label}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: "#64748B" }}>Balance: <strong style={{ color: s.color }}>{fmt(m.balance)}</strong></span>
                            <button onClick={() => setLocation("/suggestions")} style={{ background: "none", border: "none", color: s.color, fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                              See advice <ChevronRight size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {expenseBreakdown.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid #D1E3FF", boxShadow: "0 4px 16px rgba(26,79,186,0.06)", marginBottom: 24 }}>
                <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: "#0F1E3C", marginBottom: 4 }}>
                  Expense Breakdown — {MONTHS[selectedEntry.month]} {selectedEntry.year}
                </h3>
                <p style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>Top 3 expenses highlighted. Sorted highest to lowest.</p>
                <ResponsiveContainer width="100%" height={Math.max(200, expenseBreakdown.length * 36)}>
                  <BarChart data={expenseBreakdown} layout="vertical" margin={{ left: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EBF3FF" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                    <YAxis dataKey="category" type="category" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} width={170} />
                    <Tooltip formatter={(v: number) => [fmt(v), "Amount"]} contentStyle={{ borderRadius: 12, border: "1px solid #D1E3FF", fontFamily: "'Inter', sans-serif" }} />
                    <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={22} fill="#1A4FBA">
                      {expenseBreakdown.map((e, i) => (
                        <Cell key={i} fill={e.top ? (i === 0 ? "#EF4444" : i === 1 ? "#F59E0B" : "#F97316") : "#1A4FBA"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid #D1E3FF", boxShadow: "0 4px 16px rgba(26,79,186,0.06)", marginBottom: 24 }}>
              <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: "#0F1E3C", marginBottom: 20 }}>Full Month History</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#F5F8FF" }}>
                      {["Month", "Total Income", "Total Expenses", "Balance", "Savings %"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748B", borderBottom: "1px solid #D1E3FF", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[...entries].reverse().map((m, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #F1F5FF", transition: "background 0.15s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#F5F8FF"}
                        onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "#fff"}>
                        <td style={{ padding: "14px 16px", fontWeight: 600, color: "#0F1E3C" }}>{MONTHS[m.month]} {m.year}</td>
                        <td style={{ padding: "14px 16px", color: "#1A4FBA", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(m.totalIncome)}</td>
                        <td style={{ padding: "14px 16px", color: "#F59E0B", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(m.totalExpense)}</td>
                        <td style={{ padding: "14px 16px", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: m.balance >= 0 ? "#10B981" : "#EF4444" }}>{fmt(m.balance)}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ background: m.savingsRate > 30 ? "#D1FAE5" : "#FEF3C7", color: m.savingsRate > 30 ? "#10B981" : "#F59E0B", borderRadius: 999, padding: "3px 12px", fontSize: 13, fontWeight: 700 }}>{m.savingsRate.toFixed(1)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div style={{ background: "#fff", borderRadius: 20, padding: 48, textAlign: "center", border: "1px solid #D1E3FF" }}>
            <p style={{ color: "#64748B", marginBottom: 24 }}>No entries yet. Add your first monthly entry to see reports.</p>
            <button onClick={() => setLocation("/entry")} style={{ background: "linear-gradient(90deg, #1A4FBA, #2A7BDE)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Add Entry</button>
          </div>
        )}

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <button data-testid="btn-reports-back" onClick={() => setLocation("/dashboard")}
            style={{ background: "none", border: "1.5px solid #D1E3FF", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 600, color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <button data-testid="btn-add-missing-month" onClick={() => setLocation("/entry")}
            style={{ background: "none", border: "1.5px solid #D1E3FF", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 600, color: "#1A4FBA", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Plus size={16} /> Add Month Entry
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

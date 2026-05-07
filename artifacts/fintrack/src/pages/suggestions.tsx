import { useState } from "react";
import { useLocation } from "wouter";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowLeft, ChevronRight, AlertTriangle, CheckCircle } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { loadEntries, getInvestmentSuggestion, fmt, MONTHS, PIE_COLORS } from "@/lib/data";

export default function SuggestionsPage() {
  const [, setLocation] = useLocation();
  const entries = loadEntries();
  const [selectedIdx, setSelectedIdx] = useState(entries.length - 1);

  const entry = entries[selectedIdx];
  const suggestion = entry ? getInvestmentSuggestion(entry.balance) : getInvestmentSuggestion(0);

  const pieData = suggestion.allocation
    ? Object.entries(suggestion.allocation).map(([name, value]) => ({ name, value }))
    : [];

  const tierBadgeStyle: React.CSSProperties = {
    background: suggestion.bgColor,
    color: suggestion.color,
    borderRadius: 999,
    padding: "4px 14px",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    display: "inline-block",
  };

  return (
    <AppLayout>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 className="font-heading" style={{ fontSize: 26, fontWeight: 800, color: "#0F1E3C", marginBottom: 6 }}>Your Investment Suggestions</h1>
            {entry && (
              <p style={{ color: "#64748B", fontSize: 14 }}>
                Based on your <strong>{MONTHS[entry.month]} {entry.year}</strong> balance of{" "}
                <strong style={{ color: suggestion.color }}>{fmt(entry.balance)}</strong>
              </p>
            )}
          </div>
          {entries.length > 0 && (
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>View month</label>
              <select data-testid="select-suggestions-month" value={selectedIdx} onChange={e => setSelectedIdx(Number(e.target.value))}
                style={{ padding: "10px 16px", border: "1.5px solid #D1E3FF", borderRadius: 10, fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#0F1E3C", background: "#fff", outline: "none", cursor: "pointer" }}>
                {[...entries].reverse().map((e, i) => (
                  <option key={i} value={entries.length - 1 - i}>{MONTHS[e.month]} {e.year}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {entry && (
          <>
            <div style={{ background: `linear-gradient(135deg, ${suggestion.bgColor}, ${suggestion.bgColor}80)`, border: `1.5px solid ${suggestion.color}30`, borderRadius: 20, padding: "24px 32px", marginBottom: 24, display: "flex", alignItems: "center", gap: 20, boxShadow: `0 4px 20px ${suggestion.color}15`, flexWrap: "wrap" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: suggestion.bgColor, border: `2px solid ${suggestion.color}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 28 }}>
                  {suggestion.tier === 1 ? "⚠️" : suggestion.tier === 2 ? "💰" : suggestion.tier === 3 ? "📈" : suggestion.tier === 4 ? "🚀" : "🏆"}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={tierBadgeStyle}>{suggestion.label}</span>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Tier {suggestion.tier} of 5</span>
                </div>
                <div className="font-heading" style={{ fontSize: 20, fontWeight: 800, color: suggestion.color }}>{suggestion.heading}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>Monthly Balance</div>
                <div className="font-heading" data-testid="suggestion-balance" style={{ fontSize: 28, fontWeight: 800, color: suggestion.color, fontVariantNumeric: "tabular-nums" }}>{fmt(entry.balance)}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Savings Rate: <strong style={{ color: suggestion.color }}>{entry.savingsRate.toFixed(1)}%</strong></div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: suggestion.allocation ? "1fr 400px" : "1fr", gap: 24 }}>
              <style>{`@media(max-width:900px){.sugg-grid{grid-template-columns:1fr!important}}`}</style>
              <div className="sugg-grid" style={{ display: "contents" }}>
                <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #D1E3FF", boxShadow: "0 4px 16px rgba(26,79,186,0.06)" }}>
                  <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, color: "#0F1E3C", marginBottom: 24 }}>Recommended Action Plan</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {suggestion.points.map((point, i) => (
                      <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 20px", background: "#F5F8FF", borderRadius: 14, border: "1px solid #EBF3FF", transition: "transform 0.2s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = "translateX(4px)"}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = "none"}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: suggestion.bgColor, border: `1px solid ${suggestion.color}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <CheckCircle size={16} color={suggestion.color} />
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#0F1E3C", margin: 0 }}>{point}</p>
                      </div>
                    ))}
                  </div>

                  {suggestion.allocation && (
                    <div style={{ marginTop: 24, padding: "16px 20px", background: "linear-gradient(135deg, #EBF3FF, #D1E8FF)", borderRadius: 14, border: "1px solid #D1E3FF" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1A4FBA", marginBottom: 12 }}>Recommended Allocation for {fmt(entry.balance)}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {Object.entries(suggestion.allocation).map(([key, val], i) => (
                          <div key={key} style={{ background: "#fff", borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, border: "1px solid #D1E3FF" }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length], display: "inline-block" }} />
                            <span style={{ fontSize: 13, color: "#0F1E3C", fontWeight: 600 }}>{val}%</span>
                            <span style={{ fontSize: 13, color: "#64748B" }}>{key}</span>
                            <span style={{ fontSize: 12, color: "#1A4FBA", fontWeight: 600 }}>{fmt(entry.balance * val / 100)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {suggestion.allocation && (
                  <div style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #D1E3FF", boxShadow: "0 4px 16px rgba(26,79,186,0.06)" }}>
                    <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: "#0F1E3C", marginBottom: 20, textAlign: "center" }}>Allocation Breakdown</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" labelLine={false}>
                          {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ borderRadius: 10, border: "1px solid #D1E3FF", fontFamily: "'Inter', sans-serif", fontSize: 13 }} />
                        <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: 12, color: "#64748B" }}>{v}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                      {pieData.map((d, i) => (
                        <div key={d.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "#F5F8FF", borderRadius: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length], display: "inline-block" }} />
                            <span style={{ fontSize: 13, color: "#64748B" }}>{d.name}</span>
                          </div>
                          <div style={{ display: "flex", gap: 12 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#0F1E3C" }}>{d.value}%</span>
                            <span style={{ fontSize: 13, color: "#1A4FBA", fontVariantNumeric: "tabular-nums" }}>{fmt(entry.balance * d.value / 100)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 24, background: "#FEF3C7", border: "1px solid #F59E0B30", borderRadius: 16, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.7, margin: 0 }}>
                These suggestions are generated based on general financial planning principles and your reported balance amount. They are not personalized financial advice. Please consult a SEBI-registered certified financial advisor before making any investment decisions.
              </p>
            </div>
          </>
        )}

        {entries.length === 0 && (
          <div style={{ background: "#fff", borderRadius: 20, padding: 48, textAlign: "center", border: "1px solid #D1E3FF" }}>
            <p style={{ color: "#64748B", marginBottom: 24 }}>No entries yet. Add your first monthly entry to get investment suggestions.</p>
            <button onClick={() => setLocation("/entry")} style={{ background: "linear-gradient(90deg, #1A4FBA, #2A7BDE)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Add Entry</button>
          </div>
        )}

        <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
          <button data-testid="btn-back-to-dashboard" onClick={() => setLocation("/dashboard")}
            style={{ background: "none", border: "1.5px solid #D1E3FF", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 600, color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <button data-testid="btn-update-entry" onClick={() => setLocation("/entry")}
            style={{ background: "linear-gradient(90deg, #1A4FBA, #2A7BDE)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(26,79,186,0.2)" }}>
            Update This Month's Entry <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

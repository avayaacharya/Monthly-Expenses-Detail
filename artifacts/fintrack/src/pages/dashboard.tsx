import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { TrendingUp, TrendingDown, IndianRupee, Percent, ChevronRight, Plus, Lightbulb, BarChart2, Search, X, Calendar, DollarSign, ShoppingCart, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/lib/auth";
import { loadEntries, getInvestmentSuggestion, fmt, MONTHS, loadIncomeTypes, loadExpenseCategories } from "@/lib/data";

function useCountUp(target: number, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getDate() {
  return new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function KpiCard({ title, value, subtitle, color, bg, icon, testId }: { title: string; value: string; subtitle?: string; color: string; bg: string; icon: React.ReactNode; testId?: string }) {
  return (
    <div data-testid={testId} style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid #D1E3FF", boxShadow: "0 4px 16px rgba(26,79,186,0.06)", flex: 1, transition: "transform 0.2s, box-shadow 0.2s", cursor: "default", minWidth: 0 }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(26,79,186,0.12)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "none"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(26,79,186,0.06)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, color: "#64748B", fontWeight: 500, marginBottom: 10 }}>{title}</div>
          <div className="font-heading" style={{ fontSize: 26, fontWeight: 800, color, marginBottom: 4, letterSpacing: "-0.5px", fontVariantNumeric: "tabular-nums" }}>{value}</div>
          {subtitle && <div style={{ fontSize: 12, color: "#94A3B8" }}>{subtitle}</div>}
        </div>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>
      </div>
    </div>
  );
}

type SResult = { id: string; label: string; sub: string; category: string; icon: React.ReactNode; isAction?: boolean; entryIdx?: number };

const catColor: Record<string, string> = { Months: "#1A4FBA", "Income Types": "#10B981", "Expense Categories": "#F59E0B", "Quick Actions": "#7C3AED" };
const catBg: Record<string, string> = { Months: "#EBF3FF", "Income Types": "#D1FAE5", "Expense Categories": "#FEF3C7", "Quick Actions": "#EDE9FE" };

export default function DashboardPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const entries = loadEntries();
  const incomeTypes = loadIncomeTypes().map(i => i.name);
  const expenseCategories = loadExpenseCategories().map(i => i.name);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<string, { id: string; label: string; category: string; entryIdx?: number }>>({});

  const selectedMonthChips = Object.values(selectedItems).filter(s => s.category === "Months");
  const activeIndices = selectedMonthChips.length > 0
    ? selectedMonthChips.map(s => s.entryIdx!).sort((a, b) => a - b)
    : [entries.length - 1];

  const activeEntries = activeIndices.map(i => entries[i]).filter(Boolean);
  const aggIncome = activeEntries.reduce((s, m) => s + m.totalIncome, 0);
  const aggExpense = activeEntries.reduce((s, m) => s + m.totalExpense, 0);
  const aggBalance = aggIncome - aggExpense;
  const aggRate = activeEntries.length > 0 ? activeEntries.reduce((s, m) => s + m.savingsRate, 0) / activeEntries.length : 0;

  const suggestion = getInvestmentSuggestion(aggBalance / Math.max(activeEntries.length, 1));

  const animIncome = useCountUp(aggIncome);
  const animExpense = useCountUp(aggExpense);
  const animBalance = useCountUp(aggBalance);
  const animRate = useCountUp(Math.round(aggRate * 10));

  const chartData = entries.map(m => ({ month: MONTHS[m.month].slice(0, 3), balance: m.balance, income: m.totalIncome, expense: m.totalExpense }));

  const monthLabel = activeEntries.length > 1
    ? `${MONTHS[activeEntries[0].month]} – ${MONTHS[activeEntries[activeEntries.length-1].month]} ${activeEntries[0].year} (${activeEntries.length} months)`
    : activeEntries.length === 1 ? `${MONTHS[activeEntries[0].month]} ${activeEntries[0].year}` : "No data";

  const expensePct = aggIncome > 0 ? Math.round((aggExpense / aggIncome) * 100) : 0;
  const savingsLabel = aggRate >= 40 ? "Excellent!" : aggRate >= 25 ? "Good job!" : "Keep saving!";

  const q = searchQuery.trim().toLowerCase();
  const allResults: SResult[] = [
    ...entries.map((m, i) => ({ id: `month-${i}`, label: `${MONTHS[m.month]} ${m.year}`, sub: `Income ₹${(m.totalIncome/1000).toFixed(0)}K · Expenses ₹${(m.totalExpense/1000).toFixed(0)}K · Balance ₹${(m.balance/1000).toFixed(0)}K`, category: "Months", icon: <Calendar size={13} />, entryIdx: i })),
    ...incomeTypes.map((t, i) => ({ id: `inc-${i}`, label: t, sub: "Income type", category: "Income Types", icon: <DollarSign size={13} /> })),
    ...expenseCategories.map((c, i) => ({ id: `exp-${i}`, label: c, sub: "Expense category", category: "Expense Categories", icon: <ShoppingCart size={13} /> })),
    { id: "qa-entry", label: "Add / Edit Monthly Entry", sub: "Log income and expenses", category: "Quick Actions", icon: <Plus size={13} />, isAction: true },
    { id: "qa-reports", label: "View Reports", sub: "Charts and trends", category: "Quick Actions", icon: <BarChart2 size={13} />, isAction: true },
    { id: "qa-suggestions", label: "Investment Suggestions", sub: "Smart advice for your savings", category: "Quick Actions", icon: <Lightbulb size={13} />, isAction: true },
    { id: "qa-masters", label: "Manage Masters", sub: "Income types & expense categories", category: "Quick Actions", icon: <Zap size={13} />, isAction: true },
  ];
  const navActions: Record<string, string> = { "qa-entry": "/entry", "qa-reports": "/reports", "qa-suggestions": "/suggestions", "qa-masters": "/masters" };
  const filtered = q
    ? allResults.filter(r => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
    : allResults.filter(r => r.category === "Months" || r.category === "Quick Actions");

  const grouped: Record<string, SResult[]> = {};
  filtered.forEach(r => { grouped[r.category] = grouped[r.category] ? [...grouped[r.category], r] : [r]; });

  const toggleItem = (r: SResult) => {
    if (r.isAction) { setLocation(navActions[r.id]); setSearchOpen(false); setSearchQuery(""); return; }
    setSelectedItems(prev => {
      const next = { ...prev };
      if (next[r.id]) delete next[r.id];
      else next[r.id] = { id: r.id, label: r.label, category: r.category, entryIdx: r.entryIdx };
      return next;
    });
  };

  const removeChip = (id: string) => setSelectedItems(prev => { const n = { ...prev }; delete n[id]; return n; });
  const clearAll = () => { setSelectedItems({}); setSearchQuery(""); };
  const chips = Object.values(selectedItems);
  const totalSelected = chips.length;

  const searchIcon = (
    <button data-testid="btn-search" onClick={() => setSearchOpen(true)}
      style={{ position: "relative", width: 36, height: 36, borderRadius: 10, background: "#F5F8FF", border: "1.5px solid #D1E3FF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", transition: "all 0.15s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#EBF3FF"; (e.currentTarget as HTMLButtonElement).style.color = "#1A4FBA"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#1A4FBA"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#F5F8FF"; (e.currentTarget as HTMLButtonElement).style.color = "#64748B"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#D1E3FF"; }}>
      <Search size={16} />
      {totalSelected > 0 && (
        <span style={{ position: "absolute", top: -5, right: -5, minWidth: 16, height: 16, borderRadius: 99, background: "#1A4FBA", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", border: "2px solid #fff" }}>{totalSelected}</span>
      )}
    </button>
  );

  return (
    <AppLayout headerRight={searchIcon}>
      {searchOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,30,60,0.5)", backdropFilter: "blur(6px)", zIndex: 500, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 72 }}
          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
          <div data-testid="search-modal" style={{ width: "100%", maxWidth: 580, background: "#fff", borderRadius: 20, boxShadow: "0 24px 80px rgba(0,0,0,0.25)", overflow: "hidden", animation: "searchIn 0.18s ease", margin: "0 16px" }} onClick={e => e.stopPropagation()}>
            {chips.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "12px 16px 8px", borderBottom: "1px solid #EBF3FF", background: "#FAFCFF" }}>
                {chips.map(chip => (
                  <span key={chip.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: catBg[chip.category], color: catColor[chip.category], border: `1px solid ${catColor[chip.category]}30`, borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 600 }}>
                    {chip.label}
                    <button onClick={() => removeChip(chip.id)} style={{ background: "none", border: "none", cursor: "pointer", color: catColor[chip.category], display: "flex", alignItems: "center", padding: 0, opacity: 0.7 }}><X size={11} /></button>
                  </span>
                ))}
                <button onClick={clearAll} style={{ fontSize: 12, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", marginLeft: "auto", fontWeight: 600 }}>Clear all</button>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderBottom: "1px solid #EBF3FF" }}>
              <Search size={17} color="#1A4FBA" style={{ flexShrink: 0 }} />
              <input data-testid="input-search" autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Escape" && (setSearchOpen(false), setSearchQuery(""))}
                placeholder="Search months, income types, expense categories…"
                style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#0F1E3C", background: "transparent", fontWeight: 500 }} />
              {searchQuery
                ? <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", padding: 0 }}><X size={15} /></button>
                : <kbd style={{ fontSize: 11, color: "#94A3B8", background: "#F1F5F9", borderRadius: 6, padding: "3px 7px", border: "1px solid #D1E3FF", fontFamily: "monospace" }}>Esc</kbd>}
            </div>
            <div style={{ maxHeight: 360, overflowY: "auto", padding: "8px 0" }}>
              {Object.keys(grouped).length === 0 ? (
                <div style={{ padding: 32, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>No results for "<strong>{searchQuery}</strong>"</div>
              ) : Object.entries(grouped).map(([cat, results]) => (
                <div key={cat}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 18px 3px" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: catColor[cat] }}>{cat}</span>
                    <span style={{ flex: 1, height: 1, background: catBg[cat] }} />
                    {!results[0].isAction && (
                      <button onClick={() => {
                        const allSelected = results.every(r => selectedItems[r.id]);
                        setSelectedItems(prev => {
                          const n = { ...prev };
                          results.forEach(r => { if (allSelected) delete n[r.id]; else if (!n[r.id]) n[r.id] = { id: r.id, label: r.label, category: r.category, entryIdx: r.entryIdx }; });
                          return n;
                        });
                      }} style={{ fontSize: 11, color: catColor[cat], background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>
                        {results.every(r => selectedItems[r.id]) ? "Deselect all" : "Select all"}
                      </button>
                    )}
                  </div>
                  {results.map(r => {
                    const checked = !!selectedItems[r.id];
                    return (
                      <div key={r.id} data-testid={`search-result-${r.id}`} onClick={() => toggleItem(r)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 18px", cursor: "pointer", background: checked ? catBg[cat] : "transparent", transition: "background 0.1s", borderLeft: checked ? `3px solid ${catColor[cat]}` : "3px solid transparent" }}
                        onMouseEnter={e => { if (!checked) (e.currentTarget as HTMLDivElement).style.background = "#F5F8FF"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = checked ? catBg[cat] : "transparent"; }}>
                        {r.isAction ? (
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: catBg[cat], color: catColor[cat], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{r.icon}</div>
                        ) : (
                          <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked ? catColor[cat] : "#CBD5E1"}`, background: checked ? catColor[cat] : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                            {checked && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: checked ? 700 : 500, color: checked ? catColor[cat] : "#0F1E3C", marginBottom: 1 }}>{r.label}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.sub}</div>
                        </div>
                        {r.isAction && <ChevronRight size={13} color="#CBD5E1" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 18px", borderTop: "1px solid #EBF3FF", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, color: "#94A3B8", flex: 1 }}>
                {totalSelected > 0 ? `${totalSelected} item${totalSelected > 1 ? "s" : ""} selected` : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
              </span>
              {totalSelected > 0 && <button onClick={clearAll} style={{ fontSize: 13, color: "#64748B", background: "none", border: "1px solid #D1E3FF", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontWeight: 600 }}>Clear</button>}
              <button data-testid="btn-search-apply" onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "#1A4FBA", border: "none", borderRadius: 8, padding: "7px 20px", cursor: "pointer" }}>
                {totalSelected > 0 ? "Apply Selection" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 className="font-heading" style={{ fontSize: 28, fontWeight: 800, color: "#0F1E3C", marginBottom: 6 }} data-testid="greeting">
                {getGreeting()}, {user?.name}
              </h1>
              <p style={{ color: "#64748B", fontSize: 14 }}>{getDate()}</p>
            </div>
            <div style={{ background: "linear-gradient(135deg, #EBF3FF, #D1E8FF)", border: "1px solid #D1E3FF", borderRadius: 14, padding: "10px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 2 }}>Current Month</div>
              <div className="font-heading" style={{ fontWeight: 700, color: "#1A4FBA", fontSize: 15 }}>
                {MONTHS[new Date().getMonth()]} {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 className="font-heading" style={{ fontSize: 18, fontWeight: 700, color: "#0F1E3C" }}>{monthLabel} Summary</h2>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <KpiCard testId="kpi-income" title="Total Income" value={fmt(animIncome)} subtitle="vs last month" color="#1A4FBA" bg="#EBF3FF" icon={<IndianRupee size={24} />} />
            <KpiCard testId="kpi-expenses" title="Total Expenses" value={fmt(animExpense)} subtitle={`${expensePct}% of income`} color="#F59E0B" bg="#FEF3C7" icon={<TrendingDown size={24} />} />
            <KpiCard testId="kpi-balance" title="Net Balance" value={fmt(animBalance)} subtitle="Saved this month" color="#10B981" bg="#D1FAE5" icon={<TrendingUp size={24} />} />
            <KpiCard testId="kpi-savings-rate" title="Savings Rate" value={`${(animRate / 10).toFixed(1)}%`} subtitle={savingsLabel} color="#0D9488" bg="#CCFBF1" icon={<Percent size={24} />} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginTop: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
            <style>{`@media(max-width:900px){.dash-grid{grid-template-columns:1fr!important}}`}</style>
            <div className="dash-grid" style={{ display: "contents" }}>
              <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid #D1E3FF", boxShadow: "0 4px 16px rgba(26,79,186,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: "#0F1E3C", marginBottom: 4 }}>Balance Trend</h3>
                    <p style={{ fontSize: 12, color: "#64748B" }}>Click a bar to add or edit that month's entry</p>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: "#1A4FBA", display: "inline-block" }} />Balance</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} onClick={() => setLocation("/entry")} style={{ cursor: "pointer" }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EBF3FF" />
                    <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 13 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748B", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip formatter={(v: number) => [fmt(v), "Balance"]} contentStyle={{ borderRadius: 12, border: "1px solid #D1E3FF", boxShadow: "0 4px 12px rgba(26,79,186,0.1)", fontFamily: "'Inter', sans-serif" }} />
                    <Bar dataKey="balance" fill="#1A4FBA" radius={[8, 8, 0, 0]} maxBarSize={64} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div data-testid="suggestion-banner" onClick={() => setLocation("/suggestions")}
                  style={{ background: `linear-gradient(135deg, ${suggestion.color}15, ${suggestion.color}08)`, border: `1px solid ${suggestion.color}30`, borderRadius: 20, padding: 24, cursor: "pointer", transition: "transform 0.2s", flex: 1 }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = "none"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: suggestion.bgColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Lightbulb size={20} color={suggestion.color} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: suggestion.color, textTransform: "uppercase", letterSpacing: 1 }}>{suggestion.label}</div>
                  </div>
                  <div className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: "#0F1E3C", marginBottom: 10 }}>{suggestion.heading}</div>
                  <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, marginBottom: 16 }}>{suggestion.points[0]}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: suggestion.color }}>
                    View full suggestion <ChevronRight size={14} />
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #D1E3FF", boxShadow: "0 4px 16px rgba(26,79,186,0.06)" }}>
                  <h3 className="font-heading" style={{ fontSize: 14, fontWeight: 700, color: "#0F1E3C", marginBottom: 14 }}>Quick Actions</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { label: "Add / Edit Entry", icon: <Plus size={16} />, href: "/entry", color: "#1A4FBA", bg: "#EBF3FF" },
                      { label: "View Reports", icon: <BarChart2 size={16} />, href: "/reports", color: "#0D9488", bg: "#CCFBF1" },
                      { label: "Manage Masters", icon: <Zap size={16} />, href: "/masters", color: "#7C3AED", bg: "#EDE9FE" },
                    ].map(a => (
                      <button key={a.label} data-testid={`quick-action-${a.label.replace(/\s+/g, "-").toLowerCase()}`} onClick={() => setLocation(a.href)}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: a.bg, border: "none", borderRadius: 12, cursor: "pointer", transition: "transform 0.15s", textAlign: "left" }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.transform = "translateX(3px)"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.transform = "none"}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: a.color, flexShrink: 0 }}>{a.icon}</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.label}</span>
                        <ChevronRight size={14} color={a.color} style={{ marginLeft: "auto" }} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid #D1E3FF", boxShadow: "0 4px 16px rgba(26,79,186,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 className="font-heading" style={{ fontSize: 16, fontWeight: 700, color: "#0F1E3C" }}>Recent Month-wise Summary</h3>
              <button data-testid="btn-view-reports" onClick={() => setLocation("/reports")}
                style={{ background: "none", border: "none", color: "#1A4FBA", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#F5F8FF" }}>
                    {["Month", "Total Income", "Total Expenses", "Balance", "Savings %", "Tier"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#64748B", borderBottom: "1px solid #D1E3FF", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...entries].reverse().map((m, i) => {
                    const s = getInvestmentSuggestion(m.balance);
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid #F1F5FF", transition: "background 0.15s", cursor: "pointer" }}
                        onClick={() => setLocation("/reports")}
                        onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = "#F5F8FF"}
                        onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = "#fff"}>
                        <td style={{ padding: "14px 16px", fontWeight: 600, color: "#0F1E3C" }}>{MONTHS[m.month]} {m.year}</td>
                        <td style={{ padding: "14px 16px", color: "#1A4FBA", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(m.totalIncome)}</td>
                        <td style={{ padding: "14px 16px", color: "#F59E0B", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(m.totalExpense)}</td>
                        <td style={{ padding: "14px 16px", fontWeight: 700, fontVariantNumeric: "tabular-nums", color: m.balance >= 0 ? "#10B981" : "#EF4444" }}>{fmt(m.balance)}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ background: m.savingsRate > 30 ? "#D1FAE5" : "#FEF3C7", color: m.savingsRate > 30 ? "#10B981" : "#F59E0B", borderRadius: 999, padding: "3px 12px", fontSize: 13, fontWeight: 700 }}>{m.savingsRate.toFixed(1)}%</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ background: s.bgColor, color: s.color, borderRadius: 999, padding: "3px 12px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

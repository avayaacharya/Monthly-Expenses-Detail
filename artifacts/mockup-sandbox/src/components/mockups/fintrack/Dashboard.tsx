import React, { useState, useEffect } from 'react';
import './_shared/_group.css';
import { MOCK_USER, MONTHLY_DATA, INCOME_TYPES, EXPENSE_CATEGORIES, getInvestmentSuggestion } from './_shared/mockData';
import { AppLayout } from './_shared/AppLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, Percent, ChevronRight, Plus, Lightbulb, BarChart2, Search, X, Calendar, DollarSign, ShoppingCart, Zap } from 'lucide-react';

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function useCountUp(target: number, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

function KpiCard({ title, value, subtitle, color, bg, icon }: { title: string; value: string; subtitle?: string; color: string; bg: string; icon: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)', flex: 1, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(26,79,186,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(26,79,186,0.06)'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500, marginBottom: 10 }}>{title}</div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color, marginBottom: 4, letterSpacing: '-0.5px' }}>{value}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#94A3B8' }}>{subtitle}</div>}
        </div>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>{icon}</div>
      </div>
    </div>
  );
}

const chartData = MONTHLY_DATA.map(m => ({ month: m.month.slice(0, 3), balance: m.balance, income: m.totalIncome, expense: m.totalExpense }));

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDate() {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function Dashboard() {
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(MONTHLY_DATA.length - 1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, { id: string; label: string; category: string; monthIdx?: number }>>({});

  // Derive display month(s) from selected month chips
  const selectedMonthChips = Object.values(selectedItems).filter(s => s.category === 'Months');
  const activeMonthIndices = selectedMonthChips.length > 0
    ? selectedMonthChips.map(s => s.monthIdx!).sort((a, b) => a - b)
    : [selectedMonthIndex];

  // Aggregate KPIs across all active months
  const activeMonths = activeMonthIndices.map(i => MONTHLY_DATA[i]);
  const aggIncome  = activeMonths.reduce((s, m) => s + m.totalIncome, 0);
  const aggExpense = activeMonths.reduce((s, m) => s + m.totalExpense, 0);
  const aggBalance = aggIncome - aggExpense;
  const aggRate    = activeMonths.reduce((s, m) => s + m.savingsRate, 0) / activeMonths.length;

  const suggestion = getInvestmentSuggestion(aggBalance / activeMonths.length);

  const income  = useCountUp(aggIncome);
  const expense = useCountUp(aggExpense);
  const balance = useCountUp(aggBalance);
  const rate    = useCountUp(Math.round(aggRate * 10));

  if (navTarget) {
    const labels: Record<string, string> = { entry: 'Monthly Entry', suggestions: 'Investment Suggestions', reports: 'Financial Reports', masters: 'Masters', login: 'Login (Logout)' };
    return (
      <div style={{ minHeight: '100vh', background: '#F5F8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 64px', textAlign: 'center', boxShadow: '0 4px 24px rgba(26,79,186,0.1)', maxWidth: 420, border: '1px solid #D1E3FF' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#EBF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ChevronRight size={28} color="#1A4FBA" />
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#0F1E3C', marginBottom: 10 }}>Navigated to {labels[navTarget] || navTarget}</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>In the full app, this would take you to the {labels[navTarget] || navTarget} page.</p>
          <button onClick={() => setNavTarget(null)} style={{ background: '#1A4FBA', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const monthLabel = activeMonths.length > 1
    ? `${activeMonths[0].month} – ${activeMonths[activeMonths.length - 1].month} ${activeMonths[0].year} (${activeMonths.length} months)`
    : `${activeMonths[0].month} ${activeMonths[0].year}`;
  const expensePct = aggIncome > 0 ? Math.round((aggExpense / aggIncome) * 100) : 0;
  const savingsLabel = aggRate >= 40 ? 'Excellent!' : aggRate >= 25 ? 'Good job!' : 'Keep saving!';

  // ── Search helpers ────────────────────────────────────────────────────────
  type SResult = { id: string; label: string; sub: string; category: string; icon: React.ReactNode; isAction?: boolean; monthIdx?: number };
  const q = searchQuery.trim().toLowerCase();

  const catColor: Record<string, string> = { Months: '#1A4FBA', 'Income Types': '#10B981', 'Expense Categories': '#F59E0B', 'Quick Actions': '#7C3AED' };
  const catBg: Record<string, string>    = { Months: '#EBF3FF', 'Income Types': '#D1FAE5', 'Expense Categories': '#FEF3C7', 'Quick Actions': '#EDE9FE' };

  const allResults: SResult[] = [
    ...MONTHLY_DATA.map((m, i) => ({ id: `month-${i}`, label: `${m.month} ${m.year}`, sub: `Income ₹${(m.totalIncome/1000).toFixed(0)}K · Expenses ₹${(m.totalExpense/1000).toFixed(0)}K · Balance ₹${(m.balance/1000).toFixed(0)}K`, category: 'Months', icon: <Calendar size={13} />, monthIdx: i })),
    ...INCOME_TYPES.map((t, i)       => ({ id: `inc-${i}`,   label: t, sub: 'Income type',        category: 'Income Types',       icon: <DollarSign size={13} /> })),
    ...EXPENSE_CATEGORIES.map((c, i) => ({ id: `exp-${i}`,   label: c, sub: 'Expense category',   category: 'Expense Categories', icon: <ShoppingCart size={13} /> })),
    { id: 'qa-entry',       label: 'Add / Edit Monthly Entry',    sub: 'Log income and expenses',            category: 'Quick Actions', icon: <Plus size={13} />,     isAction: true },
    { id: 'qa-reports',     label: 'View Reports',                sub: 'Charts and 6-month trends',          category: 'Quick Actions', icon: <BarChart2 size={13} />, isAction: true },
    { id: 'qa-suggestions', label: 'Investment Suggestions',      sub: 'Smart advice for your savings',      category: 'Quick Actions', icon: <Lightbulb size={13} />, isAction: true },
    { id: 'qa-masters',     label: 'Manage Masters',              sub: 'Income types & expense categories',  category: 'Quick Actions', icon: <Zap size={13} />,      isAction: true },
  ];

  const navActions: Record<string, string> = { 'qa-entry': 'entry', 'qa-reports': 'reports', 'qa-suggestions': 'suggestions', 'qa-masters': 'masters' };

  const filtered = q
    ? allResults.filter(r => r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
    : allResults.filter(r => r.category === 'Months' || r.category === 'Quick Actions');

  const grouped: Record<string, SResult[]> = {};
  filtered.forEach(r => { grouped[r.category] = grouped[r.category] ? [...grouped[r.category], r] : [r]; });

  const toggleItem = (r: SResult) => {
    if (r.isAction) { setNavTarget(navActions[r.id]); setSearchOpen(false); setSearchQuery(''); return; }
    setSelectedItems(prev => {
      const next = { ...prev };
      if (next[r.id]) delete next[r.id];
      else next[r.id] = { id: r.id, label: r.label, category: r.category, monthIdx: r.monthIdx };
      return next;
    });
  };

  const removeChip = (id: string) => setSelectedItems(prev => { const n = { ...prev }; delete n[id]; return n; });
  const clearAll   = () => { setSelectedItems({}); setSearchQuery(''); };
  const chips      = Object.values(selectedItems);
  const totalSelected = chips.length;

  const searchIcon = (
    <button
      onClick={() => setSearchOpen(true)}
      title="Search"
      style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, background: '#F5F8FF', border: '1.5px solid #D1E3FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', transition: 'all 0.15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FF'; (e.currentTarget as HTMLButtonElement).style.color = '#1A4FBA'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#1A4FBA'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F8FF'; (e.currentTarget as HTMLButtonElement).style.color = '#64748B'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#D1E3FF'; }}
    >
      <Search size={16} />
      {totalSelected > 0 && (
        <span style={{ position: 'absolute', top: -5, right: -5, minWidth: 16, height: 16, borderRadius: 99, background: '#1A4FBA', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px', border: '2px solid #fff' }}>
          {totalSelected}
        </span>
      )}
    </button>
  );

  return (
    <AppLayout currentPage="dashboard" onNavigate={setNavTarget} user={MOCK_USER} headerRight={searchIcon}>
      {/* ── Multi-select Search overlay ──────────────────────────────────── */}
      {searchOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,30,60,0.5)', backdropFilter: 'blur(6px)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 72 }}
          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
        >
          <div style={{ width: '100%', maxWidth: 580, background: '#fff', borderRadius: 20, boxShadow: '0 24px 80px rgba(0,0,0,0.25)', overflow: 'hidden', animation: 'searchIn 0.18s ease' }} onClick={e => e.stopPropagation()}>
            <style>{`@keyframes searchIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}`}</style>

            {/* ── Chips row (shown when items selected) ── */}
            {chips.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '12px 16px 8px', borderBottom: '1px solid #EBF3FF', background: '#FAFCFF' }}>
                {chips.map(chip => (
                  <span key={chip.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: catBg[chip.category], color: catColor[chip.category], border: `1px solid ${catColor[chip.category]}30`, borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
                    {chip.label}
                    <button onClick={() => removeChip(chip.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: catColor[chip.category], display: 'flex', alignItems: 'center', padding: 0, opacity: 0.7 }}>
                      <X size={11} />
                    </button>
                  </span>
                ))}
                <button onClick={clearAll} style={{ fontSize: 12, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', fontWeight: 600 }}>Clear all</button>
              </div>
            )}

            {/* ── Search input ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid #EBF3FF' }}>
              <Search size={17} color="#1A4FBA" style={{ flexShrink: 0 }} />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && (setSearchOpen(false), setSearchQuery(''))}
                placeholder="Search months, income types, expense categories…"
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: "'Inter', sans-serif", color: '#0F1E3C', background: 'transparent', fontWeight: 500 }}
              />
              {searchQuery
                ? <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', padding: 0 }}><X size={15} /></button>
                : <kbd style={{ fontSize: 11, color: '#94A3B8', background: '#F1F5F9', borderRadius: 6, padding: '3px 7px', border: '1px solid #D1E3FF', fontFamily: 'monospace' }}>Esc</kbd>
              }
            </div>

            {/* ── Results list ── */}
            <div style={{ maxHeight: 360, overflowY: 'auto', padding: '8px 0' }}>
              {Object.keys(grouped).length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>No results for "<strong>{searchQuery}</strong>"</div>
              ) : Object.entries(grouped).map(([cat, results]) => (
                <div key={cat}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 18px 3px' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: catColor[cat] }}>{cat}</span>
                    <span style={{ flex: 1, height: 1, background: catBg[cat] }} />
                    {!results[0].isAction && (
                      <button
                        onClick={() => {
                          const allSelected = results.every(r => selectedItems[r.id]);
                          setSelectedItems(prev => {
                            const n = { ...prev };
                            results.forEach(r => { if (allSelected) delete n[r.id]; else if (!n[r.id]) n[r.id] = { id: r.id, label: r.label, category: r.category, monthIdx: r.monthIdx }; });
                            return n;
                          });
                        }}
                        style={{ fontSize: 11, color: catColor[cat], background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                      >
                        {results.every(r => selectedItems[r.id]) ? 'Deselect all' : 'Select all'}
                      </button>
                    )}
                  </div>
                  {results.map(r => {
                    const checked = !!selectedItems[r.id];
                    return (
                      <div
                        key={r.id}
                        onClick={() => toggleItem(r)}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 18px', cursor: 'pointer', background: checked ? `${catBg[cat]}` : 'transparent', transition: 'background 0.1s', borderLeft: checked ? `3px solid ${catColor[cat]}` : '3px solid transparent' }}
                        onMouseEnter={e => { if (!checked) (e.currentTarget as HTMLDivElement).style.background = '#F5F8FF'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = checked ? catBg[cat] : 'transparent'; }}
                      >
                        {/* Checkbox / icon */}
                        {r.isAction ? (
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: catBg[cat], color: catColor[cat], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
                        ) : (
                          <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked ? catColor[cat] : '#CBD5E1'}`, background: checked ? catColor[cat] : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}>
                            {checked && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: checked ? 700 : 500, color: checked ? catColor[cat] : '#0F1E3C', marginBottom: 1 }}>{r.label}</div>
                          <div style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.sub}</div>
                        </div>
                        {r.isAction && <ChevronRight size={13} color="#CBD5E1" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            <div style={{ padding: '12px 18px', borderTop: '1px solid #EBF3FF', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, color: '#94A3B8', flex: 1 }}>
                {totalSelected > 0 ? `${totalSelected} item${totalSelected > 1 ? 's' : ''} selected` : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
              </span>
              {totalSelected > 0 && (
                <button onClick={clearAll} style={{ fontSize: 13, color: '#64748B', background: 'none', border: '1px solid #D1E3FF', borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontWeight: 600 }}>Clear</button>
              )}
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                style={{ fontSize: 13, fontWeight: 700, color: '#fff', background: '#1A4FBA', border: 'none', borderRadius: 8, padding: '7px 20px', cursor: 'pointer' }}
              >
                {totalSelected > 0 ? 'Apply Selection' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ animation: 'fadeSlideIn 0.3s ease forwards' }}>
        <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>

        {/* Greeting */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#0F1E3C', marginBottom: 6 }}>
                {getGreeting()}, {MOCK_USER.name}
              </h1>
              <p style={{ color: '#64748B', fontSize: 14 }}>{getDate()}</p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #EBF3FF, #D1E8FF)', border: '1px solid #D1E3FF', borderRadius: 14, padding: '10px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 2 }}>Current Month</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#1A4FBA', fontSize: 15 }}>May 2025</div>
            </div>
          </div>
        </div>

        {/* Selected month summary */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#0F1E3C' }}>{monthLabel} Summary</h2>
            <span style={{ fontSize: 12, color: '#64748B' }}>
              {selectedMonthIndex === MONTHLY_DATA.length - 1 ? 'Last saved month' : `${MONTHLY_DATA.length - 1 - selectedMonthIndex} month(s) ago`}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <KpiCard title="Total Income" value={fmt(income)} subtitle="vs last month" color="#1A4FBA" bg="#EBF3FF" icon={<IndianRupee size={24} />} />
            <KpiCard title="Total Expenses" value={fmt(expense)} subtitle={`${expensePct}% of income`} color="#F59E0B" bg="#FEF3C7" icon={<TrendingDown size={24} />} />
            <KpiCard title="Net Balance" value={fmt(balance)} subtitle="Saved this month" color="#10B981" bg="#D1FAE5" icon={<TrendingUp size={24} />} />
            <KpiCard title="Savings Rate" value={`${(rate / 10).toFixed(1)}%`} subtitle={savingsLabel} color="#0D9488" bg="#CCFBF1" icon={<Percent size={24} />} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, marginTop: 24 }}>
          {/* Chart */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#0F1E3C', marginBottom: 4 }}>3-Month Balance Trend</h3>
                <p style={{ fontSize: 12, color: '#64748B' }}>Click a bar to edit that month's entry</p>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 12, borderRadius: 3, background: '#1A4FBA', display: 'inline-block' }} />Balance</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} onClick={() => setNavTarget('entry')} style={{ cursor: 'pointer' }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBF3FF" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [fmt(v), 'Balance']} contentStyle={{ borderRadius: 12, border: '1px solid #D1E3FF', boxShadow: '0 4px 12px rgba(26,79,186,0.1)', fontFamily: "'Inter', sans-serif" }} />
                <Bar dataKey="balance" fill="#1A4FBA" radius={[8, 8, 0, 0]} maxBarSize={64} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Suggestion Banner */}
            <div onClick={() => setNavTarget('suggestions')} style={{ background: `linear-gradient(135deg, ${suggestion.color}15, ${suggestion.color}08)`, border: `1px solid ${suggestion.color}30`, borderRadius: 20, padding: '24px', cursor: 'pointer', transition: 'transform 0.2s', flex: 1 }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'none'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: suggestion.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Lightbulb size={20} color={suggestion.color} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: suggestion.color, textTransform: 'uppercase', letterSpacing: 1 }}>{suggestion.label}</div>
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#0F1E3C', marginBottom: 8 }}>{suggestion.heading}</p>
              <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, marginBottom: 16 }}>
                {suggestion.points[0]}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: suggestion.color }}>
                See full investment advice <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: 24, marginBottom: 8 }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#0F1E3C', marginBottom: 16 }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: <Plus size={22} />, title: 'Add / Edit This Month\'s Entry', desc: 'Log income and expenses for May 2025', page: 'entry', color: '#1A4FBA', bg: '#EBF3FF' },
              { icon: <Lightbulb size={22} />, title: 'View Investment Suggestions', desc: 'Smart advice based on your April balance', page: 'suggestions', color: '#0D9488', bg: '#CCFBF1' },
              { icon: <BarChart2 size={22} />, title: 'View Reports', desc: 'Charts, trends, and 6-month analysis', page: 'reports', color: '#7C3AED', bg: '#EDE9FE' },
            ].map(a => (
              <button key={a.title} onClick={() => setNavTarget(a.page)}
                style={{ background: '#fff', border: `1px solid #D1E3FF`, borderRadius: 20, padding: '24px', textAlign: 'left', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 16px rgba(26,79,186,0.06)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 32px rgba(26,79,186,0.12)'; (e.currentTarget as HTMLButtonElement).style.borderColor = a.color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'none'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(26,79,186,0.06)'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#D1E3FF'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color, marginBottom: 16 }}>{a.icon}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#0F1E3C', marginBottom: 6 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{a.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

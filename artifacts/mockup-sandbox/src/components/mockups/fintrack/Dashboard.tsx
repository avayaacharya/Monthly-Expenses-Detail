import React, { useState, useEffect } from 'react';
import './_shared/_group.css';
import { MOCK_USER, MONTHLY_DATA, getInvestmentSuggestion } from './_shared/mockData';
import { AppLayout } from './_shared/AppLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, Percent, ChevronRight, Plus, Lightbulb, BarChart2, CalendarSearch } from 'lucide-react';

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

  const selectedMonth = MONTHLY_DATA[selectedMonthIndex];
  const suggestion = getInvestmentSuggestion(selectedMonth.balance);

  const income = useCountUp(selectedMonth.totalIncome);
  const expense = useCountUp(selectedMonth.totalExpense);
  const balance = useCountUp(selectedMonth.balance);
  const rate = useCountUp(Math.round(selectedMonth.savingsRate * 10));

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

  const monthLabel = `${selectedMonth.month} ${selectedMonth.year}`;
  const expensePct = Math.round((selectedMonth.totalExpense / selectedMonth.totalIncome) * 100);
  const savingsLabel = selectedMonth.savingsRate >= 40 ? 'Excellent!' : selectedMonth.savingsRate >= 25 ? 'Good job!' : 'Keep saving!';

  const monthSelector = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#EBF3FF', borderRadius: 10, padding: '6px 12px', border: '1px solid #D1E3FF', cursor: 'pointer' }}>
      <CalendarSearch size={15} color="#1A4FBA" />
      <select
        value={selectedMonthIndex}
        onChange={e => setSelectedMonthIndex(Number(e.target.value))}
        style={{ background: 'transparent', border: 'none', outline: 'none', fontSize: 13, fontWeight: 700, color: '#1A4FBA', cursor: 'pointer', fontFamily: "'Inter', sans-serif", appearance: 'none', paddingRight: 4 }}
      >
        {MONTHLY_DATA.map((m, i) => (
          <option key={i} value={i}>{m.month} {m.year}</option>
        ))}
      </select>
    </div>
  );

  return (
    <AppLayout currentPage="dashboard" onNavigate={setNavTarget} user={MOCK_USER} headerRight={monthSelector}>
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

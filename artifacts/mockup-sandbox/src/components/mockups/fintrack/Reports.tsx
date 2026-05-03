import React, { useState } from 'react';
import './_shared/_group.css';
import { MOCK_USER, MONTHLY_DATA, CURRENT_MONTH_ENTRY, getInvestmentSuggestion } from './_shared/mockData';
import { AppLayout } from './_shared/AppLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Cell
} from 'recharts';
import { ArrowLeft, Download, Plus, ChevronRight } from 'lucide-react';

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const MONTH_OPTIONS = ['April 2025', 'March 2025', 'February 2025'];

export function Reports() {
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('April 2025');

  const selectedData = MONTHLY_DATA[2]; // April
  const suggestion = getInvestmentSuggestion(selectedData.balance);

  const trendData = MONTHLY_DATA.map(m => ({
    month: m.month.slice(0, 3),
    Income: m.totalIncome,
    Expenses: m.totalExpense,
    Balance: m.balance,
  }));

  const expenseBreakdown = [...CURRENT_MONTH_ENTRY.expenseItems]
    .sort((a, b) => b.amount - a.amount)
    .map((e, i) => ({ category: e.category.slice(0, 22) + (e.category.length > 22 ? '…' : ''), amount: e.amount, top: i < 3 }));

  if (navTarget) {
    const labels: Record<string, string> = { dashboard: 'Dashboard', entry: 'Monthly Entry', suggestions: 'Investment Suggestions', masters: 'Masters', login: 'Logout' };
    return (
      <div style={{ minHeight: '100vh', background: '#F5F8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 64px', textAlign: 'center', boxShadow: '0 4px 24px rgba(26,79,186,0.1)', maxWidth: 420, border: '1px solid #D1E3FF' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#0F1E3C', marginBottom: 10 }}>Navigated to {labels[navTarget] || navTarget}</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>In the full app, this would take you there.</p>
          <button onClick={() => setNavTarget(null)} style={{ background: '#1A4FBA', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Back to Reports</button>
        </div>
      </div>
    );
  }

  return (
    <AppLayout currentPage="reports" onNavigate={setNavTarget} user={MOCK_USER}>
      <div style={{ animation: 'fadeSlideIn 0.3s ease' }}>
        <style>{`@keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }`}</style>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>
              <span style={{ cursor: 'pointer', color: '#1A4FBA' }} onClick={() => setNavTarget('dashboard')}>Dashboard</span>
              <span style={{ margin: '0 8px' }}>›</span>
              <span style={{ color: '#0F1E3C' }}>Financial Reports</span>
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: '#0F1E3C', marginBottom: 6 }}>Financial Reports</h1>
            <p style={{ color: '#64748B', fontSize: 14 }}>Track your income, expenses, and savings over time</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>Selected Month</label>
              <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ padding: '10px 16px', border: '1.5px solid #D1E3FF', borderRadius: 10, fontSize: 14, fontFamily: "'Inter', sans-serif", color: '#0F1E3C', background: '#fff', outline: 'none', cursor: 'pointer' }}>
                {MONTH_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <button onClick={() => window.print()} style={{ background: '#1A4FBA', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>

        {/* KPI tiles */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {[
            { title: 'Total Income', value: fmt(selectedData.totalIncome), color: '#1A4FBA', bg: '#EBF3FF' },
            { title: 'Total Expenses', value: fmt(selectedData.totalExpense), color: '#F59E0B', bg: '#FEF3C7' },
            { title: 'Net Balance', value: fmt(selectedData.balance), color: '#10B981', bg: '#D1FAE5' },
            { title: 'Savings Rate', value: `${selectedData.savingsRate.toFixed(1)}%`, color: '#0D9488', bg: '#CCFBF1' },
          ].map(k => (
            <div key={k.title} style={{ flex: 1, background: '#fff', borderRadius: 16, padding: '20px 20px', border: '1px solid #D1E3FF', boxShadow: '0 4px 12px rgba(26,79,186,0.05)', transition: 'transform 0.2s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'none'}>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{k.title}</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, marginBottom: 24 }}>
          {/* Income vs Expenses Chart */}
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#0F1E3C', marginBottom: 20 }}>Income vs Expenses — Last 3 Months</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBF3FF" />
                <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => [fmt(v)]} contentStyle={{ borderRadius: 12, border: '1px solid #D1E3FF', fontFamily: "'Inter', sans-serif" }} />
                <Legend iconType="circle" iconSize={10} />
                <Bar dataKey="Income" fill="#1A4FBA" radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Expenses" fill="#F59E0B" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Suggestion badges */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)' }}>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#0F1E3C', marginBottom: 16 }}>Suggestion Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {MONTHLY_DATA.slice().reverse().map(m => {
                const s = getInvestmentSuggestion(m.balance);
                return (
                  <div key={m.month} style={{ background: s.bgColor, borderRadius: 14, padding: '14px 16px', border: `1px solid ${s.color}20` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0F1E3C' }}>{m.month} {m.year}</span>
                      <span style={{ background: s.color, color: '#fff', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{s.label}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#64748B' }}>Balance: <strong style={{ color: s.color }}>{fmt(m.balance)}</strong></span>
                      <button onClick={() => setNavTarget('suggestions')} style={{ background: 'none', border: 'none', color: s.color, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                        See full advice <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)', marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#0F1E3C', marginBottom: 4 }}>Expense Breakdown — {selectedMonth}</h3>
          <p style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>Top 3 expenses highlighted. Sorted highest to lowest.</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={expenseBreakdown} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBF3FF" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
              <YAxis dataKey="category" type="category" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} width={160} />
              <Tooltip formatter={(v: number) => [fmt(v), 'Amount']} contentStyle={{ borderRadius: 12, border: '1px solid #D1E3FF', fontFamily: "'Inter', sans-serif" }} />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={20} fill="#1A4FBA">
                {expenseBreakdown.map((e, i) => (
                  <Cell key={i} fill={e.top ? (i === 0 ? '#EF4444' : i === 1 ? '#F59E0B' : '#F97316') : '#1A4FBA'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 6-month trend table */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)', marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#0F1E3C', marginBottom: 20 }}>6-Month Trend</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#F5F8FF' }}>
                {['Month', 'Total Income', 'Total Expenses', 'Balance', 'Savings %'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748B', borderBottom: '1px solid #D1E3FF' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...MONTHLY_DATA].reverse().map(m => (
                <tr key={m.month} style={{ borderBottom: '1px solid #F1F5FF', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = '#F5F8FF'}
                  onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = '#fff'}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0F1E3C' }}>{m.month} {m.year}</td>
                  <td style={{ padding: '14px 16px', color: '#1A4FBA', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(m.totalIncome)}</td>
                  <td style={{ padding: '14px 16px', color: '#F59E0B', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(m.totalExpense)}</td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: m.balance >= 0 ? '#10B981' : '#EF4444' }}>{fmt(m.balance)}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: m.savingsRate > 30 ? '#D1FAE5' : '#FEF3C7', color: m.savingsRate > 30 ? '#10B981' : '#F59E0B', borderRadius: 999, padding: '3px 12px', fontSize: 13, fontWeight: 700 }}>{m.savingsRate.toFixed(1)}%</span>
                  </td>
                </tr>
              ))}
              {[1, 2, 3].map(i => (
                <tr key={`empty-${i}`} style={{ borderBottom: '1px solid #F1F5FF', opacity: 0.5 }}>
                  <td style={{ padding: '14px 16px', color: '#94A3B8', fontStyle: 'italic' }}>No data</td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8' }}>—</td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8' }}>—</td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8' }}>—</td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8' }}>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={() => setNavTarget('dashboard')} style={{ background: 'none', border: '1.5px solid #D1E3FF', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <button onClick={() => setNavTarget('entry')} style={{ background: 'none', border: '1.5px solid #D1E3FF', borderRadius: 12, padding: '12px 24px', fontSize: 14, fontWeight: 600, color: '#1A4FBA', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> Add Missing Month
          </button>
        </div>
      </div>
    </AppLayout>
  );
}


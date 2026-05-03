import React, { useState } from 'react';
import './_shared/_group.css';
import { MOCK_USER, INCOME_TYPES, EXPENSE_CATEGORIES } from './_shared/mockData';
import { AppLayout } from './_shared/AppLayout';
import { Plus, Trash2, ArrowLeft, X, Check, Pencil } from 'lucide-react';

interface MasterItem { id: number; name: string; isSystem: boolean }

function buildItems(arr: string[]): MasterItem[] {
  return arr.map((name, i) => ({ id: i, name, isSystem: true }));
}

export function Masters() {
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [tab, setTab] = useState<'income' | 'expense'>('income');
  const [incomeItems, setIncomeItems] = useState<MasterItem[]>(buildItems(INCOME_TYPES));
  const [expenseItems, setExpenseItems] = useState<MasterItem[]>(buildItems(EXPENSE_CATEGORIES));
  const [showAddIncome, setShowAddIncome] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newIncomeName, setNewIncomeName] = useState('');
  const [newExpenseName, setNewExpenseName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<MasterItem | null>(null);
  const [tooltip, setTooltip] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<{ id: number; draft: string } | null>(null);

  const items = tab === 'income' ? incomeItems : expenseItems;
  const setItems = tab === 'income' ? setIncomeItems : setExpenseItems;

  const addItem = () => {
    const name = tab === 'income' ? newIncomeName : newExpenseName;
    if (!name.trim()) return;
    const newItem: MasterItem = { id: Date.now(), name: name.trim(), isSystem: false };
    setItems(prev => [...prev, newItem]);
    if (tab === 'income') { setNewIncomeName(''); setShowAddIncome(false); }
    else { setNewExpenseName(''); setShowAddExpense(false); }
  };

  const deleteItem = (item: MasterItem) => {
    if (item.isSystem) return;
    setItems(prev => prev.filter(i => i.id !== item.id));
    setConfirmDelete(null);
  };

  const startEdit = (item: MasterItem) => {
    setEditingItem({ id: item.id, draft: item.name });
    setTooltip(null);
  };

  const saveEdit = () => {
    if (!editingItem || !editingItem.draft.trim()) return;
    setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, name: editingItem.draft.trim() } : i));
    setEditingItem(null);
  };

  const cancelEdit = () => setEditingItem(null);

  if (navTarget) {
    const labels: Record<string, string> = { dashboard: 'Dashboard', entry: 'Monthly Entry', suggestions: 'Suggestions', reports: 'Reports', login: 'Logout' };
    return (
      <div style={{ minHeight: '100vh', background: '#F5F8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: 20, padding: '48px 64px', textAlign: 'center', boxShadow: '0 4px 24px rgba(26,79,186,0.1)', maxWidth: 420, border: '1px solid #D1E3FF' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#0F1E3C', marginBottom: 10 }}>Navigated to {labels[navTarget] || navTarget}</h2>
          <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>In the full app, this would take you there.</p>
          <button onClick={() => setNavTarget(null)} style={{ background: '#1A4FBA', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>← Back to Masters</button>
        </div>
      </div>
    );
  }

  const showAdd = tab === 'income' ? showAddIncome : showAddExpense;
  const setShowAdd = tab === 'income' ? setShowAddIncome : setShowAddExpense;
  const newName = tab === 'income' ? newIncomeName : newExpenseName;
  const setNewName = tab === 'income' ? setNewIncomeName : setNewExpenseName;

  return (
    <AppLayout currentPage="masters" onNavigate={setNavTarget} user={MOCK_USER}>
      <div style={{ animation: 'fadeSlideIn 0.3s ease', maxWidth: 800, margin: '0 auto' }}>
        <style>{`@keyframes fadeSlideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }`}</style>

        {/* Confirm delete modal */}
        {confirmDelete && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: '36px 40px', maxWidth: 380, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'fadeSlideIn 0.2s ease' }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#0F1E3C', marginBottom: 12 }}>Delete "{confirmDelete.name}"?</h3>
              <p style={{ color: '#64748B', fontSize: 14, marginBottom: 28 }}>This custom item will be permanently removed. This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, background: 'none', border: '1.5px solid #D1E3FF', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 600, color: '#64748B', cursor: 'pointer' }}>Cancel</button>
                <button onClick={() => deleteItem(confirmDelete)} style={{ flex: 1, background: '#EF4444', border: 'none', borderRadius: 10, padding: '11px', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>
            <span style={{ cursor: 'pointer', color: '#1A4FBA' }} onClick={() => setNavTarget('dashboard')}>Dashboard</span>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: '#0F1E3C' }}>Manage Masters</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: '#0F1E3C', marginBottom: 6 }}>Manage Masters</h1>
              <p style={{ color: '#64748B', fontSize: 14 }}>Add custom income types and expense categories for your entries.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setNavTarget('dashboard')} style={{ background: 'none', border: '1.5px solid #D1E3FF', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 600, color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ArrowLeft size={14} /> Dashboard
              </button>
              <button onClick={() => setNavTarget('entry')} style={{ background: '#1A4FBA', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Back to Entry Form
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #D1E3FF', boxShadow: '0 4px 16px rgba(26,79,186,0.06)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #D1E3FF', background: '#F5F8FF' }}>
            {[
              { key: 'income', label: `Income Types (${incomeItems.length})` },
              { key: 'expense', label: `Expense Categories (${expenseItems.length})` },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as 'income' | 'expense')}
                style={{ flex: 1, padding: '16px 24px', border: 'none', background: 'transparent', fontSize: 14, fontWeight: tab === t.key ? 700 : 500, color: tab === t.key ? '#1A4FBA' : '#64748B', cursor: 'pointer', borderBottom: tab === t.key ? '2px solid #1A4FBA' : '2px solid transparent', transition: 'all 0.15s', fontFamily: "'Inter', sans-serif" }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '24px' }}>
            {/* Items list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {items.map(item => {
                const isEditing = editingItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: isEditing ? '#EBF3FF' : '#F5F8FF', borderRadius: 12, border: `1px solid ${isEditing ? '#93C5FD' : '#E8F0FF'}`, transition: 'all 0.15s', gap: 12 }}
                    onMouseEnter={e => { if (!isEditing) (e.currentTarget as HTMLDivElement).style.background = '#EBF3FF'; }}
                    onMouseLeave={e => { if (!isEditing) (e.currentTarget as HTMLDivElement).style.background = '#F5F8FF'; }}
                  >
                    {isEditing ? (
                      /* ── Inline edit row ── */
                      <>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.isSystem ? '#94A3B8' : '#1A4FBA', flexShrink: 0 }} />
                        <input
                          autoFocus
                          value={editingItem!.draft}
                          onChange={e => setEditingItem(prev => prev ? { ...prev, draft: e.target.value } : null)}
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                          style={{ flex: 1, padding: '7px 12px', border: '1.5px solid #93C5FD', borderRadius: 8, fontSize: 14, fontFamily: "'Inter', sans-serif", color: '#0F1E3C', background: '#fff', outline: 'none', fontWeight: 500 }}
                        />
                        <button onClick={saveEdit} title="Save" style={{ width: 32, height: 32, borderRadius: 8, background: '#1A4FBA', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                          <Check size={14} />
                        </button>
                        <button onClick={cancelEdit} title="Cancel" style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: '1px solid #D1E3FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', flexShrink: 0 }}>
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      /* ── Normal row ── */
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.isSystem ? '#94A3B8' : '#1A4FBA', flexShrink: 0 }} />
                          <span style={{ fontSize: 14, color: '#0F1E3C', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {/* Badge */}
                          <div style={{ position: 'relative' }}>
                            <span
                              style={{ background: item.isSystem ? '#F1F5F9' : '#EBF3FF', color: item.isSystem ? '#64748B' : '#1A4FBA', border: `1px solid ${item.isSystem ? '#D1E3FF' : '#BFDBFE'}`, borderRadius: 999, padding: '3px 12px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, cursor: 'help' }}
                              onMouseEnter={() => setTooltip(item.id)}
                              onMouseLeave={() => setTooltip(null)}
                            >
                              {item.isSystem ? 'System' : 'Custom'}
                            </span>
                            {tooltip === item.id && (
                              <div style={{ position: 'absolute', bottom: '130%', right: 0, background: '#0F1E3C', color: '#fff', borderRadius: 8, padding: '6px 12px', fontSize: 12, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 10 }}>
                                {item.isSystem ? 'System items can be edited but not deleted' : 'Custom item — can be edited or deleted'}
                                <div style={{ position: 'absolute', bottom: -5, right: 16, width: 10, height: 10, background: '#0F1E3C', transform: 'rotate(45deg)' }} />
                              </div>
                            )}
                          </div>
                          {/* Edit button — available for ALL items */}
                          <button
                            onClick={() => startEdit(item)}
                            title="Edit name"
                            style={{ width: 32, height: 32, borderRadius: 8, background: '#EBF3FF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A4FBA', transition: 'all 0.15s' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#BFDBFE'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FF'; }}
                          >
                            <Pencil size={13} />
                          </button>
                          {/* Delete button — disabled for system items */}
                          <button
                            onClick={() => !item.isSystem && setConfirmDelete(item)}
                            disabled={item.isSystem}
                            title={item.isSystem ? 'System items cannot be deleted' : 'Delete'}
                            style={{ width: 32, height: 32, borderRadius: 8, background: item.isSystem ? '#F1F5F9' : '#FEE2E2', border: 'none', cursor: item.isSystem ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.isSystem ? '#CBD5E1' : '#EF4444', transition: 'all 0.15s' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add new */}
            {showAdd ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '16px', background: '#EBF3FF', borderRadius: 12, border: '1px solid #D1E3FF' }}>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder={`Enter ${tab === 'income' ? 'income type' : 'expense category'} name`}
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && addItem()}
                  style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #D1E3FF', borderRadius: 10, fontSize: 14, fontFamily: "'Inter', sans-serif", color: '#0F1E3C', background: '#fff', outline: 'none' }}
                />
                <button onClick={addItem} style={{ width: 36, height: 36, borderRadius: 10, background: '#1A4FBA', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Check size={16} />
                </button>
                <button onClick={() => { setShowAdd(false); setNewName(''); }} style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: '1px solid #D1E3FF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAdd(true)} style={{ width: '100%', background: 'none', border: '1.5px dashed #D1E3FF', borderRadius: 12, padding: '14px', color: '#1A4FBA', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s', fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FF'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#1A4FBA'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#D1E3FF'; }}>
                <Plus size={18} /> Add New {tab === 'income' ? 'Income Type' : 'Expense Category'}
              </button>
            )}

            <div style={{ marginTop: 20, padding: '12px 16px', background: '#F5F8FF', borderRadius: 10, fontSize: 13, color: '#64748B', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#94A3B8', flexShrink: 0 }} />
              <span>System items ({items.filter(i => i.isSystem).length}) — can be <strong style={{ color: '#1A4FBA' }}>edited</strong>, but not deleted.</span>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1A4FBA', flexShrink: 0, marginLeft: 8 }} />
              <span>Custom items ({items.filter(i => !i.isSystem).length}) — can be <strong style={{ color: '#1A4FBA' }}>edited</strong> or <strong style={{ color: '#EF4444' }}>deleted</strong>.</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

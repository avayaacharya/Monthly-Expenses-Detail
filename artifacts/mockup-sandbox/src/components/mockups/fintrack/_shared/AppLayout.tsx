import React, { useState } from 'react';
import { Menu, X, LogOut, Bell } from 'lucide-react';
import './_group.css';

interface AppLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: any;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

const NOTIFICATIONS = [
  { id: 1, title: 'May 2025 entry pending', body: 'You haven\'t logged this month\'s income & expenses yet.', time: '2h ago', unread: true },
  { id: 2, title: 'Strong savings in April!', body: 'You saved ₹40,000 — 42% savings rate. View investment tips.', time: '1d ago', unread: true },
  { id: 3, title: 'March summary ready', body: 'Your March 2025 financial report is now available.', time: '2d ago', unread: false },
];

export function AppLayout({ currentPage, onNavigate, user, children, headerRight }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);

  const unreadCount = NOTIFICATIONS.filter(n => n.unread && !readIds.includes(n.id)).length;

  const openNotif = () => {
    setNotifOpen(prev => !prev);
  };

  const markAllRead = () => setReadIds(NOTIFICATIONS.map(n => n.id));

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'entry', label: 'Entry' },
    { id: 'suggestions', label: 'Suggestions' },
    { id: 'reports', label: 'Reports' },
    { id: 'masters', label: 'Masters' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-[100dvh] bg-[var(--surface)] text-[var(--text-dark)] flex flex-col font-sans">
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('dashboard')}>
            <div className="w-8 h-8 rounded bg-[var(--primary)] text-white flex items-center justify-center font-bold text-lg">A</div>
            <span className="font-heading font-bold text-[var(--text-dark)] text-lg hidden sm:block">
              Acharya Technology <span className="text-[var(--text-muted)] font-normal mx-2">|</span> <span className="text-[var(--primary)]">FinTrack</span>
            </span>
            <span className="font-heading font-bold text-[var(--text-dark)] text-lg sm:hidden">
              FinTrack
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-sm font-medium transition-colors relative py-2 ${currentPage === item.id ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:text-[var(--text-dark)]'}`}
              >
                {item.label}
                {currentPage === item.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--primary)] rounded-full"></span>
                )}
              </button>
            ))}
            {headerRight && (
              <>
                <div className="h-6 w-px bg-[var(--border)] mx-1"></div>
                {headerRight}
              </>
            )}
            <div className="h-6 w-px bg-[var(--border)] mx-2"></div>
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={openNotif}
                  title="Notifications"
                  style={{ position: 'relative', width: 36, height: 36, borderRadius: 10, background: notifOpen ? '#EBF3FF' : 'transparent', border: notifOpen ? '1px solid #D1E3FF' : '1px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: notifOpen ? '#1A4FBA' : '#64748B', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (!notifOpen) { (e.currentTarget as HTMLButtonElement).style.background = '#F5F8FF'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#D1E3FF'; } }}
                  onMouseLeave={e => { if (!notifOpen) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent'; } }}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: '50%', background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', lineHeight: 1 }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown panel */}
                {notifOpen && (
                  <div
                    style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 340, background: '#fff', borderRadius: 16, border: '1px solid #D1E3FF', boxShadow: '0 16px 48px rgba(26,79,186,0.14)', zIndex: 200, overflow: 'hidden' }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #EBF3FF', background: '#F5F8FF' }}>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#0F1E3C' }}>Notifications</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} style={{ fontSize: 12, fontWeight: 600, color: '#1A4FBA', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Mark all read</button>
                        )}
                        <button onClick={() => setNotifOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center', padding: 0 }}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Notification list */}
                    <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                      {NOTIFICATIONS.map((n, idx) => {
                        const isUnread = n.unread && !readIds.includes(n.id);
                        return (
                          <div
                            key={n.id}
                            onClick={() => setReadIds(prev => [...prev, n.id])}
                            style={{ display: 'flex', gap: 12, padding: '14px 18px', cursor: 'pointer', background: isUnread ? '#F0F6FF' : '#fff', borderBottom: idx < NOTIFICATIONS.length - 1 ? '1px solid #EBF3FF' : 'none', transition: 'background 0.15s' }}
                            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#EBF3FF'}
                            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = isUnread ? '#F0F6FF' : '#fff'}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: isUnread ? '#1A4FBA' : '#CBD5E1', flexShrink: 0, marginTop: 6 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: isUnread ? 700 : 500, color: '#0F1E3C', marginBottom: 3 }}>{n.title}</div>
                              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, marginBottom: 4 }}>{n.body}</div>
                              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{n.time}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '12px 18px', borderTop: '1px solid #EBF3FF', textAlign: 'center' }}>
                      <span style={{ fontSize: 13, color: '#1A4FBA', fontWeight: 600, cursor: 'pointer' }}>View all notifications</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ width: 1, height: 24, background: '#D1E3FF' }} />
              <span className="text-sm font-medium text-[var(--text-dark)]">{user?.name}</span>
              <button 
                onClick={() => onNavigate('login')}
                className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors p-1"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </nav>

          <button 
            className="md:hidden p-2 text-[var(--text-muted)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div 
            className="absolute top-16 left-0 right-0 bg-white border-b border-[var(--border)] shadow-lg flex flex-col p-4 gap-2 animate-in slide-in-from-top-2"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-2 mb-2 bg-[var(--surface)] rounded-lg text-sm font-medium">
              Logged in as {user?.name}
            </div>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-left px-4 py-3 rounded-lg text-base font-medium ${currentPage === item.id ? 'bg-[var(--primary-light)] text-[var(--primary)]' : 'text-[var(--text-dark)] hover:bg-[var(--surface)]'}`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('login')}
              className="text-left px-4 py-3 rounded-lg text-base font-medium text-[var(--danger)] hover:bg-red-50 flex items-center gap-2 mt-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {children}
      </main>
    </div>
  );
}
import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import './_group.css';

interface AppLayoutProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: any;
  children: React.ReactNode;
}

export function AppLayout({ currentPage, onNavigate, user, children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="h-6 w-px bg-[var(--border)] mx-2"></div>
            <div className="flex items-center gap-3">
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
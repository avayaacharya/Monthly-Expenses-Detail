import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth";

const NOTIFICATIONS = [
  { id: 1, title: "May 2025 entry pending", body: "You haven't logged this month's income & expenses yet.", time: "2h ago", unread: true },
  { id: 2, title: "Strong savings in April!", body: "You saved ₹40,000 — 42% savings rate. View investment tips.", time: "1d ago", unread: true },
  { id: 3, title: "March summary ready", body: "Your March 2025 financial report is now available.", time: "2d ago", unread: false },
];

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "entry", label: "Entry", href: "/entry" },
  { id: "suggestions", label: "Suggestions", href: "/suggestions" },
  { id: "reports", label: "Reports", href: "/reports" },
  { id: "masters", label: "Masters", href: "/masters" },
];

interface AppLayoutProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export function AppLayout({ children, headerRight }: AppLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const unreadCount = NOTIFICATIONS.filter(n => n.unread && !readIds.includes(n.id)).length;
  const markAllRead = () => setReadIds(NOTIFICATIONS.map(n => n.id));

  const currentPage = navItems.find(n => location.startsWith(n.href))?.id ?? "";

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#F5F8FF" }}>
      <header style={{ background: "#fff", borderBottom: "1px solid #D1E3FF", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 8px rgba(26,79,186,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #1A4FBA, #2A7BDE)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>A</div>
            <span className="font-heading" style={{ fontWeight: 700, fontSize: 17, color: "#0F1E3C", display: "none" }} data-testid="nav-brand">
              Acharya Technology <span style={{ color: "#94A3B8", margin: "0 6px" }}>|</span> <span style={{ color: "#1A4FBA" }}>FinTrack</span>
            </span>
            <style>{`@media(min-width:640px){[data-testid="nav-brand"]{display:inline}}`}</style>
            <span className="font-heading" style={{ fontWeight: 700, fontSize: 17, color: "#1A4FBA", display: "inline" }} data-testid="nav-brand-mobile">FinTrack</span>
            <style>{`@media(min-width:640px){[data-testid="nav-brand-mobile"]{display:none}}`}</style>
          </Link>

          <nav className="hidden md:flex" style={{ alignItems: "center", gap: 4 }} data-testid="desktop-nav">
            {navItems.map(item => (
              <Link key={item.id} href={item.href} data-testid={`nav-${item.id}`}
                style={{ padding: "8px 14px", borderRadius: 8, fontSize: 14, fontWeight: currentPage === item.id ? 700 : 500, color: currentPage === item.id ? "#1A4FBA" : "#64748B", textDecoration: "none", transition: "all 0.15s", background: currentPage === item.id ? "#EBF3FF" : "transparent", position: "relative" }}>
                {item.label}
              </Link>
            ))}
            {headerRight && (
              <>
                <div style={{ width: 1, height: 24, background: "#D1E3FF", margin: "0 4px" }} />
                {headerRight}
              </>
            )}
            <div style={{ width: 1, height: 24, background: "#D1E3FF", margin: "0 8px" }} />

            {/* Notification Bell */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button data-testid="btn-notifications" onClick={() => setNotifOpen(p => !p)}
                style={{ position: "relative", width: 36, height: 36, borderRadius: 10, background: notifOpen ? "#EBF3FF" : "transparent", border: `1px solid ${notifOpen ? "#D1E3FF" : "transparent"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: notifOpen ? "#1A4FBA" : "#64748B", transition: "all 0.15s" }}>
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div data-testid="notifications-dropdown" style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, width: 340, background: "#fff", borderRadius: 16, border: "1px solid #D1E3FF", boxShadow: "0 16px 48px rgba(26,79,186,0.14)", zIndex: 200, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid #EBF3FF", background: "#F5F8FF" }}>
                    <span className="font-heading" style={{ fontSize: 14, fontWeight: 700, color: "#0F1E3C" }}>Notifications</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      {unreadCount > 0 && <button data-testid="btn-mark-all-read" onClick={markAllRead} style={{ fontSize: 12, fontWeight: 600, color: "#1A4FBA", background: "none", border: "none", cursor: "pointer" }}>Mark all read</button>}
                      <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", display: "flex", alignItems: "center" }}><X size={16} /></button>
                    </div>
                  </div>
                  <div style={{ maxHeight: 280, overflowY: "auto" }}>
                    {NOTIFICATIONS.map((n, idx) => {
                      const isUnread = n.unread && !readIds.includes(n.id);
                      return (
                        <div key={n.id} data-testid={`notification-${n.id}`} onClick={() => setReadIds(p => [...p, n.id])}
                          style={{ display: "flex", gap: 12, padding: "14px 18px", cursor: "pointer", background: isUnread ? "#F0F6FF" : "#fff", borderBottom: idx < NOTIFICATIONS.length - 1 ? "1px solid #EBF3FF" : "none", transition: "background 0.15s" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: isUnread ? "#1A4FBA" : "#CBD5E1", flexShrink: 0, marginTop: 6 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: isUnread ? 700 : 500, color: "#0F1E3C", marginBottom: 3 }}>{n.title}</div>
                            <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, marginBottom: 4 }}>{n.body}</div>
                            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{n.time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ padding: "12px 18px", borderTop: "1px solid #EBF3FF", textAlign: "center" }}>
                    <span style={{ fontSize: 13, color: "#1A4FBA", fontWeight: 600, cursor: "pointer" }}>View all notifications</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ width: 1, height: 24, background: "#D1E3FF" }} />
            <span style={{ fontSize: 14, fontWeight: 500, color: "#0F1E3C" }}>{user?.name}</span>
            <button data-testid="btn-logout" onClick={logout}
              style={{ padding: 6, background: "none", border: "none", cursor: "pointer", color: "#64748B", display: "flex", alignItems: "center", transition: "color 0.15s" }}
              title="Logout">
              <LogOut size={18} />
            </button>
          </nav>

          <button data-testid="btn-mobile-menu" className="flex md:hidden" onClick={() => setMobileOpen(p => !p)}
            style={{ padding: 8, background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)" }} onClick={() => setMobileOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ position: "absolute", top: 64, left: 0, right: 0, background: "#fff", borderBottom: "1px solid #D1E3FF", boxShadow: "0 8px 24px rgba(26,79,186,0.12)", display: "flex", flexDirection: "column", padding: 16, gap: 8 }}>
            <div style={{ padding: "10px 16px", background: "#F5F8FF", borderRadius: 10, fontSize: 13, fontWeight: 500, color: "#64748B", marginBottom: 4 }}>
              Logged in as <strong style={{ color: "#0F1E3C" }}>{user?.name}</strong>
            </div>
            {navItems.map(item => (
              <Link key={item.id} href={item.href} onClick={() => setMobileOpen(false)} data-testid={`mobile-nav-${item.id}`}
                style={{ padding: "12px 16px", borderRadius: 10, fontSize: 15, fontWeight: currentPage === item.id ? 700 : 500, color: currentPage === item.id ? "#1A4FBA" : "#0F1E3C", background: currentPage === item.id ? "#EBF3FF" : "transparent", textDecoration: "none", display: "block" }}>
                {item.label}
              </Link>
            ))}
            <button data-testid="btn-mobile-logout" onClick={() => { logout(); setMobileOpen(false); }}
              style={{ padding: "12px 16px", borderRadius: 10, fontSize: 15, fontWeight: 600, color: "#EF4444", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}

      <main style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%", padding: "24px", boxSizing: "border-box" }} className="animate-fade-slide-in">
        {children}
      </main>
    </div>
  );
}

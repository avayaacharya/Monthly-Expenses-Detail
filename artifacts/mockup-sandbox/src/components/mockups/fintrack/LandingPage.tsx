import React, { useState, useEffect, useRef } from 'react';
import './_shared/_group.css';
import { Cloud, Code2, BarChart3, Shield, Heart, BookOpen, Laptop, Wallet, TrendingUp, FileText, Lightbulb, CheckCircle, ChevronRight, Star } from 'lucide-react';

function useNavigation() {
  const [navTarget, setNavTarget] = useState<string | null>(null);
  return { navTarget, navigate: setNavTarget };
}

function NavAway({ target, onBack }: { target: string; onBack: () => void }) {
  const labels: Record<string, string> = { login: 'Employee Login', dashboard: 'Dashboard' };
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F1E3C 0%, #1A4FBA 100%)' }}>
      <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: '48px 64px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', maxWidth: 480 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EBF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <CheckCircle size={32} color="#1A4FBA" />
        </div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 700, color: '#0F1E3C', marginBottom: 12 }}>
          Navigating to {labels[target] || target}
        </h2>
        <p style={{ color: '#64748B', marginBottom: 32, fontSize: 15 }}>
          In the full app, you would now be redirected to the {labels[target] || target} page.
        </p>
        <button onClick={onBack} style={{ background: '#1A4FBA', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          ← Back to Landing
        </button>
      </div>
    </div>
  );
}

const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export function LandingPage() {
  const { navTarget, navigate } = useNavigation();
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(v => ({ ...v, [e.target.id]: true })); });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (navTarget) return <NavAway target={navTarget} onBack={() => navigate(null as any)} />;

  const services = [
    { icon: <Cloud size={28} />, title: 'Cloud & Infrastructure', desc: 'Scalable cloud solutions for enterprise workloads' },
    { icon: <Code2 size={28} />, title: 'Enterprise Software', desc: 'Custom software built for business complexity' },
    { icon: <BarChart3 size={28} />, title: 'Data Analytics', desc: 'Transform raw data into strategic insights' },
    { icon: <Shield size={28} />, title: 'Cybersecurity', desc: 'Protect assets with next-gen security frameworks' },
  ];

  const benefits = [
    { icon: <Heart size={22} />, title: 'Health Insurance', desc: 'Comprehensive medical coverage for employees and family' },
    { icon: <BookOpen size={22} />, title: 'Learning Allowance', desc: '₹50,000 annual budget for skills and certifications' },
    { icon: <Laptop size={22} />, title: 'Flexible Work', desc: 'Hybrid work model across all our 6 offices' },
    { icon: <Wallet size={22} />, title: 'Financial Wellness Tools', desc: 'FinTrack and more — built for our people' },
  ];

  const whyItems = [
    { icon: <TrendingUp size={32} />, title: 'Track Every Rupee', desc: 'Log your income sources and all expense categories in one place. Know exactly where your money goes each month.' },
    { icon: <FileText size={32} />, title: 'Smart Balance Reports', desc: 'Auto-calculated monthly balance with 6-month trend charts and downloadable PDF reports.' },
    { icon: <Lightbulb size={32} />, title: 'AI-Powered Investment Tips', desc: 'Rule-based investment suggestions tailored to your monthly savings balance — from RD to equity funds.' },
  ];

  const testimonials = [
    { name: 'Ananya Krishnan', role: 'Senior Developer, Bangalore', quote: 'FinTrack helped me realize I was overspending on subscriptions. I started a monthly SIP of ₹10,000 after three months of tracking.' },
    { name: 'Rohan Verma', role: 'Project Manager, Pune', quote: 'The investment suggestion feature is brilliant. It told me exactly how to split my surplus balance. No more guessing.' },
    { name: 'Meera Pillai', role: 'Data Analyst, Chennai', quote: 'Finally a tool designed for us. It understands Indian expense categories and gives advice in rupees. Love it!' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#0F1E3C', background: '#fff' }}>
      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #D1E3FF', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 12px rgba(26,79,186,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #1A4FBA, #2A7BDE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>A</div>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 18, color: '#0F1E3C' }}>Acharya Technology <span style={{ color: '#64748B', fontWeight: 400, margin: '0 6px' }}>|</span> <span style={{ color: '#1A4FBA' }}>FinTrack</span></span>
        </div>
        <button onClick={() => navigate('login')} style={{ background: 'linear-gradient(90deg, #1A4FBA, #2A7BDE)', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 12px rgba(26,79,186,0.25)', transition: 'all 0.2s' }}>
          Employee Login
        </button>
      </nav>

      {/* Hero */}
      <section ref={heroRef} style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0A1628 0%, #0F1E3C 40%, #1A3A80 70%, #1A4FBA 100%)', backgroundAttachment: 'fixed', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '80px 32px' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', top: '50%', left: '50%', transform: `translate(-50%, -50%) translateY(${scrollY * 0.2}px)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 900, height: 900, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)', top: '50%', left: '50%', transform: `translate(-50%, -50%) translateY(${scrollY * 0.1}px)`, pointerEvents: 'none' }} />
        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 720, transform: `translateY(${scrollY * 0.15}px)` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '6px 16px', marginBottom: 32, fontSize: 13, color: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            Now available to all Acharya Technology employees
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 56, fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px' }}>
            Smart Money,<br /><span style={{ background: 'linear-gradient(90deg, #0EA5E9, #38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smarter Life</span>
          </h1>
          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.7)', marginBottom: 12, fontWeight: 400 }}>
            Your Personal Finance Companion
          </p>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 48 }}>
            Log income, track expenses, and get smart investment advice — all in one place.{' '}
            <span onClick={() => navigate('login')} style={{ color: '#0EA5E9', cursor: 'pointer', textDecoration: 'underline' }}>Sign in to your account</span>
          </p>
          <button onClick={() => navigate('login')} style={{ background: 'linear-gradient(90deg, #0EA5E9, #2A7BDE)', color: '#fff', border: 'none', borderRadius: 14, padding: '18px 48px', fontSize: 18, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', boxShadow: '0 8px 32px rgba(14,165,233,0.35)', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            Get Started — Login <ChevronRight size={20} />
          </button>
          <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, textAlign: 'center' }}>
            {[{ v: '1,200+', l: 'Active Employees' }, { v: '6', l: 'Office Locations' }, { v: '₹2.4Cr', l: 'Savings Tracked' }].map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{s.v}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" data-animate style={{ padding: '96px 32px', background: '#F5F8FF', opacity: visible['about'] ? 1 : 0, transform: visible['about'] ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1A4FBA', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>About Us</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, marginBottom: 24, color: '#0F1E3C' }}>Powering Digital Transformation Globally</h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: '#64748B', maxWidth: 720, margin: '0 auto' }}>
            Acharya Technology is a leading IT services firm delivering digital transformation, cloud solutions, and enterprise software for global clients since 2005. With ~1,200 employees across 6 offices in India and abroad, we invest in tools that empower our people financially and professionally.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section id="services" data-animate style={{ padding: '96px 32px', background: '#fff', opacity: visible['services'] ? 1 : 0, transform: visible['services'] ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease 0.1s' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A4FBA', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>What We Do</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, color: '#0F1E3C' }}>Our Core Services</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {services.map(s => (
              <div key={s.title} style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(209,227,255,0.6)', boxShadow: '0 4px 24px rgba(26,79,186,0.08)', borderRadius: 20, padding: 32, transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(26,79,186,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 24px rgba(26,79,186,0.08)'; }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, #EBF3FF, #D1E8FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A4FBA', marginBottom: 20 }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 10, color: '#0F1E3C' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employee Benefits */}
      <section id="benefits" data-animate style={{ padding: '96px 32px', background: 'linear-gradient(135deg, #0F1E3C 0%, #1A4FBA 100%)', opacity: visible['benefits'] ? 1 : 0, transform: visible['benefits'] ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Employee First</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, color: '#fff', marginBottom: 12 }}>We Invest in Our People</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>Benefits designed to support your professional and personal growth</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {benefits.map(b => (
              <div key={b.title} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28, backdropFilter: 'blur(8px)', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'none'}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: 16 }}>{b.icon}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why FinTrack */}
      <section id="why" data-animate style={{ padding: '96px 32px', background: '#fff', opacity: visible['why'] ? 1 : 0, transform: visible['why'] ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A4FBA', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Why FinTrack</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, color: '#0F1E3C' }}>Built for How You Actually Live</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {whyItems.map((w, i) => (
              <div key={w.title} style={{ textAlign: 'center', padding: '40px 32px', borderRadius: 24, background: i === 1 ? 'linear-gradient(135deg, #EBF3FF, #D1E8FF)' : '#F5F8FF', border: `1px solid ${i === 1 ? '#D1E3FF' : '#E8F0FF'}`, transition: 'transform 0.2s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'none'}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: '#1A4FBA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', margin: '0 auto 24px' }}>{w.icon}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#0F1E3C' }}>{w.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" data-animate style={{ padding: '96px 32px', background: '#F5F8FF', opacity: visible['testimonials'] ? 1 : 0, transform: visible['testimonials'] ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A4FBA', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Testimonials</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 36, fontWeight: 800, color: '#0F1E3C' }}>What Employees Are Saying</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 24px rgba(26,79,186,0.06)', border: '1px solid #D1E3FF', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = 'none'}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: '#64748B', marginBottom: 24, fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1A4FBA, #2A7BDE)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#0F1E3C' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 32px', background: 'linear-gradient(90deg, #1A4FBA, #2A7BDE)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Start Tracking Your Finances Today</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32, fontSize: 16 }}>Log in with your employee credentials to access FinTrack.</p>
        <button onClick={() => navigate('login')} style={{ background: '#fff', color: '#1A4FBA', border: 'none', borderRadius: 12, padding: '16px 40px', fontSize: 17, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          Employee Login
        </button>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0F1E3C', padding: '48px 32px 32px', color: 'rgba(255,255,255,0.6)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#fff', fontSize: 18, marginBottom: 8 }}>Acharya Technology | FinTrack</div>
              <div style={{ fontSize: 13 }}>Empowering financial wellness since 2025</div>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {['Home', 'Employee Login', 'Contact HR'].map(link => (
                <span key={link} onClick={link === 'Employee Login' ? () => navigate('login') : undefined} style={{ fontSize: 14, cursor: link === 'Employee Login' ? 'pointer' : 'default', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLSpanElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLSpanElement).style.color = 'rgba(255,255,255,0.6)'}>
                  {link}
                </span>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, fontSize: 13, textAlign: 'center' }}>
            © 2025 Acharya Technology. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

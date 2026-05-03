import React, { useState } from 'react';
import './_shared/_group.css';
import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { LandingPage } from './LandingPage';

const MOCK_USERS: Record<string, { name: string; role: string }> = {
  'EMP001': { name: 'Ravi Shankar', role: 'EMPLOYEE' },
  'EMP002': { name: 'Priya Menon', role: 'EMPLOYEE' },
  'EMP003': { name: 'Arjun Das', role: 'EMPLOYEE' },
};

export function LoginPage() {
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotShown, setForgotShown] = useState(false);

  const resetForm = () => {
    setNavTarget(null);
    setLoggedInUser(null);
    setEmployeeId('');
    setPassword('');
    setShowPassword(false);
    setRememberMe(false);
    setError('');
    setForgotShown(false);
    setLoading(false);
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    const user = MOCK_USERS[employeeId.toUpperCase()];
    if (user && password === '1234') {
      setLoggedInUser(user.name);
      setTimeout(() => setNavTarget('dashboard'), 1500);
    } else {
      setError('Invalid Employee ID or password. Please try again.');
    }
  };

  if (navTarget === 'landing') {
    return (
      <div style={{ position: 'relative' }}>
        {/* Floating "Back to Login" pill — always visible while on landing */}
        <div style={{
          position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, display: 'flex', alignItems: 'center',
        }}>
          <button
            onClick={resetForm}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', color: '#1A4FBA',
              border: '1.5px solid #D1E3FF',
              borderRadius: 999, padding: '10px 22px',
              fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(26,79,186,0.18)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#EBF3FF';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 28px rgba(26,79,186,0.25)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#fff';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(26,79,186,0.18)';
            }}
          >
            <ArrowLeft size={15} /> Back to Login
          </button>
        </div>
        <LandingPage />
      </div>
    );
  }

  if (navTarget === 'dashboard') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F1E3C 0%, #1A4FBA 100%)' }}>
        <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 24, padding: '56px 72px', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', maxWidth: 440 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={40} color="#10B981" />
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 26, fontWeight: 800, color: '#0F1E3C', marginBottom: 10 }}>Login Successful!</h2>
          <p style={{ color: '#64748B', marginBottom: 8, fontSize: 16 }}>Welcome back, <strong>{loggedInUser}</strong></p>
          <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 36 }}>Redirecting to your dashboard...</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            {[1,2,3].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#1A4FBA', opacity: 0.3, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
          <button onClick={resetForm} style={{ marginTop: 32, background: 'transparent', color: '#64748B', border: 'none', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>← Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* Left Panel */}
      <div style={{ width: '40%', background: 'linear-gradient(160deg, #0A1628 0%, #0F1E3C 40%, #1A4FBA 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 320 }}>
          {/* Logo */}
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: "'Plus Jakarta Sans', sans-serif", backdropFilter: 'blur(8px)' }}>A</div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 8 }}>FinTrack</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 48 }}>by Acharya Technology</p>

          {/* Visual illustration */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', marginBottom: 40 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textAlign: 'left' }}>April 2025 Balance</div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#10B981', fontFamily: "'Plus Jakarta Sans', sans-serif", textAlign: 'left' }}>₹40,000</div>
            </div>
            {[{ l: 'Income', v: '₹95,000', c: '#0EA5E9', w: '100%' }, { l: 'Expenses', v: '₹55,000', c: '#F59E0B', w: '58%' }, { l: 'Balance', v: '₹40,000', c: '#10B981', w: '42%' }].map(b => (
              <div key={b.l} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}><span>{b.l}</span><span style={{ color: b.c, fontWeight: 600 }}>{b.v}</span></div>
                <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ width: b.w, height: '100%', borderRadius: 3, background: b.c, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6 }}>
            Track your monthly income and expenses. Get smart investment suggestions based on your savings.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F8FF', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <button onClick={() => setNavTarget('landing')} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, marginBottom: 40, padding: 0, fontFamily: "'Inter', sans-serif" }}>
            <ArrowLeft size={14} /> Back to Home
          </button>

          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 32, fontWeight: 800, color: '#0F1E3C', marginBottom: 8 }}>Welcome back</h2>
            <p style={{ color: '#64748B', fontSize: 15 }}>Sign in with your employee credentials to access FinTrack.</p>
          </div>

          <div style={{ background: '#fff', borderRadius: 20, padding: 36, boxShadow: '0 4px 24px rgba(26,79,186,0.08)', border: '1px solid #D1E3FF' }}>
            {/* Credentials hint */}
            <div style={{ background: '#EBF3FF', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#1A4FBA', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} />
              Demo: EMP001 / 1234 (or EMP002, EMP003 with same password)
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F1E3C', marginBottom: 8 }}>Employee ID or Email</label>
              <input
                type="text"
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                placeholder="e.g. EMP001"
                style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${error ? '#EF4444' : '#D1E3FF'}`, borderRadius: 10, fontSize: 15, fontFamily: "'Inter', sans-serif", outline: 'none', color: '#0F1E3C', background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => { e.target.style.borderColor = '#1A4FBA'; }}
                onBlur={e => { e.target.style.borderColor = error ? '#EF4444' : '#D1E3FF'; }}
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#0F1E3C', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  style={{ width: '100%', padding: '12px 48px 12px 16px', border: `1.5px solid ${error ? '#EF4444' : '#D1E3FF'}`, borderRadius: 10, fontSize: 15, fontFamily: "'Inter', sans-serif", outline: 'none', color: '#0F1E3C', background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#1A4FBA'; }}
                  onBlur={e => { e.target.style.borderColor = error ? '#EF4444' : '#D1E3FF'; }}
                />
                <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#EF4444', fontSize: 13, marginBottom: 8, padding: '8px 12px', background: '#FEE2E2', borderRadius: 8 }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#64748B' }}>
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ accentColor: '#1A4FBA' }} />
                Remember me
              </label>
              <button onClick={() => setForgotShown(true)} style={{ background: 'none', border: 'none', color: '#1A4FBA', fontSize: 13, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Forgot password?</button>
            </div>

            {forgotShown && (
              <div style={{ background: '#EBF3FF', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#1A4FBA', display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} /> Please contact HR at hr@acharyatech.com
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !employeeId || !password}
              style={{ width: '100%', background: loading || !employeeId || !password ? '#94A3B8' : 'linear-gradient(90deg, #1A4FBA, #2A7BDE)', color: '#fff', border: 'none', borderRadius: 12, padding: '15px', fontSize: 16, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif", cursor: loading || !employeeId || !password ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s', boxShadow: loading || !employeeId || !password ? 'none' : '0 4px 16px rgba(26,79,186,0.25)' }}
            >
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Signing in...</> : 'Sign In'}
            </button>
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
          </div>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748B', marginTop: 24 }}>
            Having trouble? Contact <span style={{ color: '#1A4FBA', cursor: 'pointer' }}>IT Support</span> or your HR representative.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Trophy, Heart, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function ThemeTogglePill() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle" 
      aria-label="Toggle theme" 
      style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}
    >
      <div className="theme-toggle-knob">{theme === 'dark' ? '🌙' : '☀️'}</div>
    </button>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  if (user) {
    const destination = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={destination} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const useAdminDemo = () => {
    setForm({ email: 'admin@golfplatform.com', password: 'Admin@123' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!form.password.trim()) {
      setError('Password is required');
      setLoading(false);
      return;
    }

    try {
      const res = await login({ email: form.email, password: form.password });
      
      if (res.data && res.data.token && res.data.user) {
        const { token, user } = res.data;
        loginUser(token, user);
        toast.success(`Welcome back, ${user.name || 'User'}! 🏌️`);
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(errorMsg);
      toast.error(errorMsg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg" style={{ minHeight: '100vh', display: 'flex' }}>

      {/* ── Left Panel (Branding) ─────────────────────────── */}
      <div
        style={{
          flex: 1,
          background: 'var(--grad-aurora)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px 56px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
        }}
        className="auth-branding-panel"
      >
        {/* Decorative blobs */}
        <div style={{ 
          position: 'absolute', 
          top: -80, 
          left: -80, 
          width: 280, 
          height: 280, 
          background: 'rgba(255,255,255,0.08)', 
          borderRadius: '50%' 
        }} />
        <div style={{ 
          position: 'absolute', 
          bottom: -120, 
          right: -60, 
          width: 360, 
          height: 360, 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '50%' 
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
            <div className="sidebar-logo-icon">⛳</div>
            <span style={{ fontWeight: 800, fontSize: '1.3rem', color: '#fff' }}>GolfWin</span>
          </div>

          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: 20 }}>
            Your game.<br />Your impact.<br />Your jackpot.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 48, fontSize: '1.05rem', lineHeight: 1.7 }}>
            Every Stableford score you log is an entry into a monthly draw — and a donation to a cause you care about.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { icon: Trophy, title: 'Win the Jackpot', desc: 'Match 5 numbers to claim the top prize — rolls over each month if unclaimed.' },
              { icon: Heart, title: 'Fund Charities', desc: 'Minimum 10% of your subscription goes directly to your chosen charity.' },
              { icon: ShieldCheck, title: 'Provably Fair', desc: 'All draws are admin-verified and fully transparent before payouts process.' },
            ].map((item) => (
              <div key={item.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 12, flexShrink: 0 }}>
                  <item.icon size={22} color="#fff" />
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form) ──────────────────────────────── */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '32px 24px', 
        position: 'relative', 
        background: 'var(--bg-base)' 
      }}>
        <ThemeTogglePill />

        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ marginBottom: 8, fontWeight: 700 }}>Welcome back</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Sign in to your GolfWin account</p>
          </div>

          <div className="glass-card" style={{ padding: '32px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <div style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Admin Access
              </div>
              <button
                type="button"
                onClick={useAdminDemo}
                className="btn btn-ghost"
                style={{ padding: '8px 12px', fontSize: '0.75rem', borderRadius: '999px' }}
              >
                Use Demo Admin
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Error Alert */}
              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--color-error)',
                  color: 'var(--color-error)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrap">
                  <span className="input-icon input-icon-l"><Mail size={18} /></span>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-input has-icon-l"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrap">
                  <span className="input-icon input-icon-l"><Lock size={18} /></span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-input has-icon-l has-icon-r"
                  />
                  <span
                    className="input-icon input-icon-r"
                    onClick={() => setShowPass(v => !v)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', gap: 8, cursor: 'pointer', color: 'var(--text-secondary)', alignItems: 'center' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--brand)' }} /> Remember me
                </label>
                <a href="#" style={{ color: 'var(--brand)', fontWeight: 600 }}>Forgot password?</a>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ width: '100%', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? <span className="spinner" style={{ marginRight: '8px' }} /> : null}
                {loading ? 'Signing in...' : <>Sign In <ChevronRight size={18} style={{ marginLeft: '8px' }} /></>}
              </button>
            </form>

            <div className="divider" style={{ margin: '24px 0' }} />

            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              New to GolfWin? <Link to="/register" style={{ fontWeight: 700, color: 'var(--brand)' }}>Create an account</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div style={{ 
            marginTop: 20, 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.14), rgba(6, 182, 212, 0.12))',
            border: '1px solid var(--border-brand)', 
            borderRadius: 'var(--r-md)', 
            padding: '12px 16px', 
            fontSize: '0.8rem', 
            textAlign: 'center', 
            color: 'var(--text-secondary)',
            boxShadow: '0 10px 30px rgba(93, 66, 196, 0.12)'
          }}>
            <strong style={{ color: 'var(--brand-vivid)' }}>Demo Admin:</strong> admin@golfplatform.com / Admin@123
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .auth-branding-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Trophy, Heart, ChevronRight } from 'lucide-react';
// animation removed to avoid unused import warnings
import toast from 'react-hot-toast';
import { login } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function ThemeTogglePill() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme" style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
      <div className="theme-toggle-knob">{theme === 'dark' ? '🌙' : '☀️'}</div>
    </button>
  );
}

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      const { token, user } = res.data;
      loginUser(token, user);
      toast.success(`Welcome back, ${user.name}! 🏌️`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg" style={{ minHeight: '100vh', display: 'flex' }}>

      {/* ── Left Panel (Branding) ─────────────────────────── */}
      <div
        style={{
          flex: 1, background: 'var(--grad-aurora)', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '48px 56px', position: 'relative', overflow: 'hidden',
          minHeight: '100vh',
        }}
        className="auth-branding-panel"
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 280, height: 280, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -120, right: -60, width: 360, height: 360, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

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
              { icon: Heart,  title: 'Fund Charities',  desc: 'Minimum 10% of your subscription goes directly to your chosen charity.' },
              { icon: ShieldCheck, title: 'Provably Fair', desc: 'All draws are admin-verified and fully transparent before payouts process.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 12, flexShrink: 0 }}>
                  {icon && icon({ size: 22, color: '#fff' })}
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, marginBottom: 4 }}>{title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form) ──────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', position: 'relative', background: 'var(--bg-base)' }}>
        <ThemeTogglePill />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ marginBottom: 8 }}>Welcome back</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Sign in to your GolfWin account</p>
          </div>

          <div className="glass-card" style={{ padding: '32px 28px' }}>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrap">
                  <span className="input-icon input-icon-l"><Mail size={18} /></span>
                  <input
                    type="email" name="email" required
                    placeholder="you@example.com"
                    value={form.email} onChange={handleChange}
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
                    type={showPass ? 'text' : 'password'} name="password" required
                    placeholder="••••••••"
                    value={form.password} onChange={handleChange}
                    className="form-input has-icon-l has-icon-r"
                  />
                  <span className="input-icon input-icon-r" onClick={() => setShowPass(v => !v)}>
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

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', fontSize: '1rem' }}>
                {loading ? <span className="spinner" /> : <>Sign In <ChevronRight size={18} /></>}
              </button>
            </form>

            <div className="divider" style={{ margin: '24px 0' }} />

            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              New to GolfWin? <Link to="/register" style={{ fontWeight: 700, color: 'var(--brand)' }}>Create an account</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div style={{ marginTop: 20, background: 'var(--brand-dim)', border: '1px solid var(--border-brand)', borderRadius: 'var(--r-md)', padding: '12px 16px', fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--brand-vivid)' }}>Demo Admin:</strong> admin@golfplatform.com / Admin@123
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .auth-branding-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

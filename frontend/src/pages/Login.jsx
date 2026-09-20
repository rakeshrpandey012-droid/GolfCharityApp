import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ShieldCheck, Trophy, Heart, ChevronRight, AlertCircle, CheckCircle, Loader } from 'lucide-react';
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

// ============================================
// SERVER HEALTH CHECK FUNCTION
// ============================================
const checkBackendHealth = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch('http://localhost:5000/api/health', {
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' }
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (err) {
    console.error('Health check error:', err);
    return false;
  }
};

// ============================================
// MAIN LOGIN COMPONENT
// ============================================
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [rememberMe, setRememberMe] = useState(false);
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  // ============================================
  // CHECK SERVER HEALTH ON COMPONENT MOUNT
  // ============================================
  useEffect(() => {
    const checkServer = async () => {
      console.log('🔍 Checking backend server health...');
      const isHealthy = await checkBackendHealth();
      
      if (isHealthy) {
        setServerStatus('online');
        console.log('✅ Backend server is online');
      } else {
        setServerStatus('offline');
        console.error('❌ Backend server is offline or not responding');
        setError('⚠️ Backend server is not responding. Make sure to start it with: npm run dev');
      }
    };

    checkServer();

    // Check server health every 30 seconds
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // REDIRECT IF ALREADY LOGGED IN
  // ============================================
  if (user) {
    const destination = user.role === 'admin' ? '/admin' : '/dashboard';
    return <Navigate to={destination} replace />;
  }

  // ============================================
  // FORM HANDLERS
  // ============================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user starts typing
  };

  const useAdminDemo = () => {
    setForm({ email: 'admin@golfplatform.com', password: 'Admin@123' });
    setError('');
  };

  // ============================================
  // FORM SUBMISSION
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
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

      // Check server status before attempting login
      if (serverStatus === 'offline') {
        setError('🔌 Backend server is not responding. Please start it with: npm run dev in the backend folder');
        toast.error('Server offline - cannot login');
        setLoading(false);
        return;
      }

      console.log('🔐 Attempting login for:', form.email);

      // Call login API with timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await login(
        { email: form.email, password: form.password },
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (res.data && res.data.token && res.data.user) {
        const { token, user } = res.data;
        loginUser(token, user);
        console.log('✅ Login successful!');
        toast.success(`Welcome back, ${user.name || 'User'}! 🏌️`);
        
        // Save remember me preference
        if (rememberMe) {
          localStorage.setItem('rememberEmail', form.email);
        } else {
          localStorage.removeItem('rememberEmail');
        }

        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('❌ Login error:', err);

      let errorMsg = 'Login failed. Please try again.';

      // Handle different error types
      if (err.name === 'AbortError') {
        errorMsg = '⏱️ Request timeout - Server is taking too long to respond. Make sure backend is running.';
      } else if (err.code === 'ECONNREFUSED' || err.message?.includes('Failed to fetch')) {
        errorMsg = '🔌 Cannot reach the server. Is backend running on port 5000? (npm run dev)';
      } else if (err.response?.status === 401) {
        errorMsg = '🔐 Invalid email or password. Please check your credentials.';
      } else if (err.response?.status === 404) {
        errorMsg = '❌ Server endpoint not found. Check your backend setup.';
      } else if (err.response?.status === 500) {
        errorMsg = '⚠️ Server error. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================
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
            
            {/* ──── SERVER STATUS INDICATOR ──── */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 14px',
              borderRadius: '8px',
              marginBottom: 20,
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: serverStatus === 'online' 
                ? 'rgba(34, 197, 94, 0.1)' 
                : serverStatus === 'offline'
                ? 'rgba(239, 68, 68, 0.1)'
                : 'rgba(59, 130, 246, 0.1)',
              color: serverStatus === 'online'
                ? '#22c55e'
                : serverStatus === 'offline'
                ? '#ef4444'
                : '#3b82f6',
              border: `1px solid ${
                serverStatus === 'online'
                  ? 'rgba(34, 197, 94, 0.3)'
                  : serverStatus === 'offline'
                  ? 'rgba(239, 68, 68, 0.3)'
                  : 'rgba(59, 130, 246, 0.3)'
              }`
            }}>
              {serverStatus === 'checking' && (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Checking server...</span>
                </>
              )}
              {serverStatus === 'online' && (
                <>
                  <CheckCircle size={16} />
                  <span>✅ Backend online</span>
                </>
              )}
              {serverStatus === 'offline' && (
                <>
                  <AlertCircle size={16} />
                  <span>❌ Backend offline</span>
                </>
              )}
            </div>

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
              
              {/* ──── ERROR ALERT ──── */}
              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid var(--color-error, #ef4444)',
                  color: 'var(--color-error, #ef4444)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'flex-start'
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    {error}
                    {error.includes('npm run dev') && (
                      <div style={{ marginTop: '8px', fontSize: '0.9rem', opacity: 0.9 }}>
                        <details style={{ cursor: 'pointer' }}>
                          <summary>💡 Need help?</summary>
                          <ul style={{ marginTop: '8px', paddingLeft: '20px', listStyle: 'disc' }}>
                            <li>Start backend: <code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '4px' }}>npm run dev</code> in backend folder</li>
                            <li>Check MongoDB is connected</li>
                            <li>Verify backend is on port 5000</li>
                          </ul>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ──── EMAIL FIELD ──── */}
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

              {/* ──── PASSWORD FIELD ──── */}
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
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    style={{ accentColor: 'var(--brand)' }} 
                  /> 
                  Remember me
                </label>
                <a href="#forgot" style={{ color: 'var(--brand)', fontWeight: 600 }}>Forgot password?</a>
              </div>

              {/* ──── SUBMIT BUTTON ──── */}
              <button 
                type="submit" 
                disabled={loading || serverStatus === 'offline'} 
                className="btn btn-primary" 
                style={{ 
                  width: '100%', 
                  fontSize: '1rem', 
                  opacity: (loading || serverStatus === 'offline') ? 0.6 : 1,
                  cursor: (loading || serverStatus === 'offline') ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? (
                  <>
                    <Loader size={18} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In <ChevronRight size={18} style={{ marginLeft: '8px' }} />
                  </>
                )}
              </button>
            </form>

            <div className="divider" style={{ margin: '24px 0' }} />

            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              New to GolfWin? <Link to="/register" style={{ fontWeight: 700, color: 'var(--brand)' }}>Create an account</Link>
            </p>
          </div>

          {/* ──── DEMO CREDENTIALS ──── */}
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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

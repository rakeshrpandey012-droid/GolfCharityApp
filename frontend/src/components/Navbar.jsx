import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GlowButton from './GlowButton';
import { Menu, X, Moon, Sun } from 'lucide-react';

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Prizes', id: 'prizes' },
    { label: 'Charities', id: 'charities' },
    { label: 'Pricing', id: 'pricing' },
  ];

  const handleNavClick = (id) => {
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <nav className="navbar" style={{ padding: '0 20px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', height: 64,
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 800,
              boxShadow: '0 0 20px rgba(59,130,246,0.4)',
              flexShrink: 0,
            }}>
              ⛳
            </div>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Golf<span className="gradient-text">Win</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="navbar-links">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                style={{
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="navbar-auth">
            <button
              onClick={toggleTheme}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                marginRight: '8px',
                borderRadius: '50%'
              }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {user ? (
              <>
                <GlowButton variant="ghost" size="sm" onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')}>Dashboard</GlowButton>
                <GlowButton size="sm" onClick={logoutUser}>Logout</GlowButton>
              </>
            ) : (
              <>
                <GlowButton variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</GlowButton>
                <GlowButton size="sm" onClick={() => navigate('/register')}>Get Started</GlowButton>
              </>
            )}
          </div>

          {/* Hamburger – mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'white', padding: 8, borderRadius: 8,
              display: 'none', alignItems: 'center', justifyContent: 'center',
              minWidth: 44, minHeight: 44,
            }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)', zIndex: 49,
              }}
            />
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed', top: 64, left: 0, right: 0, zIndex: 50,
                background: 'rgba(5,5,16,0.97)', backdropFilter: 'blur(24px)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                padding: '24px 20px 32px',
                display: 'flex', flexDirection: 'column', gap: 8,
              }}
            >
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: 'none', border: 'none',
                    color: 'var(--text-secondary)', textAlign: 'left',
                    fontSize: '1.05rem', fontWeight: 500, cursor: 'pointer',
                    padding: '14px 16px', borderRadius: 12,
                    transition: 'all 0.2s', minHeight: 44,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {link.label}
                </button>
              ))}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />

              {user ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <GlowButton variant="ghost" style={{ width: '100%', minHeight: 48 }} onClick={() => { setMenuOpen(false); navigate(user.role === 'admin' ? '/admin' : '/dashboard'); }}>Dashboard</GlowButton>
                  <GlowButton style={{ width: '100%', minHeight: 48 }} onClick={() => { setMenuOpen(false); logoutUser(); }}>Logout</GlowButton>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <GlowButton variant="ghost" style={{ width: '100%', minHeight: 48 }} onClick={() => { setMenuOpen(false); navigate('/login'); }}>Login</GlowButton>
                  <GlowButton style={{ width: '100%', minHeight: 48 }} onClick={() => { setMenuOpen(false); navigate('/register'); }}>Get Started</GlowButton>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

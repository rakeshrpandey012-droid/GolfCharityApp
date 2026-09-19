import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Trophy, Heart, ShieldCheck, ChevronRight, Menu, X, Star, Zap, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function ThemeTogglePill() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
      <div className="theme-toggle-knob">{theme === 'dark' ? '🌙' : '☀️'}</div>
    </button>
  );
}

const NAV_LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Prizes',       href: '#prizes' },
  { label: 'Charities',    href: '#charities' },
  { label: 'Pricing',      href: '/pricing' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <div className="page-bg" style={{ minHeight: '100vh' }}>

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className="navbar" style={{ boxShadow: scrolled ? 'var(--shadow-md)' : 'none' }}>
        <div className="navbar-inner">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div className="sidebar-logo-icon" style={{ width: 36, height: 36, fontSize: '1.1rem', borderRadius: 9 }}>⛳</div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              Golf<span className="gradient-text">Win</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {NAV_LINKS.map(({ label, href }) =>
              href.startsWith('/') ? (
                <Link key={label} to={href} style={{ padding: '6px 14px', borderRadius: 8, color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem', transition: 'color 0.2s' }}>
                  {label}
                </Link>
              ) : (
                <a key={label} href={href} style={{ padding: '6px 14px', borderRadius: 8, color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.875rem', transition: 'color 0.2s' }}>
                  {label}
                </a>
              )
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeTogglePill />
            <Link to="/login"
              className="navbar-auth-btns"
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s' }}
            >
              Log In
            </Link>
            <button
              onClick={() => navigate('/register')}
              className="btn btn-primary navbar-auth-btns"
              style={{ padding: '8px 20px', minHeight: 'unset', fontSize: '0.875rem' }}
            >
              Get Started
            </button>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(v => !v)}
              style={{ display: 'none', background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text-primary)' }}
              className="mobile-hamburger"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER MENU ───────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <div
              key="mobile-overlay"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 99 }}
            />
            <div
              key="mobile-drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '80%', maxWidth: 360,
                background: 'var(--bg-elevated)', borderLeft: '1px solid var(--border)',
                backdropFilter: 'blur(24px)', zIndex: 100,
                display: 'flex', flexDirection: 'column', padding: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="sidebar-logo-icon" style={{ width: 32, height: 32, fontSize: '1rem', borderRadius: 8 }}>⛳</div>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Golf<span className="gradient-text">Win</span></span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text-primary)', display: 'flex' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {NAV_LINKS.map(({ label, href }) =>
                  href.startsWith('/') ? (
                    <Link key={label} to={href} onClick={() => setMobileMenuOpen(false)}
                      style={{ display: 'block', padding: '14px 18px', borderRadius: 'var(--r-md)', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
                      {label}
                    </Link>
                  ) : (
                    <a key={label} href={href} onClick={() => setMobileMenuOpen(false)}
                      style={{ display: 'block', padding: '14px 18px', borderRadius: 'var(--r-md)', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
                      {label}
                    </a>
                  )
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  style={{ display: 'block', padding: '14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', textAlign: 'center' }}>
                  Log In
                </Link>
                <button onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                  className="btn btn-primary" style={{ width: '100%', fontSize: '1rem' }}>
                  Get Started Free →
                </button>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                  <ThemeTogglePill />
                </div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ paddingTop: '140px', paddingBottom: '100px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="hero-badge" style={{ marginBottom: 32 }}>
              🏆 Monthly Jackpot Draws · Charity-First Platform
            </div>
            <h1 style={{ marginBottom: 24, maxWidth: 700, margin: '0 auto 24px' }}>
              Golf, Win Big,<br />
              <span className="gradient-text-animated">Fund Good Causes</span>
            </h1>
            <p style={{ fontSize: '1.15rem', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7 }}>
              Log your Stableford scores to enter monthly prize draws. A guaranteed 10% of every subscription goes straight to the charity you choose.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 32px', minHeight: 'unset' }}>
                Start Playing Free <ChevronRight size={18} />
              </button>
              <a href="#how-it-works" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px', minHeight: 'unset' }}>
                How It Works
              </a>
            </div>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginTop: 48 }}>
            {[
              { icon: ShieldCheck, label: 'Verified & Secure' },
              { icon: Star,        label: 'Rated 4.9/5' },
              { icon: Users,       label: '2,400+ Golfers' },
              { icon: Zap,         label: 'Instant Payouts' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                <item.icon size={14} color="var(--brand-vivid)" /> {item.label}
              </div>
            ))}
          </div>

          {/* Hero stats strip */}
          <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap', marginTop: 72, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
            {[
              { label: 'Active Golfers',     value: '2,400+' },
              { label: 'Monthly Prize Pool', value: '£14,480' },
              { label: 'Donated to Charity', value: '£84,200+' },
              { label: 'Verified Charities', value: '12' },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '80px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2>Three Steps to Win</h2>
            <p style={{ marginTop: 12, maxWidth: 480, margin: '12px auto 0' }}>Simple as your golf game — just better rewards.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {[
              { icon: '🎯', step: '01', title: 'Join & Pick a Cause', desc: 'Register, subscribe, and select the charity your 10% contribution will support each month.' },
              { icon: '⛳', step: '02', title: 'Log Your Scores', desc: 'Enter your five latest Stableford scores (1–45) through your dashboard. Your most recent five are always used.' },
              { icon: '🏆', step: '03', title: 'Match & Collect', desc: 'If your scores match the monthly drawn numbers, you win your share of the prize pool. 3, 4, or 5 matches pay out.' },
            ].map(({ icon, step, title, desc }) => (
              <div
                key={step}
                className="glass-card"
                style={{ padding: 32, position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--brand-vivid)', marginBottom: 16, textTransform: 'uppercase' }}>Step {step}</div>
                <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{icon}</div>
                <h3 style={{ marginBottom: 12 }}>{title}</h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>{desc}</p>
                <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '5rem', opacity: 0.04, fontWeight: 900 }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIZE TIERS ────────────────────────────────────── */}
      <section id="prizes" style={{ padding: '80px 0', position: 'relative', zIndex: 1, background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2>Prize Pool Tiers</h2>
            <p style={{ marginTop: 12 }}>Match more numbers, win a bigger share of the monthly pool.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, maxWidth: 900, margin: '0 auto' }}>
            {[
              { pct: '40%', match: '5-Number Match', desc: 'Jackpot — rolls over if no winner', color: 'var(--warning)', glow: 'rgba(245,158,11,0.3)', border: 'rgba(245,158,11,0.3)' },
              { pct: '35%', match: '4-Number Match', desc: 'Second Tier Prize', color: 'var(--brand-vivid)', glow: 'rgba(99,102,241,0.3)', border: 'rgba(99,102,241,0.3)' },
              { pct: '25%', match: '3-Number Match', desc: 'Third Tier Prize', color: 'var(--accent)', glow: 'rgba(6,182,212,0.3)', border: 'rgba(6,182,212,0.3)' },
            ].map(({ pct, match, desc, color, glow, border }) => (
              <div
                key={pct}
                className="glass-card hoverable"
                style={{ padding: 36, textAlign: 'center', border: `1px solid ${border}`, boxShadow: `0 8px 32px ${glow}` }}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              >
                <div style={{ fontSize: '3rem', fontWeight: 900, color, marginBottom: 12, lineHeight: 1 }}>{pct}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{match}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHARITIES ─────────────────────────────────────── */}
      <section id="charities" style={{ padding: '80px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--success-dim)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--r-full)', padding: '4px 12px', marginBottom: 20, fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ♻️ Transparent Impact
              </div>
              <h2 style={{ marginBottom: 20 }}>Your Game Funds Real Change</h2>
              <p style={{ lineHeight: 1.8, marginBottom: 32 }}>
                Every subscription automatically donates a minimum 10% to your chosen verified charity. Watch community impact grow in real time on your dashboard.
              </p>
              <button onClick={() => navigate('/register')} className="btn btn-primary">
                Join the Mission <ChevronRight size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { name: 'Cancer Research UK',  amount: '£34,200', pct: 72 },
                { name: 'Mental Health Support', amount: '£28,500', pct: 60 },
                { name: 'Child Welfare Fund',   amount: '£21,800', pct: 46 },
              ].map(({ name, amount, pct }) => (
                <div key={name} className="glass-card" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{name}</span>
                    <span style={{ fontWeight: 700, color: 'var(--success)' }}>{amount}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill green"
                      initial={{ width: 0 }} whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section style={{ padding: '80px 0', position: 'relative', zIndex: 1, background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2>What Our Golfers Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { name: 'James T.', handle: '@james_golfer', text: 'Won my first £140 on a 3-match in only my second month. The charity donation tracking is a brilliant feature.', stars: 5 },
              { name: 'Sarah M.', handle: '@smacmillan', text: 'Finally a platform that ties golf to something meaningful. My Cancer Research UK total is now £62.50 and counting!', stars: 5 },
              { name: 'Robert K.', handle: '@rob_k82', text: 'The dashboard is slick and everything just works. Managed to log all 5 scores within minutes of signing up.', stars: 5 },
            ].map(({ name, handle, text, stars }) => (
              <div
                key={name}
                className="glass-card"
                style={{ padding: 28 }}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              >
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} size={14} fill="var(--warning)" color="var(--warning)" />
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>{`"${text}"`}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--grad-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>
                    {name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ background: 'var(--grad-brand)', borderRadius: 'var(--r-xl)', padding: '64px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'absolute', bottom: -80, left: -40, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ color: '#fff', marginBottom: 16 }}>Ready to Tee Off?</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px', fontSize: '1.05rem' }}>
                Join thousands of golfers making a real-world impact while competing for life-changing prizes.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/register')} className="btn" style={{ background: '#fff', color: 'var(--brand)', fontWeight: 700, padding: '14px 36px', fontSize: '1rem', minHeight: 'unset' }}>
                  Create Free Account →
                </button>
                <Link to="/pricing" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600, padding: '14px 28px', fontSize: '1rem', minHeight: 'unset' }}>
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 0', position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="sidebar-logo-icon" style={{ width: 32, height: 32, fontSize: '1rem', borderRadius: 8 }}>⛳</div>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Golf<span className="gradient-text">Win</span></span>
            </div>
            <div style={{ display: 'flex', gap: 24, fontSize: '0.85rem' }}>
              <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy</a>
              <a href="#" style={{ color: 'var(--text-muted)' }}>Terms</a>
              <a href="#" style={{ color: 'var(--text-muted)' }}>Contact</a>
              <Link to="/pricing" style={{ color: 'var(--text-muted)' }}>Pricing</Link>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>© 2026 GolfWin. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .mobile-hamburger { display: flex !important; }
          .navbar-auth-btns { display: none !important; }
          .navbar-links { display: none !important; }
        }
      `}</style>
    </div>
  );
}

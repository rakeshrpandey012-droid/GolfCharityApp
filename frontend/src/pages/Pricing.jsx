import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function ThemeTogglePill({ style }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme" style={style}>
      <div className="theme-toggle-knob">{theme === 'dark' ? '🌙' : '☀️'}</div>
    </button>
  );
}

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '£9.99',
    per: '/mo',
    desc: 'Perfect for getting started and entering monthly draws.',
    features: ['Enter 1 draw per month', '10% Charity Donation', 'Score Tracking Dashboard', 'Email Support'],
    cta: 'Subscribe Monthly',
    highlight: false,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '£99.99',
    per: '/yr',
    savings: 'Save £19.89 vs Monthly',
    desc: 'Maximum value — all 12 monthly draws included.',
    features: ['Enter all 12 monthly draws', 'Guaranteed 10% Charity Share', 'Priority Support Access', 'Early Draw Results'],
    cta: 'Subscribe Yearly',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'proplus',
    name: 'Pro Plus',
    price: '£19.99',
    per: '/mo',
    desc: 'For dedicated golfers who want maximum impact and benefits.',
    features: ['Everything in Standard', '20% Charity Donation', 'Exclusive Founder Badge', 'Dedicated Account Manager'],
    cta: 'Get Pro Plus',
    highlight: false,
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 80, paddingBottom: 80 }}>
      <ThemeTogglePill style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }} />

      {/* Back link */}
      <div className="container" style={{ marginBottom: 0 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 32 }}>
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>

      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <div style={{ display: 'inline-block', background: 'var(--brand-dim)', border: '1px solid var(--border-brand)', borderRadius: 'var(--r-full)', padding: '5px 16px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-vivid)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>
            Transparent Pricing
          </div>
          <h2 style={{ marginBottom: 16 }}>Choose Your Plan</h2>
          <p style={{ maxWidth: 500, margin: '0 auto', fontSize: '1.05rem' }}>
            Every plan funds verified charities and enters you into the monthly jackpot draw.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ position: 'relative' }}
            >
              {plan.badge && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--brand)', color: '#fff', padding: '4px 14px', borderRadius: 'var(--r-full)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', zIndex: 2 }}>
                  {plan.badge}
                </div>
              )}
              <div
                className="glass-card"
                style={{
                  padding: '32px 28px',
                  display: 'flex', flexDirection: 'column',
                  height: '100%',
                  border: plan.highlight ? '2px solid var(--brand)' : '1px solid var(--border)',
                  boxShadow: plan.highlight ? 'var(--shadow-brand)' : 'var(--shadow-sm)',
                }}
              >
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ marginBottom: 8, color: plan.highlight ? 'var(--brand-vivid)' : 'var(--text-primary)' }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: '2.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>{plan.price}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{plan.per}</span>
                  </div>
                  {plan.savings && (
                    <span style={{ display: 'inline-block', background: 'var(--success-dim)', color: 'var(--success)', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--r-full)', marginBottom: 10 }}>
                      {plan.savings}
                    </span>
                  )}
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{plan.desc}</p>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--success-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <Check size={12} color="var(--success)" strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate(`/checkout-simulation?plan=${plan.id}`)}
                  className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ width: '100%', fontSize: '0.95rem' }}
                >
                  {plan.cta} <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 700, margin: '80px auto 0' }}>
          <h3 style={{ textAlign: 'center', marginBottom: 32, fontSize: '1.4rem' }}>Common Questions</h3>
          {[
            { q: 'How is the charity donation calculated?', a: 'The stated percentage is automatically deducted from your subscription fee every billing cycle and routed to your chosen charity. You can track your lifetime impact on your dashboard.' },
            { q: 'Can I change my plan at any time?', a: 'Yes — you can upgrade, downgrade, or cancel at any time from your account settings. Changes take effect at the start of your next billing cycle.' },
            { q: 'What happens if no one wins the jackpot?', a: 'The 40% jackpot pool rolls over to the next month and accumulates until someone matches all 5 numbers.' },
          ].map(({ q, a }) => (
            <div key={q} className="glass-card" style={{ padding: '20px 24px', marginBottom: 12 }}>
              <h4 style={{ marginBottom: 8, fontSize: '0.95rem' }}>{q}</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

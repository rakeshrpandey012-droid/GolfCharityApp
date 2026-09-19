import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Check, Crown, Zap, Shield, ChevronRight,
  AlertCircle, RefreshCw, XCircle, ArrowUpRight, Gift,
  Star, Clock, CheckCircle2, TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getMySubscription, cancelSubscription, renewSubscription } from '../../api/api';

/* ── Plan Definitions ─────────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '£0',
    per: '/mo',
    icon: Gift,
    color: 'var(--text-secondary)',
    gradient: 'linear-gradient(135deg, #4B5773 0%, #6B7280 100%)',
    features: [
      { text: 'View draw results', included: true },
      { text: 'Community leaderboard', included: true },
      { text: 'Enter monthly draws', included: false },
      { text: 'Charity donations', included: false },
      { text: 'Score tracking', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Current Free Plan',
    highlight: false,
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: '£9.99',
    per: '/mo',
    icon: Zap,
    color: 'var(--brand-vivid)',
    gradient: 'var(--grad-brand)',
    features: [
      { text: 'View draw results', included: true },
      { text: 'Community leaderboard', included: true },
      { text: 'Enter monthly draws', included: true },
      { text: '10% Charity donations', included: true },
      { text: 'Score tracking dashboard', included: true },
      { text: 'Priority support', included: false },
    ],
    cta: 'Get Pro Monthly',
    highlight: false,
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: '£99.99',
    per: '/yr',
    savings: 'Save £19.89',
    icon: Crown,
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 50%, #EC4899 100%)',
    features: [
      { text: 'View draw results', included: true },
      { text: 'Community leaderboard', included: true },
      { text: 'Enter all 12 draws', included: true },
      { text: '10% Charity donations', included: true },
      { text: 'Score tracking dashboard', included: true },
      { text: 'Priority support', included: true },
    ],
    cta: 'Get Pro Yearly',
    highlight: true,
    badge: '⭐ Best Value',
  },
  {
    id: 'proplus',
    name: 'Enterprise',
    price: '£19.99',
    per: '/mo',
    icon: Shield,
    color: 'var(--accent)',
    gradient: 'var(--grad-green)',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Community leaderboard', included: true },
      { text: 'Enter all monthly draws', included: true },
      { text: '20% Charity donations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Exclusive Founder Badge', included: true },
    ],
    cta: 'Get Enterprise',
    highlight: false,
  },
];

/* ── Payment History (mock) ────────────────────────────────────────────────── */
const MOCK_HISTORY = [
  { id: 'INV-2026-09', date: 'Sep 2026', plan: 'Pro Monthly', amount: '£9.99', status: 'paid' },
  { id: 'INV-2026-08', date: 'Aug 2026', plan: 'Pro Monthly', amount: '£9.99', status: 'paid' },
  { id: 'INV-2026-07', date: 'Jul 2026', plan: 'Pro Monthly', amount: '£9.99', status: 'paid' },
  { id: 'INV-2026-06', date: 'Jun 2026', plan: 'Pro Monthly', amount: '£9.99', status: 'paid' },
];

/* ── Helpers ───────────────────────────────────────────────────────────────── */
function PlanIcon({ Icon, gradient, size = 22 }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: gradient, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}>
      <Icon size={size} color="#fff" />
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    active:    { bg: 'var(--success-dim)', color: 'var(--success)', label: '● Active' },
    inactive:  { bg: 'var(--danger-dim)',  color: 'var(--danger)',  label: '● Inactive' },
    cancelled: { bg: 'var(--warning-dim)', color: 'var(--warning)', label: '● Cancelled' },
    paid:      { bg: 'var(--success-dim)', color: 'var(--success)', label: '✓ Paid' },
  };
  const s = map[status] || map.inactive;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: s.bg, color: s.color, padding: '4px 12px',
      borderRadius: 'var(--r-full)', fontSize: '0.72rem', fontWeight: 700,
    }}>
      {s.label}
    </span>
  );
}

/* ── Main Component ────────────────────────────────────────────────────────── */
export default function Subscription() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sub, setSub]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [renewing, setRenewing] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [activeTab, setActiveTab] = useState('plan'); // 'plan' | 'history' | 'compare'

  useEffect(() => {
    getMySubscription()
      .then(r => setSub(r.data))
      .catch(() => setSub(null))
      .finally(() => setLoading(false));
  }, []);

  const activePlanId = sub?.plan || (user?.subscriptionStatus === 'active' ? 'monthly' : 'free');
  const activePlan   = PLANS.find(p => p.id === activePlanId) || PLANS[0];
  const isActive     = sub?.status === 'active' || user?.subscriptionStatus === 'active';

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelSubscription();
      toast.success('Subscription cancelled. Access continues until period end.');
      setSub(s => ({ ...s, status: 'cancelled' }));
    } catch {
      toast.error('Could not cancel. Please try again.');
    } finally {
      setCancelling(false);
      setShowCancel(false);
    }
  };

  const handleRenew = async () => {
    setRenewing(true);
    try {
      await renewSubscription();
      toast.success('Subscription renewed! 🎉');
      setSub(s => ({ ...s, status: 'active' }));
    } catch {
      toast.error('Renewal failed. Please try again.');
    } finally {
      setRenewing(false);
    }
  };

  /* ── Loading skeleton ──────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ height: 32, width: 200, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 180, borderRadius: 16, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 320, borderRadius: 16 }} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ── Page Header ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}
      >
        <div>
          <h2 style={{ marginBottom: 4 }}>Subscription</h2>
          <p>Manage your plan, billing, and payment history.</p>
        </div>
        {!isActive && (
          <button onClick={() => navigate('/pricing')} className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
            Upgrade Plan <ChevronRight size={16} />
          </button>
        )}
      </motion.div>

      {/* ── Active Plan Card ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="glass-card"
        style={{
          padding: 28, marginBottom: 32, overflow: 'hidden', position: 'relative',
          border: isActive ? '1px solid var(--border-brand)' : '1px solid var(--border)',
        }}
      >
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 240, height: 240,
          background: activePlan.gradient, borderRadius: '50%', opacity: 0.06, filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <PlanIcon Icon={activePlan.icon} gradient={activePlan.gradient} />
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>
                Current Plan
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {activePlan.name}
                </span>
                <StatusPill status={isActive ? 'active' : 'inactive'} />
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                {isActive
                  ? `Renews ${sub?.renewsAt ? new Date(sub.renewsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'next month'}`
                  : 'No active subscription — upgrade to enter draws'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {isActive && sub?.status !== 'cancelled' && (
              <button onClick={() => setShowCancel(true)} className="btn btn-secondary" style={{ fontSize: '0.85rem', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }}>
                <XCircle size={16} /> Cancel
              </button>
            )}
            {(!isActive || sub?.status === 'cancelled') && (
              <button onClick={handleRenew} disabled={renewing} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                {renewing ? <span className="spinner" /> : <><RefreshCw size={16} /> Reactivate</>}
              </button>
            )}
            <button onClick={() => navigate('/pricing')} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              <ArrowUpRight size={16} /> {isActive ? 'Change Plan' : 'Subscribe'}
            </button>
          </div>
        </div>

        {/* Stats row */}
        {isActive && (
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Member Since', value: sub?.createdAt ? new Date(sub.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : 'Sep 2026', icon: Star },
              { label: 'Draws Entered', value: sub?.drawsEntered ?? '12', icon: TrendingUp },
              { label: 'Charity Donated', value: sub?.charityTotal ? `£${Number(sub.charityTotal).toFixed(2)}` : '£84.00', icon: CheckCircle2 },
              { label: 'Next Billing', value: sub?.renewsAt ? new Date(sub.renewsAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '1 Oct 2026', icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={15} color="var(--brand-vivid)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Tab Nav ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--bg-subtle)', padding: 4, borderRadius: 'var(--r-md)', marginBottom: 28, width: 'fit-content' }}>
        {[
          { id: 'plan',    label: 'Plans' },
          { id: 'history', label: 'Billing History' },
          { id: 'compare', label: 'Compare Plans' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px', borderRadius: 'var(--r-sm)', fontWeight: 600, fontSize: '0.85rem',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === tab.id ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── PLAN CARDS TAB ─────────────────────────────────────────── */}
        {activeTab === 'plan' && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}
          >
            {PLANS.map((plan, i) => {
              const isCurrent = plan.id === activePlanId;
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="glass-card hoverable"
                  style={{
                    padding: '24px 20px',
                    border: isCurrent
                      ? '2px solid var(--brand)'
                      : plan.highlight
                      ? '1px solid rgba(245,158,11,0.4)'
                      : '1px solid var(--border)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Glow */}
                  <div style={{
                    position: 'absolute', top: -30, right: -30, width: 120, height: 120,
                    background: plan.gradient, borderRadius: '50%', opacity: 0.07, filter: 'blur(24px)', pointerEvents: 'none',
                  }} />

                  {plan.badge && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'linear-gradient(135deg,#F59E0B,#EF4444)', color: '#fff',
                      padding: '3px 10px', borderRadius: 'var(--r-full)',
                      fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.04em',
                    }}>
                      {plan.badge}
                    </div>
                  )}
                  {isCurrent && (
                    <div style={{
                      position: 'absolute', top: 12, right: 12,
                      background: 'var(--brand-dim)', color: 'var(--brand-vivid)',
                      padding: '3px 10px', borderRadius: 'var(--r-full)',
                      fontSize: '0.65rem', fontWeight: 800,
                    }}>
                      ✓ Current
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: plan.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={20} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{plan.name}</div>
                      {plan.savings && (
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--success)', background: 'var(--success-dim)', padding: '1px 8px', borderRadius: 'var(--r-full)' }}>
                          {plan.savings}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{plan.price}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: 4 }}>{plan.per}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, position: 'relative', zIndex: 1 }}>
                    {plan.features.map(f => (
                      <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: f.included ? 1 : 0.4 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          background: f.included ? 'var(--success-dim)' : 'var(--bg-overlay)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {f.included
                            ? <Check size={11} color="var(--success)" strokeWidth={3} />
                            : <XCircle size={11} color="var(--text-muted)" />
                          }
                        </div>
                        <span style={{ fontSize: '0.8rem', color: f.included ? 'var(--text-primary)' : 'var(--text-muted)' }}>{f.text}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    disabled={isCurrent}
                    onClick={() => navigate(`/checkout-simulation?plan=${plan.id}`)}
                    className={`btn ${isCurrent ? 'btn-secondary' : plan.highlight ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ width: '100%', fontSize: '0.85rem', position: 'relative', zIndex: 1 }}
                  >
                    {isCurrent ? '✓ Current Plan' : plan.cta}
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ── BILLING HISTORY TAB ────────────────────────────────────── */}
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          >
            <div className="glass-card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem' }}>Payment History</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last 4 payments</span>
              </div>
              {MOCK_HISTORY.length === 0 ? (
                <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                  <CreditCard size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                  <p>No billing history yet.</p>
                </div>
              ) : (
                <table className="gw-table">
                  <thead>
                    <tr>
                      <th>Invoice</th>
                      <th>Date</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_HISTORY.map((inv, i) => (
                      <motion.tr
                        key={inv.id}
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      >
                        <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8rem' }}>{inv.id}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{inv.date}</td>
                        <td>{inv.plan}</td>
                        <td style={{ fontWeight: 700 }}>{inv.amount}</td>
                        <td><StatusPill status={inv.status} /></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Notice */}
            <div className="glass-card" style={{ padding: '16px 20px', marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <AlertCircle size={18} color="var(--brand-vivid)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', margin: 0 }}>
                Invoices are automatically emailed to <strong style={{ color: 'var(--text-primary)' }}>{user?.email || 'your account email'}</strong> after each payment.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── COMPARE PLANS TAB ─────────────────────────────────────── */}
        {activeTab === 'compare' && (
          <motion.div
            key="compare"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          >
            <div className="glass-card" style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                <thead>
                  <tr>
                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                      Feature
                    </th>
                    {PLANS.map(p => (
                      <th key={p.id} style={{ padding: '16px 12px', textAlign: 'center', background: p.highlight ? 'var(--brand-dim)' : 'var(--bg-subtle)', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: p.highlight ? 'var(--brand-vivid)' : 'var(--text-primary)' }}>{p.name}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: 2 }}>{p.price}<span style={{ fontSize: '0.7rem', fontWeight: 400, color: 'var(--text-muted)' }}>{p.per}</span></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    'View draw results',
                    'Community leaderboard',
                    'Enter monthly draws',
                    'Charity donations',
                    'Score tracking dashboard',
                    'Priority support',
                  ].map((feature, fi) => (
                    <tr key={feature} style={{ background: fi % 2 === 0 ? 'transparent' : 'var(--bg-subtle)' }}>
                      <td style={{ padding: '14px 20px', fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{feature}</td>
                      {PLANS.map(p => {
                        const feat = p.features.find(f => f.text === feature || f.text.includes(feature.split(' ')[2] || feature));
                        const included = feat?.included ?? false;
                        return (
                          <td key={p.id} style={{ padding: '14px 12px', textAlign: 'center' }}>
                            {included
                              ? <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'var(--success-dim)' }}><Check size={13} color="var(--success)" strokeWidth={3} /></div>
                              : <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-overlay)' }}><XCircle size={13} color="var(--text-muted)" /></div>
                            }
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* CTA row */}
                  <tr>
                    <td style={{ padding: '20px 20px' }} />
                    {PLANS.map(p => (
                      <td key={p.id} style={{ padding: '20px 12px', textAlign: 'center' }}>
                        <button
                          onClick={() => navigate(`/checkout-simulation?plan=${p.id}`)}
                          className={`btn ${p.highlight ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ fontSize: '0.8rem', padding: '0 14px', minHeight: 36 }}
                        >
                          {p.cta}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Cancel Confirmation Modal ──────────────────────────────────── */}
      <AnimatePresence>
        {showCancel && (
          <motion.div
            key="cancel-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}
            onClick={() => setShowCancel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card"
              style={{ maxWidth: 440, width: '100%', padding: 32 }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--danger-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={22} color="var(--danger)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 2 }}>Cancel Subscription?</h3>
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>This will end your Pro access.</p>
                </div>
              </div>

              <div style={{ background: 'var(--warning-dim)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 24 }}>
                <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--warning)' }}>
                  ⚠️ You'll keep access until the end of your current billing period. After that, you won't be entered in new draws or receive charity donations.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowCancel(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Keep Subscription
                </button>
                <button onClick={handleCancel} disabled={cancelling} className="btn btn-danger" style={{ flex: 1 }}>
                  {cancelling ? <span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} /> : 'Yes, Cancel'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

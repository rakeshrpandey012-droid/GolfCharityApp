import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createSubscription } from '../api/api';
import { useAuth } from '../context/AuthContext';

const PLAN_INFO = {
  monthly:  { name: 'GolfWin Monthly',   price: 9.99,  period: 'month' },
  yearly:   { name: 'GolfWin Yearly',    price: 99.99, period: 'year'  },
  proplus:  { name: 'GolfWin Pro Plus',  price: 19.99, period: 'month' },
};

export default function CheckoutSimulation() {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'monthly';
  const plan   = PLAN_INFO[planId] || PLAN_INFO.monthly;

  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm]   = useState({ name: '', cardNumber: '', expiry: '', cvv: '' });
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const applyPromo = () => {
    if (promo.toUpperCase() === 'GOLF10') { setDiscount(10); toast.success('Promo applied! 10% off.'); }
    else toast.error('Invalid promo code.');
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!form.name || !form.cardNumber || !form.expiry || !form.cvv) {
      return toast.error('Please complete all payment fields.');
    }
    setLoading(true);
    try {
      await createSubscription({ plan: planId, method: 'simulated_card' });
      toast.success('Payment successful! 🎉');
      navigate('/subscription/success');
    } catch (err) {
      // Fallback: simulate success for demo
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Payment successful! 🎉');
      navigate('/subscription/success');
    } finally {
      setLoading(false);
    }
  };

  const total = (plan.price * (1 - discount / 100)).toFixed(2);

  return (
    <div className="page-bg" style={{ minHeight: '100vh', paddingTop: 40, paddingBottom: 60 }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ marginBottom: 6 }}>Checkout</h2>
            <p>Complete your subscription to start entering monthly draws.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>

            {/* ── Payment Form ────────────────────────────────── */}
            <div>
              <div className="glass-card" style={{ padding: '28px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '1.05rem' }}>Payment Details</h3>
                  <div style={{ display: 'flex', gap: 8, color: 'var(--text-muted)' }}>
                    <ShieldCheck size={18} /><Lock size={18} />
                  </div>
                </div>

                <form onSubmit={handlePay}>
                  <div className="form-group">
                    <label className="form-label">Name on Card</label>
                    <input name="name" className="form-input" placeholder="John Doe" value={form.name} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <div className="form-input-wrap">
                      <span className="input-icon input-icon-l"><CreditCard size={18} /></span>
                      <input name="cardNumber" className="form-input has-icon-l" placeholder="1234 5678 9012 3456" maxLength={19} value={form.cardNumber} onChange={handleChange} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input name="expiry" className="form-input" placeholder="MM/YY" maxLength={5} value={form.expiry} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input name="cvv" type="password" className="form-input" placeholder="•••" maxLength={4} value={form.cvv} onChange={handleChange} />
                    </div>
                  </div>

                  {/* Promo code */}
                  <div className="form-group" style={{ marginTop: 4 }}>
                    <label className="form-label">Promo Code</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <input className="form-input" placeholder="e.g. GOLF10" value={promo} onChange={e => setPromo(e.target.value)} style={{ flex: 1 }} />
                      <button type="button" onClick={applyPromo} className="btn btn-secondary" style={{ minHeight: 'unset', padding: '0 16px', height: 48, fontSize: '0.85rem' }}>Apply</button>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: 8 }}>
                    <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <input type="checkbox" required style={{ accentColor: 'var(--brand)', marginTop: 3 }} />
                      I authorise this recurring charge and agree to the Terms of Service.
                    </label>
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
                    {loading ? <span className="spinner" /> : <>Pay £{total} <ChevronRight size={18} /></>}
                  </button>
                </form>
              </div>
            </div>

            {/* ── Order Summary ───────────────────────────────── */}
            <div>
              <div className="glass-card" style={{ padding: '28px 24px', position: 'sticky', top: 24 }}>
                <h3 style={{ fontSize: '1.05rem', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>Order Summary</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{plan.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>Billed per {plan.period}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>£{plan.price.toFixed(2)}</div>
                </div>

                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: 'var(--success)', fontSize: '0.875rem' }}>
                    <span>Promo ({discount}% off)</span>
                    <span>-£{(plan.price * discount / 100).toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <span>Tax</span><span>£0.00</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border)', marginBottom: 24 }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Total Due</span>
                  <span style={{ fontWeight: 900, fontSize: '1.5rem', background: 'var(--grad-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    £{total}
                  </span>
                </div>

                <div style={{ background: 'var(--success-dim)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--r-md)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <ShieldCheck size={20} color="var(--success)" style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>
                    Secured with 256-bit SSL encryption. We never store card details.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { simulatePayment } from '../api/api';

export default function CheckoutSimulation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const amountParam = searchParams.get('amount');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    if (!sessionId) navigate('/dashboard');
  }, [sessionId, navigate]);

  const formatCard = (val) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) parts.push(v.substring(i, i + 4));
    return parts.join(' ').trim();
  };

  const formatExpiry = (val) => {
    const v = val.replace(/[^0-9]/gi, '');
    if (v.length >= 3) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    return v;
  };

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    if (card.replace(/\s/g, '').length < 16 || expiry.length < 5 || cvc.length < 3) {
      setError('Please fill in all card details.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await simulatePayment({ sessionId });
      setTimeout(() => {
        navigate(`/subscription/success?session_id=${sessionId}`);
      }, 1200);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'Transaction failed. Please try again.');
    }
  };

  const inputStyle = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: '14px 16px',
    color: '#e2e8f0',
    fontSize: '0.95rem',
    fontFamily: "'Inter', monospace",
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 8
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #020617)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '100px 20px 60px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(59,130,246,0.07)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'rgba(16,185,129,0.07)', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 480, position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 99,
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.2)',
            color: '#60a5fa', fontSize: '0.78rem', fontWeight: 600,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            marginBottom: 20
          }}>
            <Lock size={13} /> Secure Checkout Simulation
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc', margin: 0 }}>
            Complete Purchase
          </h1>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20,
            padding: '36px',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Amount row */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingBottom: 24, marginBottom: 24,
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 4 }}>Total Due Today</p>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: 'white', margin: 0 }}>
                £{amountParam || '0.00'}
              </h2>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: 14
            }}>
              <CreditCard style={{ color: '#94a3b8' }} size={24} />
            </div>
          </div>

          <form onSubmit={handleSimulatePayment} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {error && (
              <div style={{
                padding: '14px 16px', borderRadius: 12,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                display: 'flex', alignItems: 'flex-start', gap: 12,
                color: '#f87171', fontSize: '0.88rem', lineHeight: 1.5
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0 }}>{error}</p>
              </div>
            )}

            <div>
              <label style={labelStyle}>Card Number</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  maxLength={19}
                  value={card}
                  onChange={(e) => setCard(formatCard(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  style={inputStyle}
                />
                <ShieldCheck size={17} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Expiry Date</label>
                <input
                  type="text"
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>CVC</label>
                <input
                  type="text"
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ paddingTop: 8 }}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.97 } : {}}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                  color: 'white', border: 'none', borderRadius: 12,
                  padding: '15px 28px', fontSize: '1rem', fontWeight: 600,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.75 : 1,
                  boxShadow: '0 0 24px rgba(59,130,246,0.3)',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'box-shadow 0.2s'
                }}
              >
                {isLoading ? (
                  <div style={{
                    width: 20, height: 20,
                    border: '2px solid rgba(255,255,255,0.25)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite'
                  }} />
                ) : (
                  <>
                    <Lock size={17} />
                    Confirm & Pay £{amountParam || '0.00'}
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.78rem', marginTop: 28 }}>
          This is a simulated checkout gateway. No real charges are made.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

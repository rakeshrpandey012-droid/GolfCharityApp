import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    // Pull fresh user data from backend so subscription shows as active immediately
    refreshUser && refreshUser();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary, #020617)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '80px 20px 40px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Glowing background blob */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60%', height: '60%',
        background: 'rgba(16,185,129,0.08)',
        borderRadius: '50%',
        filter: 'blur(120px)',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 10, maxWidth: 480, width: '100%' }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
          style={{
            width: 96, height: 96,
            background: 'rgba(16,185,129,0.1)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 32px',
            border: '1px solid rgba(16,185,129,0.25)',
            boxShadow: '0 0 40px rgba(16,185,129,0.2)'
          }}
        >
          <CheckCircle2 size={48} style={{ color: '#34d399' }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16, color: '#f8fafc' }}
        >
          Payment Successful
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: 40 }}
        >
          Your strategic subscription is now <strong style={{ color: '#34d399' }}>active!</strong><br />
          Full command suite access has been granted.
        </motion.p>

        {/* Confirmation box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.15)',
            borderRadius: 16,
            padding: '20px 28px',
            marginBottom: 36,
            textAlign: 'left'
          }}
        >
          {['Access monthly jackpot draws', 'Log unlimited Stableford scores', 'Contributions routed to your charity'].map((feat) => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(52,211,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CheckCircle2 size={13} style={{ color: '#34d399' }} />
              </div>
              <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>{feat}</span>
            </div>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate('/dashboard')}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            padding: '14px 32px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 0 24px rgba(16,185,129,0.35)',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          Enter Control Center <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}

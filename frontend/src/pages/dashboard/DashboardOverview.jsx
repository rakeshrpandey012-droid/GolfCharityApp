import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Target, Trophy, Heart, Gift, ChevronRight, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAnalytics, getLatestDraw } from '../../api/api';

export default function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [draw, setDraw]           = useState(null);
  const [loadingA, setLoadingA]   = useState(true);
  const [loadingD, setLoadingD]   = useState(true);

  useEffect(() => {
    getAnalytics()
      .then(r => setAnalytics(r.data))
      .catch(() => {})
      .finally(() => setLoadingA(false));
    getLatestDraw()
      .then(r => setDraw(r.data))
      .catch(() => {})
      .finally(() => setLoadingD(false));
  }, []);

  const stats = [
    { label: 'Scores Logged',    value: analytics?.scoreCount     ?? '—', icon: Target,  color: 'var(--brand)',   bg: 'var(--brand-dim)'   },
    { label: 'Draws Entered',    value: analytics?.drawsEntered   ?? '—', icon: Trophy,  color: 'var(--warning)', bg: 'var(--warning-dim)' },
    { label: 'Charity Impact',   value: analytics?.charityTotal ? `£${analytics.charityTotal.toFixed(2)}` : '—', icon: Heart,   color: 'var(--success)', bg: 'var(--success-dim)' },
    { label: 'Total Winnings',   value: analytics?.totalWinnings ? `£${analytics.totalWinnings.toFixed(2)}` : '—', icon: Gift,    color: 'var(--accent)',  bg: 'var(--accent-dim)'  },
  ];

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 28,
          padding: '22px 24px',
          borderRadius: '22px',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12), rgba(14, 165, 233, 0.08), rgba(16, 185, 129, 0.08))',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-card, 0 12px 30px rgba(15, 23, 42, 0.08))'
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Dashboard
          </p>
          <h2 style={{ margin: '6px 0 0', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'Golfer'}! ⛳
          </h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)' }}>
            Here's your performance and impact at a glance.
          </p>
        </div>
        <button onClick={() => navigate('/dashboard/scores')} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0 18px', minHeight: 44 }}>
          Log Score <ChevronRight size={16} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <Motion.div
            key={s.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-card, 0 12px 24px rgba(15,23,42,0.08))',
              borderRadius: '20px',
              padding: '20px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              minHeight: 120
            }}
          >
            <div className="stat-icon" style={{ background: s.bg, width: 52, height: 52, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              {loadingA ? (
                <div className="skeleton" style={{ width: 64, height: 24, marginBottom: 6 }} />
              ) : (
                <div className="stat-value" style={{ fontSize: '1.6rem', lineHeight: 1.2 }}>{s.value}</div>
              )}
              <div className="stat-label" style={{ fontSize: '0.78rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          </Motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        <Motion.div
          className="glass-card"
          style={{
            padding: 28,
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(79, 70, 229, 0.10), rgba(15, 23, 42, 0.02))',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-card, 0 12px 30px rgba(15, 23, 42, 0.08))'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'var(--grad-brand)', borderRadius: '50%', opacity: 0.06, filter: 'blur(30px)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)' }}>🏆 Upcoming Draw</h3>
            <span className="badge badge-pending" style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              <Clock size={10} /> {loadingD ? '...' : draw?.month || 'Monthly'}
            </span>
          </div>

          <div style={{ background: 'var(--grad-brand)', borderRadius: 'var(--r-lg)', padding: '24px 20px', marginBottom: 20, position: 'relative', zIndex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', marginBottom: 6 }}>Current Prize Pool</p>
            {loadingD ? (
              <div className="skeleton" style={{ width: 160, height: 36 }} />
            ) : (
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                £{(draw?.totalPool || 0).toFixed(2)}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Scores Needed</div>
              <div style={{ fontWeight: 700, color: analytics?.scoreCount >= 5 ? 'var(--success)' : 'var(--warning)' }}>
                {analytics?.scoreCount >= 5 ? '✓ Fully entered' : `${5 - (analytics?.scoreCount || 0)} more score(s)`}
              </div>
            </div>
            <button onClick={() => navigate('/dashboard/scores')} className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0 14px', minHeight: 36 }}>
              Log Scores
            </button>
          </div>
        </Motion.div>

        <Motion.div
          className="glass-card"
          style={{
            padding: 28,
            background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08), rgba(15, 23, 42, 0.02))',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-card, 0 12px 30px rgba(15, 23, 42, 0.08))'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)' }}>♻️ Charity Impact</h3>
            <button onClick={() => navigate('/dashboard/charity')} className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '4px 10px', minHeight: 'unset' }}>
              Change →
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--success-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
              <Heart size={22} color="var(--success)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{analytics?.charity?.name || 'No charity selected'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{analytics?.charity?.category || 'Select a cause'}</div>
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 8 }}>
              <span style={{ color: 'var(--text-muted)' }}>Lifetime contributed</span>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                £{analytics?.charityTotal?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="progress-track" style={{ background: 'var(--bg-secondary)', height: 10, borderRadius: 999 }}>
              <Motion.div
                className="progress-fill green"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, ((analytics?.charityTotal || 0) / 500) * 100)}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                style={{ background: 'linear-gradient(90deg, #10b981, #34d399)', height: 10, borderRadius: 999 }}
              />
            </div>
          </div>
        </Motion.div>
      </div>
    </div>
  );
}

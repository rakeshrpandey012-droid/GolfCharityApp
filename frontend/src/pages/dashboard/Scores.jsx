import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Calendar, Trash2, AlertCircle } from 'lucide-react';
import { getScores, addScore, createSubscription, getMySubscription } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/GlassCard';
import GlowButton from '../../components/GlowButton';
import toast from 'react-hot-toast';

export default function Scores() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [form, setForm] = useState({ score: '', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const fetchScores = () =>
    getScores()
      .then(r => setScores(r.data.scores || r.data || []))
      .catch(() => {});

  useEffect(() => {
    Promise.allSettled([
      fetchScores(),
      getMySubscription().then(r => setSubscription(r.data.subscription || r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const s = parseInt(form.score);
    if (isNaN(s) || s < 1 || s > 45) {
      toast.error('Score must be between 1 and 45');
      return;
    }
    setAdding(true);
    try {
      await addScore({ score: s, date: form.date });
      toast.success('Score added ✓');
      setForm({ score: '', date: new Date().toISOString().split('T')[0] });
      await fetchScores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add score');
    } finally {
      setAdding(false);
    }
  };

  const handleSubscribe = async (plan) => {
    setSubscribing(true);
    try {
      const res = await createSubscription({ plan });
      if (res.data.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      } else {
        toast.success('Subscription activated!');
        await getMySubscription().then(r => setSubscription(r.data.subscription || r.data));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

  const isActive = user?.subscriptionStatus === 'active';

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: 6 }}>
          My Scores
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your Stableford scores — latest 5 retained for monthly draws</p>
      </motion.div>

      {/* Subscription required */}
      {!isActive && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{
          padding: '28px 32px', marginBottom: 28,
          background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(245,158,11,0.05))',
          borderColor: 'rgba(239,68,68,0.25)',
        }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <AlertCircle size={24} style={{ color: '#f87171', flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#f87171', marginBottom: 8 }}>
                Active Subscription Required
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20, lineHeight: 1.6 }}>
                You need an active subscription to log scores and participate in draws.
                Choose a plan below to get started.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['monthly', 'yearly'].map(plan => (
                  <GlowButton
                    key={plan}
                    variant={plan === 'yearly' ? 'green' : 'primary'}
                    onClick={() => handleSubscribe(plan)}
                    loading={subscribing}
                  >
                    {plan === 'monthly' ? '£9.99 / Month' : '£89.99 / Year (Save 25%)'}
                  </GlowButton>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="scores-grid">
        {/* Add Score Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa' }}>
              <Plus size={18} />
            </div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>Add Score</h3>
          </div>

          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Stableford Score (1–45)
              </label>
              <input
                type="number"
                min={1} max={45}
                value={form.score}
                onChange={e => setForm({ ...form, score: e.target.value })}
                placeholder="e.g. 35"
                required
                disabled={!isActive}
                className="glass-input"
              />
              {form.score && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div className="score-bar" style={{ width: `${(Math.min(Math.max(parseInt(form.score) || 0, 0), 45) / 45) * 100}%`, height: '100%', transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6 }}>
                    {Math.round((Math.min(Math.max(parseInt(form.score) || 0, 0), 45) / 45) * 100)}% of max
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Date Played
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  required
                  disabled={!isActive}
                  className="glass-input"
                  style={{ paddingLeft: 40, colorScheme: 'dark' }}
                />
              </div>
            </div>

            <GlowButton type="submit" loading={adding} disabled={!isActive}>
              Add Score
            </GlowButton>

            {isActive && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Only the latest 5 scores are kept. Oldest auto-removed.
              </p>
            )}
          </form>
        </motion.div>

        {/* Score List */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Target size={18} style={{ color: '#a78bfa' }} />
              <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700 }}>Score History</h3>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className={`badge ${scores.length >= 5 ? 'badge-active' : 'badge-pending'}`} style={{ fontSize: '0.72rem' }}>
                {scores.length}/5 scores
              </span>
              {scores.length >= 5 && <span className="badge badge-active" style={{ fontSize: '0.72rem' }}>Draw eligible ✓</span>}
            </div>
          </div>

          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 64, marginBottom: 12, borderRadius: 10 }} />)
          ) : scores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
              <Target size={48} style={{ opacity: 0.2, marginBottom: 16, display: 'block', margin: '0 auto 16px' }} />
              <p>No scores recorded yet.</p>
              <p style={{ fontSize: '0.82rem', marginTop: 6 }}>Add your first score to start participating in draws.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {scores.map((s, i) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '16px 20px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
                    border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, color: '#60a5fa', fontSize: '1rem',
                  }}>
                    {s.score}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 6 }}>
                      {s.score} Stableford Points
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <div className="score-bar" style={{ width: `${(s.score / 45) * 100}%`, height: '100%' }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    {i === 0 && <span className="badge badge-blue" style={{ fontSize: '0.65rem', marginTop: 4 }}>Latest</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

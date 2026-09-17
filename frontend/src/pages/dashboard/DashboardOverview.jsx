import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Heart, CreditCard, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getScores, getLatestDraw, getMySubscription, getWinners } from '../../api/api';
import GlowButton from '../../components/GlowButton';
import { StatCardSkeleton } from '../../components/Skeletons';

function CountdownTimer({ targetDate }) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = targetDate ? new Date(targetDate) : new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const diff = Math.max(0, end - now);
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
      {Object.entries(time).map(([unit, val]) => (
        <div key={unit} style={{ textAlign: 'center' }}>
          <div style={{
            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 12, padding: '12px 16px',
            fontFamily: "'Inter', sans-serif", fontSize: '1.5rem', fontWeight: 600,
            color: '#60a5fa', minWidth: 60, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            {String(val).padStart(2, '0')}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 8, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            {unit === 'd' ? 'Days' : unit === 'h' ? 'Hrs' : unit === 'm' ? 'Min' : 'Sec'}
          </div>
        </div>
      ))}
    </div>
  );
}

const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [draw, setDraw] = useState(null);
  const [winners, setWinners] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getScores().then(r => setScores(r.data.scores || r.data || [])),
      getLatestDraw().then(r => setDraw(r.data.draw || r.data)),
      getWinners().then(r => setWinners(r.data.winners || r.data || [])),
      getMySubscription().then(r => setSubscription(r.data.subscription || r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const myWinnings = winners.filter(w => w.user?._id === user?._id || w.user === user?._id);
  const totalWon = myWinnings.reduce((s, w) => s + (w.prizeAmount || 0), 0);
  const isActive = user?.subscriptionStatus === 'active';

  const stats = [
    {
      icon: CreditCard, label: 'Subscription', color: '#3b82f6', glow: 'rgba(59,130,246,0.15)',
      value: isActive ? 'Active' : 'Inactive',
      sub: subscription?.plan ? `${subscription.plan} plan` : 'No active plan',
      badgeColor: isActive ? '#10b981' : '#f43f5e',
    },
    {
      icon: Target, label: 'Scores Entered', color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)',
      value: scores.length,
      sub: `${Math.max(0, 5 - scores.length)} more needed for draw`,
    },
    {
      icon: Trophy, label: 'Total Winnings', color: '#f59e0b', glow: 'rgba(245,158,11,0.15)',
      value: `£${totalWon.toFixed(2)}`,
      sub: `${myWinnings.length} prize(s) won`,
    },
    {
      icon: Heart, label: 'Charity Impact', color: '#10b981', glow: 'rgba(16,185,129,0.15)',
      value: `${user?.charityPercentage || 10}%`,
      sub: 'of subscription donated',
    },
  ];

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '2rem', fontWeight: 500, marginBottom: 8, color: 'white' }}>
          Good to see you, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your personalized command center.</p>
      </motion.div>

      {/* Subscribe CTA if not subscribed */}
      {!isActive && (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bento-card"
           style={{
             padding: '28px 32px', marginBottom: 24,
             background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.05))',
             borderColor: 'rgba(59,130,246,0.3)',
             display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
           }}
        >
          <div>
             <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, marginBottom: 6, fontSize: '1.1rem', color: 'white' }}>
               🚀 Activate Your Subscription
             </h3>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
               You are missing out on the monthly draws. Subscribe to enter your scores and support your charity.
             </p>
          </div>
          <GlowButton onClick={() => navigate('/dashboard/scores')}>Subscribe Now</GlowButton>
        </motion.div>
      )}

      {/* Stats row */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="bento-grid" style={{ marginBottom: 24 }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map(({ icon: Icon, label, color, value, sub, glow, badgeColor }) => (
            <motion.div key={label} variants={fadeUp} className="bento-card bento-col-3" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: glow, filter: 'blur(30px)', borderRadius: '50%' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, position: 'relative', zIndex: 10 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `linear-gradient(145deg, ${color}22, transparent)`, border: `1px solid ${color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color,
                  boxShadow: `0 4px 12px ${color}22`
                }}>
                  <Icon size={20} />
                </div>
                {badgeColor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: 99, border: '1px solid rgba(255,255,255,0.05)' }}>
                     <div style={{ width: 6, height: 6, borderRadius: '50%', background: badgeColor, boxShadow: `0 0 8px ${badgeColor}` }} />
                     <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'white', textTransform: 'uppercase' }}>{value}</span>
                  </div>
                )}
              </div>
              <div style={{ position: 'relative', zIndex: 10 }}>
                 {!badgeColor && <div style={{ fontSize: '1.75rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: 'white', lineHeight: 1.2, marginBottom: 4 }}>{value}</div>}
                 <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</div>
                 <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 8 }}>{sub}</div>
              </div>
            </motion.div>
          ))
        }
      </motion.div>

      {/* Huge Bento Grid (Draw & Scores) */}
      <div className="bento-grid">
         {/* Draw Countdown Widget */}
         <motion.div variants={fadeUp} initial="initial" animate="animate" className="bento-card bento-col-7" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, background: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={16} /></div>
                  <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '1.2rem', color: 'white' }}>Next Monthly Draw</h3>
               </div>
               
               {isActive ? (
                 scores.length >= 5 ? (
                   <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: 99, border: '1px solid rgba(16,185,129,0.2)', fontSize: '0.75rem', fontWeight: 600 }}>✓ Eligible</div>
                 ) : (
                   <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '4px 12px', borderRadius: 99, border: '1px solid rgba(245,158,11,0.2)', fontSize: '0.75rem', fontWeight: 600 }}>⚠ Requires {5 - scores.length} more scores</div>
                 )
               ) : null}
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
               {draw?.status === 'published'
                 ? `The previous draw (${draw.month}) concluded securely. Preparing countdown for the next event.`
                 : 'Gathering scores. The provably fair engine will execute the jackpot sequence when the countdown ends.'}
            </p>

            <div style={{ marginTop: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: 16, padding: 24, border: '1px solid rgba(255,255,255,0.03)' }}>
               <CountdownTimer />
            </div>
         </motion.div>

         {/* Recent Scores Widget */}
         <motion.div variants={fadeUp} initial="initial" animate="animate" className="bento-card bento-col-5" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, background: 'rgba(139,92,246,0.1)', color: '#a78bfa', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Target size={16} /></div>
                  <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: '1.2rem', color: 'white' }}>Recent Scores</h3>
               </div>
               <button onClick={() => navigate('/dashboard/scores')} style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                 View all <ChevronRight size={14} />
               </button>
            </div>

            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ height: 48, background: 'rgba(255,255,255,0.02)', marginBottom: 8, borderRadius: 8, animation: 'pulse 2s infinite' }} />)
            ) : scores.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)' }}>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>You haven't logged any scores yet.</p>
                 <GlowButton size="sm" variant="ghost" onClick={() => navigate('/dashboard/scores')}>Add First Score</GlowButton>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                 {scores.slice(0, 5).map((s, i) => (
                    <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                       <div>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>{s.score} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>pts</span></div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 2 }}>{new Date(s.date).toLocaleDateString()}</div>
                       </div>
                       <div style={{ height: 6, width: 100, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(s.score / 45) * 100}%` }}
                             transition={{ duration: 1, ease: 'easeOut' }}
                             style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #c084fc)' }} 
                          />
                       </div>
                    </div>
                 ))}
              </div>
            )}
         </motion.div>
      </div>

    </div>
  );
}

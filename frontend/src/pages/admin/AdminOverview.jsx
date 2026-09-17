import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Heart, BarChart2, TrendingUp, Dice5, ChevronRight } from 'lucide-react';
import { getAnalytics, getLatestDraw } from '../../api/api';
import { StatCardSkeleton } from '../../components/Skeletons';
import GlowButton from '../../components/GlowButton';
import { useNavigate } from 'react-router-dom';

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function AdminOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [draw, setDraw] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.allSettled([
      getAnalytics().then(r => setAnalytics(r.data.metrics || r.data)),
      getLatestDraw().then(r => setDraw(r.data.draw || r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const stats = analytics ? [
    { icon: Users, label: 'Total Users', value: analytics.totalUsers || 0, color: '#3b82f6', glow: 'rgba(59,130,246,0.15)', sub: `Platform accounts` },
    { icon: TrendingUp, label: 'Current Prize Pool', value: `£${(analytics.totalPrizePool || 0).toFixed(2)}`, color: '#f59e0b', glow: 'rgba(245,158,11,0.15)', sub: 'Accumulated pot' },
    { icon: Heart, label: 'Charity Raised', value: `£${(analytics.totalCharityFunds || 0).toFixed(2)}`, color: '#10b981', glow: 'rgba(16,185,129,0.15)', sub: 'Total worldwide impact' },
    { icon: Trophy, label: 'Pending Winners', value: analytics.pendingWinners || 0, color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)', sub: 'Awaiting your verification', badgeColor: (analytics.pendingWinners > 0) ? '#f43f5e' : null },
  ] : [];

  return (
    <div style={{ paddingBottom: 60 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="admin-page-header" style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '2rem', fontWeight: 600, marginBottom: 8, color: 'white' }}>
            System Analytics
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Live platform metrics and global control protocols.</p>
        </div>
        <GlowButton onClick={() => navigate('/admin/draw')} style={{ paddingLeft: 24, paddingRight: 24 }}>
          <Dice5 size={18} style={{ marginRight: 8 }} /> Execute Draw Engine
        </GlowButton>
      </motion.div>

      {/* Primary Stats Grid */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="bento-grid" style={{ marginBottom: 24 }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="bento-col-3" style={{ height: 160, background: 'rgba(255,255,255,0.02)', borderRadius: 24, animation: 'pulse 2s infinite' }} />)
          : stats.map(({ icon: Icon, label, value, color, glow, sub, badgeColor }) => (
            <motion.div key={label} variants={fadeUp} className="bento-card bento-col-3" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: glow, filter: 'blur(40px)', borderRadius: '50%' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative', zIndex: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(145deg, ${color}22, transparent)`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, boxShadow: `0 4px 12px ${color}22` }}>
                  <Icon size={24} />
                </div>
                {badgeColor && (
                   <div style={{ width: 12, height: 12, borderRadius: '50%', background: badgeColor, boxShadow: `0 0 12px ${badgeColor}`, marginTop: 8 }} />
                )}
              </div>
              <div style={{ position: 'relative', zIndex: 10 }}>
                 <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.8rem', fontWeight: 600, color: 'white', lineHeight: 1.1, marginBottom: 6 }}>{value}</div>
                 <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</div>
                 <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 8 }}>{sub}</div>
              </div>
            </motion.div>
          ))
        }
      </motion.div>

      {/* Complex Bento Row */}
      <div className="bento-grid">
         {/* Live Engine Status */}
         <motion.div variants={fadeUp} initial="initial" animate="animate" className="bento-card bento-col-8" style={{ padding: 32, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: -50, bottom: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 60%)', border: '1px solid rgba(59,130,246,0.1)', borderRadius: '50%' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, position: 'relative', zIndex: 10 }}>
               <div>
                 <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '1.25rem', color: 'white', marginBottom: 4 }}>Live Engine Interface</h3>
                 <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Tracking the current globally broadcasted draw sequence.</p>
               </div>
               {draw?.status === 'published' ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 99, color: '#10b981', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
                    Published
                  </div>
               ) : (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 99, color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 8px #f59e0b', animation: 'pulse 2s infinite' }} />
                    Pending Action
                  </div>
               )}
            </div>

            {loading ? (
              <div style={{ height: 100, background: 'rgba(255,255,255,0.02)', borderRadius: 16, animation: 'pulse 2s infinite' }} />
            ) : draw ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: 32, borderRadius: 16, border: '1px solid rgba(255,255,255,0.03)', position: 'relative', zIndex: 10 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>Algorithm Output ({draw.month})</div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {(draw.numbers || []).map((n, i) => (
                      <div key={i} style={{
                        width: 50, height: 50, borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), transparent)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Inter', sans-serif", fontWeight: 700, color: 'white', fontSize: '1.2rem',
                        boxShadow: 'inset 0 0 20px rgba(59,130,246,0.1), 0 4px 12px rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: 60, width: 1, background: 'rgba(255,255,255,0.1)' }} />

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontWeight: 600 }}>Processed Pool</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '2rem', fontWeight: 600, color: '#60a5fa' }}>
                    £{(draw.totalPool || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'rgba(0,0,0,0.3)', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.1)' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>The engine has not executed the first sequence yet.</p>
              </div>
            )}
         </motion.div>

         {/* Admin Action Menu */}
         <motion.div variants={fadeUp} initial="initial" animate="animate" className="bento-card bento-col-4" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '1.25rem', color: 'white', marginBottom: 24 }}>Control Protocols</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
               {[
                 { label: 'Manage Accounts', path: '/admin/users', icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
                 { label: 'Verify Charities', path: '/admin/charities', icon: Heart, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                 { label: 'Process Payouts', path: '/admin/winners', icon: Trophy, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
                 { label: 'System Logs', path: '/admin/analytics', icon: BarChart2, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
               ].map((item) => (
                 <motion.button
                   key={item.label}
                   whileHover={{ scale: 1.02, x: 4 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => navigate(item.path)}
                   style={{
                     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                     padding: '16px 20px', background: 'rgba(255,255,255,0.02)',
                     border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12,
                     color: 'white', cursor: 'pointer', textAlign: 'left',
                     transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif"
                   }}
                 >
                   <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <item.icon size={16} />
                      </div>
                      <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.label}</span>
                   </div>
                   <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                 </motion.button>
               ))}
            </div>
         </motion.div>
      </div>
    </div>
  );
}

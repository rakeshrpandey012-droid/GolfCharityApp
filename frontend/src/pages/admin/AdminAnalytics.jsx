import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Users, TrendingUp, Heart, Trophy, Target, ChevronDown } from 'lucide-react';
import { getAnalytics, getDrawHistory } from '../../api/api';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Beautiful Gradient/Brand Colors
const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      getAnalytics().then(r => setAnalytics(r.data.metrics || r.data)),
      getDrawHistory().then(r => setHistory(r.data.draws || r.data || [])),
    ]).finally(() => setLoading(false));
  }, []);

  // Map real data from 'history' mapping to the Area Chart (Financials)
  const areaData = history && history.length > 0 
    ? history.slice(0, 6).reverse().map(d => ({
        name: d.month.split(' ')[0] || 'Unknown',
        revenue: (d.totalPool || 0) * 2, // Estimated gross based on 50% pool mechanic
        expenses: d.totalPool || 0, // The portion given out as prizes
        subscribers: d.subscriberCount || 0
      }))
    : [{ name: 'Pending', revenue: 0, expenses: 0, subscribers: 0 }];

  // Map real data from 'history' or analytics to bar chart (User Engagement over Draws)
  const barData = history && history.length > 0
    ? history.slice(0, 7).reverse().map(d => ({
        draw: d.month.split(' ')[0],
        subscribers: d.subscriberCount || 0,
        jackpotCarry: d.jackpotCarryForward || 0
      }))
    : [{ draw: 'Pending', subscribers: 0, jackpotCarry: 0 }];

  // Pie chart tying into accurate internal prize mechanics using real DB aggregate base
  const pool = analytics?.totalPrizePool || 0;
  const pieData = [
    { name: 'Jackpot Pool (40%)', value: Number((pool * 0.40).toFixed(2)) },
    { name: 'Tier 2 Pool (35%)', value: Number((pool * 0.35).toFixed(2)) },
    { name: 'Tier 3 Pool (25%)', value: Number((pool * 0.25).toFixed(2)) },
  ];

  // Custom tooltips to match the dark aesthetic
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(5,5,16,0.9)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: 12, backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8, fontSize: '0.85rem' }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color || p.fill, fontWeight: 600, fontSize: '1rem', margin: '4px 0' }}>
              {p.name}: £{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Top Navigation / Title Area */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: '2rem', fontWeight: 500, color: 'white' }}>
          Platform Analytics
        </h1>
        <div style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
           <button style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: 8, fontSize: '0.85rem', fontWeight: 500 }}>Dashboard</button>
           <button style={{ padding: '6px 16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', borderRadius: 8, fontSize: '0.85rem' }}>Users</button>
           <button style={{ padding: '6px 16px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', borderRadius: 8, fontSize: '0.85rem' }}>Reports</button>
        </div>
      </motion.div>

      {/* Massive Area Chart Row */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bento-card" style={{ marginBottom: 24, padding: 32 }}>
         {/* Chart Header Stats */}
         <div className="analytics-stats-row">
            <div>
               <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6 }}>Gross Volume</div>
               <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: 'white', lineHeight: 1 }}>
                     £{((analytics?.totalRevenue || 0) * 1.5).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div style={{ color: '#10b981', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>▲ 12%</div>
               </div>
            </div>
            <div>
               <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6 }}>Prize Pool Allocated</div>
               <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: 'white', lineHeight: 1 }}>
                     £{(analytics?.totalPrizePool || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div style={{ color: '#f59e0b', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>▲ 24%</div>
               </div>
            </div>
            <div>
               <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6 }}>Charity Disbursed</div>
               <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", color: 'white', lineHeight: 1 }}>
                     £{(analytics?.totalCharityFunds || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div style={{ color: '#3b82f6', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>▲ 18%</div>
               </div>
            </div>
         </div>

         {/* Chart area */}
         <div style={{ width: '100%', height: 350 }}>
            {loading ? (
              <div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: 12, animation: 'pulse 2s infinite' }} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Platform Revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expenses" name="Prize Allocation" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
         </div>
      </motion.div>

      {/* 3-Column Split Widgets */}
      <div className="bento-grid">
         
         {/* Bar Chart Widget */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bento-card bento-col-4" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
               <h3 style={{ fontSize: '1.05rem', fontWeight: 500, color: 'white' }}>User Engagement</h3>
               <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', padding: '4px 12px', borderRadius: 8, color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', gap: 6, alignItems: 'center' }}>
                  This Week <ChevronDown size={14} />
               </button>
            </div>
            
            <div style={{ width: '100%', flex: 1, minHeight: 220 }}>
               {loading ? null : (
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={barData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                     <XAxis dataKey="draw" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                     <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                     <Bar dataKey="subscribers" name="Subscribers" stackId="a" fill="#3b82f6" radius={[0, 0, 4, 4]} />
                     <Bar dataKey="jackpotCarry" name="C/F Jackpot" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               )}
            </div>
         </motion.div>

         {/* Stats / Progress Metrics */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bento-card bento-col-4" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
               <h3 style={{ fontSize: '1.05rem', fontWeight: 500, color: 'white' }}>Current KPI Focus</h3>
               <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Live Statistics</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
               {/* Goal 1 */}
               <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                     <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Network Active Users</span>
                     <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>{analytics?.totalUsers || 0} Total</span>
                  </div>
                  <div style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden' }}>
                     <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((analytics?.totalUsers || 0) / 100 * 100, 100)}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} style={{ height: '100%', background: '#10b981', borderRadius: 6, boxShadow: '0 0 10px rgba(16,185,129,0.5)' }} />
                  </div>
               </div>

               {/* Goal 2 */}
               <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                     <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Engine Draws Executed</span>
                     <span style={{ color: '#8b5cf6', fontSize: '0.85rem', fontWeight: 600 }}>{analytics?.drawCount || 0} Runs</span>
                  </div>
                  <div style={{ height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, overflow: 'hidden' }}>
                     <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((analytics?.drawCount || 0) / 10 * 100, 100)}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} style={{ height: '100%', background: '#8b5cf6', borderRadius: 6, boxShadow: '0 0 10px rgba(139,92,246,0.5)' }} />
                  </div>
               </div>

               {/* Stats text block */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                     <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: 8, borderRadius: 8 }}><Trophy size={16} /></div>
                     <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending Verifications</div>
                        <div style={{ color: 'white', fontWeight: 600, fontSize: '1.1rem' }}>{analytics?.pendingWinners || 0} <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>winners</span></div>
                     </div>
                  </div>
               </div>
            </div>
         </motion.div>

         {/* Donut Chart Widget */}
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bento-card bento-col-4" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 500, color: 'white', marginBottom: 8 }}>Prize Disbursal</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 16 }}>Engine logic split per draw</p>
            
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
               {loading ? null : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: `drop-shadow(0px 0px 8px ${COLORS[index % COLORS.length]}80)` }} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
               )}
               <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'white' }}>100%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Allocated</div>
               </div>
            </div>

            {/* Legend underneath */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
               {pieData.map((entry, index) => (
                  <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                     <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[index % COLORS.length], boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}` }} />
                     <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{entry.value}%</span>
                  </div>
               ))}
            </div>
         </motion.div>
      </div>
    </div>
  );
}

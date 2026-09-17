import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Dice5, Play, Eye, Zap, Clock } from 'lucide-react';
import { getLatestDraw, getDrawHistory, createDraftDraw, simulateDraw, publishDraw, runDraw } from '../../api/api';
import GlowButton from '../../components/GlowButton';
import toast from 'react-hot-toast';

export default function AdminDraw() {
  const [draw, setDraw] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafting, setDrafting] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [running, setRunning] = useState(false);
  const [drawType, setDrawType] = useState('random');
  const [manualNumbers, setManualNumbers] = useState(["", "", "", "", ""]);

  const fetchData = () => Promise.allSettled([
    getLatestDraw().then(r => setDraw(r.data.draw || r.data)),
    getDrawHistory().then(r => setHistory(r.data.draws || r.data || [])),
  ]).finally(() => setLoading(false));

  useEffect(() => { fetchData(); }, []);

  const handleDraft = async () => {
    setDrafting(true);
    try {
      const payload = { type: drawType };
      if (drawType === 'manual') payload.manualNumbers = manualNumbers.map(Number);
      const res = await createDraftDraw(payload);
      setDraw(res.data.draw || res.data);
      toast.success('Draft draw created!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create draft');
    } finally { setDrafting(false); }
  };

  const handleSimulate = async () => {
    if (!draw?._id) return;
    setSimulating(true);
    try {
      const res = await simulateDraw(draw._id);
      setDraw(res.data.draw || draw);
      toast.success('Simulation complete — check results');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Simulation failed');
    } finally { setSimulating(false); }
  };

  const handlePublish = async () => {
    if (!draw?._id) return;
    setPublishing(true);
    try {
      await publishDraw(draw._id);
      toast.success('Draw published! 🎉');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Publish failed');
    } finally { setPublishing(false); }
  };

  const handleRunDraw = async () => {
    setRunning(true);
    try {
      const payload = { type: drawType };
      if (drawType === 'manual') payload.manualNumbers = manualNumbers.map(Number);
      await runDraw(payload);
      toast.success('Draw created and published! 🎉');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Run failed');
    } finally { setRunning(false); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: 6 }}>
          Draw Control
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Create, simulate, and publish monthly prize draws</p>
      </motion.div>

      <div className="admin-draw-grid">
        {/* Draw controls */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: 20 }}>Create Draw</h3>

          {/* Type selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Draw Type
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['random', 'algorithm', 'manual'].map(t => (
                <button
                  key={t}
                  onClick={() => setDrawType(t)}
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 10, cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize',
                    background: drawType === t ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${drawType === t ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    color: drawType === t ? '#a78bfa' : 'var(--text-secondary)',
                  }}
                >
                  {t === 'random' ? '🎲 Random' : t === 'algorithm' ? '🧠 Logic' : '✍️ Manual'}
                </button>
              ))}
            </div>

            {drawType === 'manual' && (
              <div style={{ marginTop: 16 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Enter 5 numbers (1-45):</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {manualNumbers.map((num, idx) => (
                    <input
                      key={idx}
                      type="number"
                      min="1" max="45"
                      value={num}
                      onChange={(e) => {
                        const newNums = [...manualNumbers];
                        newNums[idx] = e.target.value;
                        setManualNumbers(newNums);
                      }}
                      className="glass-input"
                      style={{ flex: 1, padding: '8px 4px', textAlign: 'center', fontWeight: 'bold' }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <GlowButton onClick={handleDraft} loading={drafting} style={{ width: '100%' }}>
              <Dice5 size={16} /> Create Draft
            </GlowButton>
            <GlowButton variant="ghost" onClick={handleSimulate} loading={simulating} disabled={!draw || draw?.status === 'published'} style={{ width: '100%' }}>
              <Eye size={16} /> Simulate Draft
            </GlowButton>
            <GlowButton variant="green" onClick={handlePublish} loading={publishing} disabled={!draw || draw?.status === 'published'} style={{ width: '100%' }}>
              <Play size={16} /> Publish Draw
            </GlowButton>

            <div className="divider" />

            <GlowButton onClick={handleRunDraw} loading={running} style={{ width: '100%', background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
              <Zap size={16} /> Quick Run (Draft + Publish)
            </GlowButton>
          </div>
        </motion.div>

        {/* Latest draw */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: 20 }}>Current Draw</h3>
          {loading ? (
            <div className="skeleton" style={{ height: 120, borderRadius: 12 }} />
          ) : draw ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Month</div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem' }}>{draw.month}</div>
                </div>
                <span className={`badge ${draw.status === 'published' ? 'badge-active' : 'badge-pending'}`}>
                  {draw.status === 'published' ? '✓ Published' : '⏳ Draft'}
                </span>
              </div>

              {/* Numbers */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Draw Numbers</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(draw.numbers || []).map((n, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
                        border: '1px solid rgba(59,130,246,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, color: '#60a5fa', fontSize: '1rem',
                        boxShadow: '0 0 12px rgba(59,130,246,0.2)',
                      }}
                    >
                      {n}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Prize Pool', value: `£${(draw.totalPool || 0).toFixed(2)}`, color: '#f59e0b' },
                  { label: 'Subscribers', value: draw.subscriberCount || 0, color: '#3b82f6' },
                  { label: 'Jackpot C/F', value: `£${(draw.jackpotCarryForward || 0).toFixed(2)}`, color: '#8b5cf6' },
                  { label: 'Type', value: draw.type || 'random', color: '#10b981' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 700, color, fontSize: '0.95rem' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>
              <Dice5 size={40} style={{ opacity: 0.2, margin: '0 auto 12px', display: 'block' }} />
              <p>No draw yet. Create one!</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Draw history */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: 28 }}>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: 20 }}>Draw History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr><th>Month</th><th>Numbers</th><th>Status</th><th>Pool</th><th>Subscribers</th><th>Type</th></tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)' }}>No history yet</td></tr>
              ) : history.map(d => (
                <tr key={d._id}>
                  <td style={{ fontWeight: 600 }}>{d.month}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(d.numbers || []).map((n, i) => (
                        <span key={i} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 6, padding: '2px 6px', fontSize: '0.78rem', color: '#60a5fa', fontWeight: 700 }}>{n}</span>
                      ))}
                    </div>
                  </td>
                  <td><span className={`badge ${d.status === 'published' ? 'badge-active' : 'badge-pending'}`} style={{ fontSize: '0.7rem' }}>{d.status}</span></td>
                  <td style={{ color: '#f59e0b', fontWeight: 600 }}>£{(d.totalPool || 0).toFixed(2)}</td>
                  <td>{d.subscriberCount || 0}</td>
                  <td><span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{d.type}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

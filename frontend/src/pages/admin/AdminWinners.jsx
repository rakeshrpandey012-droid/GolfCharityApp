import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Clock, X } from 'lucide-react';
import { getWinners, updateWinnerStatus } from '../../api/api';
import { TableRowSkeleton } from '../../components/Skeletons';
import GlowButton from '../../components/GlowButton';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { cls: 'badge-pending', label: 'Pending' },
  approved: { cls: 'badge-active', label: 'Approved' },
  rejected: { cls: 'badge-inactive', label: 'Rejected' },
  paid: { cls: 'badge-blue', label: 'Paid' },
};

export default function AdminWinners() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchWinners = () =>
    getWinners()
      .then(r => setWinners(r.data.winners || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => { fetchWinners(); }, []);

  const handleStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await updateWinnerStatus(id, { status });
      toast.success(`Status updated to ${status}`);
      fetchWinners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setUpdating(null); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: 6 }}>Winners</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Verify winner submissions and manage payouts</p>
      </motion.div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Winners', value: winners.length, color: '#3b82f6' },
          { label: 'Pending Review', value: winners.filter(w => w.status === 'pending').length, color: '#f59e0b' },
          { label: 'Approved', value: winners.filter(w => w.status === 'approved').length, color: '#10b981' },
          { label: 'Paid Out', value: winners.filter(w => w.status === 'paid').length, color: '#8b5cf6' },
        ].map(({ label, value, color }) => (
          <div key={label} className="stat-card" style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 800, color, marginBottom: 6 }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{label}</div>
          </div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr><th>Winner</th><th>Draw</th><th>Match</th><th>Amount</th><th>Status</th><th>Proof</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                : winners.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                      <Trophy size={32} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
                      No winners yet
                    </td>
                  </tr>
                ) : winners.map(w => {
                  const s = statusConfig[w.status] || statusConfig.pending;
                  return (
                    <tr key={w._id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{w.user?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.user?.email}</div>
                      </td>
                      <td>{w.draw?.month || '—'}</td>
                      <td>{w.matchType ? `${w.matchType}-Match` : '—'}</td>
                      <td style={{ fontWeight: 700, color: '#34d399' }}>£{(w.prizeAmount || 0).toFixed(2)}</td>
                      <td><span className={`badge ${s.cls}`} style={{ fontSize: '0.7rem' }}>{s.label}</span></td>
                      <td>
                        {w.proofImage ? (
                          <a href={w.proofImage} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', fontSize: '0.8rem', textDecoration: 'none' }}>View →</a>
                        ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>None</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {w.status === 'pending' && (
                            <>
                              <button onClick={() => handleStatus(w._id, 'approved')} disabled={updating === w._id + 'approved'} style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#34d399', fontSize: '0.75rem', fontWeight: 600 }}>✓ Approve</button>
                              <button onClick={() => handleStatus(w._id, 'rejected')} disabled={updating === w._id + 'rejected'} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#f87171', fontSize: '0.75rem', fontWeight: 600 }}>✗ Reject</button>
                            </>
                          )}
                          {w.status === 'approved' && (
                            <button onClick={() => handleStatus(w._id, 'paid')} disabled={updating === w._id + 'paid'} style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 600 }}>💰 Mark Paid</button>
                          )}
                          {(w.status === 'rejected' || w.status === 'paid') && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

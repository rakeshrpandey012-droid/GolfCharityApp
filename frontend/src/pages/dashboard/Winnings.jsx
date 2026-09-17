import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getWinners, uploadWinnerProof } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import GlowButton from '../../components/GlowButton';
import Modal from '../../components/Modal';
import { TableRowSkeleton } from '../../components/Skeletons';
import toast from 'react-hot-toast';

const statusConfig = {
  pending: { cls: 'badge-pending', icon: Clock, label: 'Pending' },
  approved: { cls: 'badge-active', icon: CheckCircle, label: 'Approved' },
  rejected: { cls: 'badge-inactive', icon: AlertCircle, label: 'Rejected' },
  paid: { cls: 'badge-blue', icon: CheckCircle, label: 'Paid ✓' },
};

export default function Winnings() {
  const { user } = useAuth();
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proofModal, setProofModal] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getWinners()
      .then(r => setWinners(r.data.winners || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const myWinnings = winners.filter(w => w.user?._id === user?._id || w.user === user?._id);
  const total = myWinnings.reduce((s, w) => s + (w.prizeAmount || 0), 0);

  const handleProofUpload = async () => {
    if (!proofFile) { toast.error('Select a file first'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('winnerId', proofModal._id);
      fd.append('proofImage', proofFile);
      await uploadWinnerProof(fd);
      toast.success('Proof uploaded successfully!');
      setProofModal(null);
      setProofFile(null);
      await getWinners().then(r => setWinners(r.data.winners || r.data || []));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: 6 }}>
          My Winnings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Your prize history and payout status</p>
      </motion.div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
        {[
          { label: 'Total Won', value: `£${total.toFixed(2)}`, color: '#f59e0b', icon: Trophy },
          { label: 'Prizes Won', value: myWinnings.length, color: '#3b82f6', icon: Trophy },
          { label: 'Pending Payout', value: `£${myWinnings.filter(w => w.status === 'approved').reduce((s, w) => s + (w.prizeAmount || 0), 0).toFixed(2)}`, color: '#10b981', icon: Clock },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="stat-card">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}22`, border: `1px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 16 }}>
              <Icon size={18} />
            </div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>{value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Winnings table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: 28 }}>
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: 20 }}>Prize History</h3>

        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Draw Month</th>
                <th>Match Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              ) : myWinnings.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                    <Trophy size={32} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
                    No winnings yet. Keep playing!
                  </td>
                </tr>
              ) : (
                myWinnings.map(w => {
                  const s = statusConfig[w.status] || statusConfig.pending;
                  const Icon = s.icon;
                  return (
                    <tr key={w._id}>
                      <td>{w.draw?.month || '—'}</td>
                      <td>{w.matchType ? `${w.matchType}-Number Match` : '—'}</td>
                      <td style={{ fontWeight: 700, color: '#34d399' }}>£{(w.prizeAmount || 0).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${s.cls}`} style={{ fontSize: '0.72rem' }}>
                          <Icon size={10} /> {s.label}
                        </span>
                      </td>
                      <td>
                        {w.status === 'pending' && !w.proofImage && (
                          <GlowButton size="sm" onClick={() => setProofModal(w)}>
                            <Upload size={12} /> Upload Proof
                          </GlowButton>
                        )}
                        {w.proofImage && (
                          <a href={w.proofImage} target="_blank" rel="noreferrer" style={{ color: '#60a5fa', fontSize: '0.82rem', textDecoration: 'none' }}>
                            View Proof →
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Proof upload modal */}
      <Modal open={!!proofModal} onClose={() => { setProofModal(null); setProofFile(null); }} title="Upload Winner Proof">
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
          Upload a screenshot of your scores from the golf platform (JPG/PNG/WEBP, max 5MB).
        </p>
        <div
          style={{
            border: '2px dashed rgba(255,255,255,0.15)', borderRadius: 12, padding: '32px',
            textAlign: 'center', marginBottom: 20, cursor: 'pointer',
            background: proofFile ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)',
          }}
          onClick={() => document.getElementById('proof-file').click()}
        >
          <Upload size={32} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 12px' }} />
          {proofFile ? (
            <p style={{ color: '#34d399', fontWeight: 600 }}>{proofFile.name}</p>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Click to select or drag your proof image</p>
          )}
          <input
            id="proof-file" type="file" accept="image/jpeg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={e => setProofFile(e.target.files[0])}
          />
        </div>
        <GlowButton variant="green" onClick={handleProofUpload} loading={uploading} style={{ width: '100%' }}>
          Submit Proof
        </GlowButton>
      </Modal>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Check, Plus } from 'lucide-react';
import { getCharities, selectCharity, donateToCharity } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import GlowButton from '../../components/GlowButton';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

export default function Charity() {
  const { user } = useAuth();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pct, setPct] = useState(user?.charityPercentage || 10);
  const [selecting, setSelecting] = useState(false);
  const [donateModal, setDonateModal] = useState(null);
  const [donateAmount, setDonateAmount] = useState('');
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    getCharities()
      .then(r => setCharities(r.data.charities || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = charities.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (charityId) => {
    setSelecting(true);
    try {
      await selectCharity({ charityId, charityPercentage: pct });
      toast.success('Charity selected! ❤️');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to select charity');
    } finally {
      setSelecting(false);
    }
  };

  const handleDonate = async () => {
    const amount = parseFloat(donateAmount);
    if (!amount || amount <= 0) { toast.error('Enter a valid amount'); return; }
    setDonating(true);
    try {
      await donateToCharity(donateModal._id, { amount, note: 'One-time donation' });
      toast.success(`£${amount} donated to ${donateModal.name} 🎉`);
      setDonateModal(null);
      setDonateAmount('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Donation failed');
    } finally {
      setDonating(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: 6 }}>
          My Charity
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Select your cause and adjust your contribution percentage</p>
      </motion.div>

      {/* Contribution slider */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '28px 32px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, marginBottom: 4 }}>Contribution Percentage</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Minimum 10% of your subscription</p>
          </div>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.2))',
            border: '2px solid rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: '1.3rem', color: '#34d399',
          }}>
            {pct}%
          </div>
        </div>
        <input
          type="range" min={10} max={100} value={pct}
          onChange={e => setPct(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer', marginBottom: 12 }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span>10% (min)</span><span>50%</span><span>100% (max)</span>
        </div>
      </motion.div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search charities..."
          className="glass-input"
          style={{ paddingLeft: 40 }}
        />
      </div>

      {/* Charity grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass" style={{ padding: 24, height: 160 }}>
              <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 60 }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
          <Heart size={48} style={{ opacity: 0.2, display: 'block', margin: '0 auto 16px' }} />
          <p>No charities found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map((c, i) => {
            const isSelected = user?.charity === c._id || user?.charity?._id === c._id;
            return (
              <motion.div
                key={c._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass"
                style={{
                  padding: 24,
                  borderColor: isSelected ? 'rgba(16,185,129,0.4)' : 'var(--glass-border)',
                  background: isSelected ? 'rgba(16,185,129,0.06)' : 'var(--glass-bg)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                  }}>
                    {c.spotlight ? '⭐' : '❤️'}
                  </div>
                  {isSelected && <span className="badge badge-active"><Check size={10} /> Selected</span>}
                </div>

                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: 8 }}>
                  {c.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {c.description || 'Supporting a worthy cause through golf.'}
                </p>

                <div style={{ display: 'flex', gap: 8 }}>
                  <GlowButton
                    size="sm"
                    variant={isSelected ? 'ghost' : 'primary'}
                    onClick={() => handleSelect(c._id)}
                    loading={selecting}
                    style={{ flex: 1 }}
                  >
                    {isSelected ? '✓ Selected' : 'Select'}
                  </GlowButton>
                  <GlowButton
                    size="sm"
                    variant="ghost"
                    onClick={() => setDonateModal(c)}
                    style={{ flex: 1 }}
                  >
                    Donate
                  </GlowButton>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Donate Modal */}
      <Modal open={!!donateModal} onClose={() => setDonateModal(null)} title={`Donate to ${donateModal?.name}`}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
          Make a one-time donation to support this cause directly.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Amount (£)
            </label>
            <input
              type="number" min={1} step="0.01"
              value={donateAmount}
              onChange={e => setDonateAmount(e.target.value)}
              placeholder="25.00"
              className="glass-input"
            />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[5, 10, 25, 50].map(a => (
              <button
                key={a}
                onClick={() => setDonateAmount(String(a))}
                style={{
                  padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem',
                  background: donateAmount === String(a) ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${donateAmount === String(a) ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  color: donateAmount === String(a) ? '#34d399' : 'var(--text-secondary)',
                }}
              >
                £{a}
              </button>
            ))}
          </div>
          <GlowButton variant="green" onClick={handleDonate} loading={donating}>
            Donate £{donateAmount || '0'}
          </GlowButton>
        </div>
      </Modal>
    </div>
  );
}

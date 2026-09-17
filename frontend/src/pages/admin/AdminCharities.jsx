import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { getCharities, createCharity, updateCharity, deleteCharity } from '../../api/api';
import GlowButton from '../../components/GlowButton';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

export default function AdminCharities() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', spotlight: false });
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchCharities = () =>
    getCharities()
      .then(r => setCharities(r.data.charities || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => { fetchCharities(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', spotlight: false }); setModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({ name: c.name, description: c.description || '', spotlight: c.spotlight || false }); setModal(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateCharity(editing._id, form);
        toast.success('Charity updated');
      } else {
        await createCharity(form);
        toast.success('Charity created');
      }
      setModal(false);
      fetchCharities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this charity?')) return;
    setDeleting(id);
    try {
      await deleteCharity(id);
      toast.success('Charity deleted');
      fetchCharities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally { setDeleting(null); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: 6 }}>Charities</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage charity listings and spotlight features</p>
        </div>
        <GlowButton onClick={openAdd}><Plus size={16} /> Add Charity</GlowButton>
      </motion.div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass" style={{ height: 160, borderRadius: 16 }}><div className="skeleton" style={{ height: '100%' }} /></div>)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {charities.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass"
              style={{ padding: 24, position: 'relative' }}
            >
              {c.spotlight && (
                <div style={{ position: 'absolute', top: 16, right: 16 }}>
                  <span className="badge badge-pending" style={{ fontSize: '0.65rem' }}>⭐ Spotlight</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                  ❤️
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem' }}>{c.name}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {c.description || 'No description'}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(c)} style={{ flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600 }}>
                  <Edit2 size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(c._id)} disabled={deleting === c._id} style={{ flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600 }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Charity' : 'Add Charity'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Charity name" className="glass-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." className="glass-input" rows={3} style={{ resize: 'vertical' }} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.spotlight} onChange={e => setForm({ ...form, spotlight: e.target.checked })} style={{ accentColor: '#f59e0b' }} />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Mark as Spotlight Charity</span>
          </label>
          <GlowButton onClick={handleSave} loading={saving} style={{ width: '100%' }}>
            {editing ? 'Save Changes' : 'Create Charity'}
          </GlowButton>
        </div>
      </Modal>
    </div>
  );
}

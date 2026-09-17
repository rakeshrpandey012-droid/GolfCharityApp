import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Edit2, Check, X } from 'lucide-react';
import { getAdminUsers, updateAdminUser } from '../../api/api';
import { TableRowSkeleton } from '../../components/Skeletons';
import GlowButton from '../../components/GlowButton';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchUsers = (q = '') =>
    getAdminUsers(q)
      .then(r => setUsers(r.data.users || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchUsers(e.target.value);
  };

  const startEdit = (user) => {
    setEditing(user._id);
    setEditForm({ name: user.name, subscriptionStatus: user.subscriptionStatus, role: user.role });
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      await updateAdminUser(id, editForm);
      toast.success('User updated');
      setEditing(null);
      fetchUsers(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: 6 }}>Users</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all registered users</p>
        </div>
        <span className="badge badge-blue">{users.length} users</span>
      </motion.div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" value={search} onChange={handleSearch} placeholder="Search by name or email..." className="glass-input" style={{ paddingLeft: 40 }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Subscription</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                      <Users size={32} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
                      No users found
                    </td>
                  </tr>
                ) : users.map(u => (
                  <tr key={u._id}>
                    <td>
                      {editing === u._id ? (
                        <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="glass-input" style={{ padding: '6px 10px', fontSize: '0.85rem' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
                        </div>
                      )}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      {editing === u._id ? (
                        <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="glass-input" style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`badge ${u.role === 'admin' ? 'badge-blue' : 'badge-pending'}`} style={{ fontSize: '0.7rem' }}>
                          {u.role}
                        </span>
                      )}
                    </td>
                    <td>
                      {editing === u._id ? (
                        <select value={editForm.subscriptionStatus} onChange={e => setEditForm({ ...editForm, subscriptionStatus: e.target.value })} className="glass-input" style={{ padding: '6px 10px', fontSize: '0.85rem' }}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="expired">Expired</option>
                        </select>
                      ) : (
                        <span className={`badge ${u.subscriptionStatus === 'active' ? 'badge-active' : 'badge-inactive'}`} style={{ fontSize: '0.7rem' }}>
                          {u.subscriptionStatus}
                        </span>
                      )}
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>
                    <td>
                      {editing === u._id ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => saveEdit(u._id)} disabled={saving} style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#34d399', display: 'flex', alignItems: 'center' }}>
                            <Check size={14} />
                          </button>
                          <button onClick={() => setEditing(null)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#f87171', display: 'flex', alignItems: 'center' }}>
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(u)} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: '#60a5fa', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

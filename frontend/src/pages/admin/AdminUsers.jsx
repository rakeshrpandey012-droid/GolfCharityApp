import React, { useEffect, useState } from 'react'
import { Users, Search, Edit2, Check, X, Trash2 } from 'lucide-react'
import { getAdminUsers, updateAdminUser, createAdminUser, deleteAdminUser } from '../../api/api'
import { TableRowSkeleton } from '../../components/Skeletons'
import GlowButton from '../../components/GlowButton'
import Modal from '../../components/Modal'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    subscriptionStatus: 'active'
  })
  const [addErrors, setAddErrors] = useState({})

  const fetchUsers = (q = '') => {
    setLoading(true)
    getAdminUsers(q)
      .then(r => setUsers(r.data.users || r.data || []))
      .catch(err => {
        toast.error(err.response?.data?.message || 'Failed to fetch users')
        console.error('Fetch users error:', err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    fetchUsers(value)
  }

  const startEdit = (user) => {
    setEditing(user._id)
    setEditForm({
      name: user.name,
      subscriptionStatus: user.subscriptionStatus,
      role: user.role
    })
  }

  const saveEdit = async (id) => {
    setSaving(true)
    try {
      await updateAdminUser(id, editForm)
      toast.success('User updated successfully')
      setEditing(null)
      fetchUsers(search)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user')
      console.error('Update error:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    setSaving(true)
    try {
      await deleteAdminUser(id)
      toast.success('User deleted successfully')
      fetchUsers(search)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user')
      console.error('Delete error:', err)
    } finally {
      setSaving(false)
    }
  }

  // Validation for add user form
  const validateAddForm = () => {
    const errors = {}
    if (!addForm.name.trim()) errors.name = 'Name is required'
    if (!addForm.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email)) errors.email = 'Invalid email format'
    if (!addForm.password.trim()) errors.password = 'Password is required'
    else if (addForm.password.length < 6) errors.password = 'Password must be at least 6 characters'
    return errors
  }

  const handleAdd = async () => {
    const errors = validateAddForm()
    if (Object.keys(errors).length > 0) {
      setAddErrors(errors)
      toast.error('Please fix the errors before submitting')
      return
    }

    setSaving(true)
    try {
      await createAdminUser(addForm)
      toast.success('User created successfully')
      setAddOpen(false)
      setAddForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
        subscriptionStatus: 'active'
      })
      setAddErrors({})
      fetchUsers(search)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user')
      console.error('Create error:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Header Section */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: 6 }}>
            Users
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage all registered users</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge badge-blue">{users.length} users</span>
          <GlowButton onClick={() => setAddOpen(true)}>Add User</GlowButton>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: 24, maxWidth: 400 }}>
        <Search
          size={16}
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }}
        />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search by name or email..."
          className="glass-input"
          style={{ paddingLeft: 40 }}
        />
      </div>

      {/* Users Table */}
      <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
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
                ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={6} />
                ))
                : users.length === 0
                ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                      <Users size={32} style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }} />
                      No users found
                    </td>
                  </tr>
                )
                : users.map(u => (
                  <tr key={u._id}>
                    {/* Name Cell */}
                    <td>
                      {editing === u._id ? (
                        <input
                          value={editForm.name}
                          onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                          className="glass-input"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              flexShrink: 0
                            }}>
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {u.name}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Email Cell */}
                    <td>{u.email}</td>

                    {/* Role Cell */}
                    <td>
                      {editing === u._id ? (
                        <select
                          value={editForm.role}
                          onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                          className="glass-input"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`badge ${u.role === 'admin' ? 'badge-blue' : 'badge-pending'}`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {u.role}
                        </span>
                      )}
                    </td>

                    {/* Subscription Cell */}
                    <td>
                      {editing === u._id ? (
                        <select
                          value={editForm.subscriptionStatus}
                          onChange={e => setEditForm({ ...editForm, subscriptionStatus: e.target.value })}
                          className="glass-input"
                          style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="expired">Expired</option>
                        </select>
                      ) : (
                        <span
                          className={`badge ${
                            u.subscriptionStatus === 'active' ? 'badge-active' : 'badge-inactive'
                          }`}
                          style={{ fontSize: '0.7rem' }}
                        >
                          {u.subscriptionStatus}
                        </span>
                      )}
                    </td>

                    {/* Joined Date Cell */}
                    <td>{new Date(u.createdAt).toLocaleDateString('en-GB')}</td>

                    {/* Actions Cell */}
                    <td>
                      {editing === u._id ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => saveEdit(u._id)}
                            disabled={saving}
                            style={{
                              background: 'rgba(16,185,129,0.2)',
                              border: '1px solid rgba(16,185,129,0.3)',
                              borderRadius: 8,
                              padding: '6px 10px',
                              cursor: saving ? 'not-allowed' : 'pointer',
                              color: '#34d399',
                              display: 'flex',
                              alignItems: 'center',
                              opacity: saving ? 0.5 : 1
                            }}
                            title="Save changes"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => setEditing(null)}
                            style={{
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.2)',
                              borderRadius: 8,
                              padding: '6px 10px',
                              cursor: 'pointer',
                              color: '#f87171',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Cancel editing"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button
                            onClick={() => startEdit(u)}
                            style={{
                              background: 'rgba(59,130,246,0.1)',
                              border: '1px solid rgba(59,130,246,0.2)',
                              borderRadius: 8,
                              padding: '6px 10px',
                              cursor: 'pointer',
                              color: '#60a5fa',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: '0.8rem'
                            }}
                            title="Edit user"
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            style={{
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.2)',
                              borderRadius: 8,
                              padding: '6px 10px',
                              cursor: 'pointer',
                              color: '#f87171',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: '0.8rem'
                            }}
                            title="Delete user"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create New User">
        <div className="flex flex-col gap-4">
          <div>
            <input
              className="glass-input"
              placeholder="Name"
              value={addForm.name}
              onChange={e => {
                setAddForm({ ...addForm, name: e.target.value })
                if (addErrors.name) setAddErrors({ ...addErrors, name: '' })
              }}
            />
            {addErrors.name && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 4 }}>{addErrors.name}</p>}
          </div>

          <div>
            <input
              className="glass-input"
              placeholder="Email"
              type="email"
              value={addForm.email}
              onChange={e => {
                setAddForm({ ...addForm, email: e.target.value })
                if (addErrors.email) setAddErrors({ ...addErrors, email: '' })
              }}
            />
            {addErrors.email && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 4 }}>{addErrors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              className="glass-input"
              placeholder="Password (min 6 characters)"
              value={addForm.password}
              onChange={e => {
                setAddForm({ ...addForm, password: e.target.value })
                if (addErrors.password) setAddErrors({ ...addErrors, password: '' })
              }}
            />
            {addErrors.password && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 4 }}>{addErrors.password}</p>}
          </div>

          <select className="glass-input" value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select className="glass-input" value={addForm.subscriptionStatus} onChange={e => setAddForm({ ...addForm, subscriptionStatus: e.target.value })}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              className="btn btn-sm"
              onClick={() => {
                setAddOpen(false)
                setAddErrors({})
              }}
              disabled={saving}
            >
              Cancel
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={saving}>
              {saving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

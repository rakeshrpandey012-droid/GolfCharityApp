import React, { useState, useEffect } from "react";
import { Plus, RefreshCcw, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  createDraftDraw,
  getDrawHistory,
  simulateDraw,
  publishDraw,
  deleteDraw
} from "../../api/api";
import toast from "react-hot-toast";

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/Modal';

export default function AdminDraw() {
  const [month, setMonth] = useState('');
  const [type, setType] = useState('random');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await getDrawHistory();
      setHistory(res.draws || res.data?.draws || res.data || []);
    } catch {
      setHistory([]);
    } finally {
      setInitialLoad(false);
    }
  }

  const handleCreate = async () => {
    if (!month) return toast.error('Month is required');
    setLoading(true);
    try {
      await createDraftDraw({ month, type });
      toast.success('Draft created');
      await loadHistory();
      setMonth('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create draft');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async (id) => {
    try {
      await simulateDraw(id);
      toast.success('Simulation complete');
      await loadHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Simulation failed');
    }
  };

  const handlePublish = async (id) => {
    if (!window.confirm('Are you sure you want to publish? This will finalize winners.')) return;
    try {
      await publishDraw(id);
      toast.success('Draw published successfully');
      await loadHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Publish failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this draw?')) return;
    try {
      await deleteDraw(id);
      toast.success('Draw deleted');
      await loadHistory();
    } catch (error) {
      toast.error('Failed to delete draw');
    }
  };

  return (
    <div className="page-container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Draw Management</h1>
        <p className="text-secondary">Create drafts, run simulations, and publish official draws.</p>
      </div>

      <Card style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Create New Draw</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Draw Month</label>
            <Input type="month" value={month} onChange={e => setMonth(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Draw Type</label>
            <select 
              value={type} 
              onChange={e => setType(e.target.value)}
              className="glass-input"
              style={{ width: '100%' }}
            >
              <option value="random">Random Standard</option>
              <option value="algorithm">Algorithmic Weighted</option>
            </select>
          </div>
          <Button onClick={handleCreate} disabled={loading} className="btn-glow-cyan" style={{ height: '44px' }}>
            {loading ? 'Creating...' : <><Plus size={16}/> Create Draft</>}
          </Button>
        </div>
      </Card>

      <Card>
        <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Draw History & Drafts</h3>
        
        {initialLoad ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
        ) : history.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>No draws created yet.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.map((d, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={d._id} 
                style={{ 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                  padding: '16px', background: 'var(--bg-secondary)', 
                  border: '1px solid var(--border-color)', borderRadius: '12px',
                  flexWrap: 'wrap', gap: '16px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>{d.month || 'Unknown Month'}</div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <span style={{ textTransform: 'capitalize' }}>Type: {d.type || 'random'}</span>
                    <span>•</span>
                    <span style={{ 
                      color: d.status === 'published' ? 'var(--color-success)' : 'var(--color-warning)',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      {d.status === 'published' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                      {d.status}
                    </span>
                    <span>•</span>
                    <span>Pool: £{(d.totalPool || 0).toFixed(2)}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  {d.status === 'draft' && (
                    <>
                      <Button variant="secondary" onClick={() => handleSimulate(d._id)}>
                        <RefreshCcw size={14} /> Simulate
                      </Button>
                      <Button onClick={() => handlePublish(d._id)} style={{ background: 'var(--color-success)', color: '#fff', border: 'none' }}>
                        Publish Official
                      </Button>
                      <Button variant="secondary" onClick={() => handleDelete(d._id)} style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                        Delete
                      </Button>
                    </>
                  )}
                  {d.status === 'published' && (
                    <Button variant="secondary" disabled>
                      Published Final
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

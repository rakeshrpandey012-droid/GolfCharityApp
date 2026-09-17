import React, { useState } from 'react';
import { Target, Calendar, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Scores() {
  const [scores, setScores] = useState([
    { id: 1, date: '2026-09-10', score: 32 },
    { id: 2, date: '2026-09-12', score: 36 },
    { id: 3, date: '2026-09-14', score: 28 },
    { id: 4, date: '2026-09-16', score: 40 },
  ]);

  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], score: '' });

  const handleAddScore = (e) => {
    e.preventDefault();
    const val = parseInt(form.score, 10);
    if (isNaN(val) || val < 1 || val > 45) {
      return toast.error("Score must be between 1 and 45.");
    }
    
    // Check if score exists for that date
    if (scores.some(s => s.date === form.date)) {
      return toast.error("A score for this date already exists.");
    }

    const newScore = { id: Date.now(), date: form.date, score: val };
    
    // Maintain only the latest 5 scores (simulate PRD logic)
    const updated = [newScore, ...scores].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    setScores(updated);
    setForm({ ...form, score: '' });
    toast.success("Score added successfully!");
  };

  const handleDelete = (id) => {
    setScores(scores.filter(s => s.id !== id));
    toast.success("Score deleted.");
  };

  // Chart data reversed for chronological left-to-right display
  const chartData = [...scores].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="page-container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Score Management</h1>
        <p className="text-secondary">Enter your latest Stableford scores. The last 5 scores are used for the draw.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px', alignItems: 'start' }}>
        
        {/* Left Column: History & Trends */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <TrendingUp color="var(--brand-primary)" />
              <h3 style={{ fontSize: '18px' }}>Performance Trend</h3>
            </div>
            
            <div style={{ height: '250px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 45]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', borderRadius: '8px' }} 
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="var(--brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Recent Scores ({scores.length}/5)</h3>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                  <tr>
                    <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>Date</th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)' }}>Stableford Score</th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {scores.map((s) => (
                      <motion.tr 
                        key={s.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ borderBottom: '1px solid var(--border-color)' }}
                      >
                        <td style={{ padding: '16px' }}>{s.date}</td>
                        <td style={{ padding: '16px', fontWeight: 600 }}>{s.score}</td>
                        <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {scores.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-tertiary)' }}>No scores logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Entry Form */}
        <Card style={{ position: 'sticky', top: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '8px', borderRadius: '8px' }}>
              <Target size={20} color="var(--brand-primary)" />
            </div>
            <h3 style={{ fontSize: '18px', margin: 0 }}>Log New Score</h3>
          </div>

          <form onSubmit={handleAddScore}>
            <Input 
              label="Date Played"
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              iconLeft={<Calendar size={18} />}
              required
            />
            
            <Input 
              label="Stableford Score (1-45)"
              type="number"
              id="score"
              name="score"
              min="1"
              max="45"
              placeholder="e.g. 36"
              value={form.score}
              onChange={(e) => setForm({ ...form, score: e.target.value })}
              iconLeft={<Target size={18} />}
              required
            />

            <Button type="submit" style={{ width: '100%', marginTop: '16px' }}>
              Add Score
            </Button>
          </form>

          <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
            <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>How it works</h4>
            <p className="text-secondary text-body-small">
              Only your most recent 5 scores are kept. Submitting a new score will automatically replace your oldest entry if you already have 5.
            </p>
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .page-container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

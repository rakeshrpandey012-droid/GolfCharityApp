import React, { useState } from 'react';
import { Target, Calendar, Trash2, Edit2, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

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
          <Card style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card, 0 8px 24px rgba(15, 23, 42, 0.08))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <TrendingUp color="var(--brand-primary)" />
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Performance Trend</h3>
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
                    contentStyle={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    labelStyle={{ color: 'var(--text-secondary)' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="var(--brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card, 0 8px 24px rgba(15, 23, 42, 0.08))' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '24px', color: 'var(--text-primary)' }}>Recent Scores ({scores.length}/5)</h3>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-primary)' }}>
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
                      <tr
                        key={s.id}
                        style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}
                      >
                        <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{s.date}</td>
                        <td style={{ padding: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{s.score}</td>
                        <td style={{ padding: '16px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
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
        <Card style={{
          position: 'sticky',
          top: '24px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-card, 0 8px 24px rgba(15, 23, 42, 0.08))',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{
              background: 'var(--brand-dim, rgba(79, 70, 229, 0.12))',
              padding: '10px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--border-color)'
            }}>
              <Target size={20} color="var(--brand-primary)" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Score Entry
              </p>
              <h3 style={{ fontSize: '20px', margin: '4px 0 0', color: 'var(--text-primary)' }}>Log New Score</h3>
            </div>
          </div>

          <form onSubmit={handleAddScore} style={{ display: 'grid', gap: '18px' }}>
            <div style={{ display: 'grid', gap: '8px' }}>
              <Input
                label="Date Played"
                type="date"
                id="date"
                name="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                iconLeft={<Calendar size={18} />}
                required
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.04)',
                  fontSize: '1rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
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
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.04)',
                  fontSize: '1rem',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <Button
              type="submit"
              style={{
                width: '100%',
                marginTop: '8px',
                background: 'linear-gradient(135deg, var(--brand-primary), #8b5cf6)',
                border: 'none',
                boxShadow: '0 15px 30px rgba(79, 70, 229, 0.18)',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: '#ffffff'
              }}
            >
              Add Score
            </Button>
          </form>

          <div style={{
            marginTop: '24px',
            padding: '16px 18px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px'
          }}>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-primary)' }}>How it works</h4>
            <p className="text-secondary text-body-small" style={{ margin: 0, lineHeight: 1.6 }}>
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

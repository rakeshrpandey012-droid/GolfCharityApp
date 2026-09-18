import React, { useState } from 'react';
import { Play, Zap, FileText, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function AdminDraw() {
  const [drawType, setDrawType] = useState('manual');
  const [manualNumbers, setManualNumbers] = useState(['5', '10', '20', '30', '45']);

  const handleQuickRun = () => {
    toast.success("Quick run initiated!");
  };

  return (
    <div className="page-container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Draw Control</h1>
        <p className="text-secondary" style={{ fontSize: '14px' }}>Create, simulate, and publish monthly prize draws</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Create Draw Panel */}
        <Card>
          <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Create Draw</h3>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Draw Type</label>
            <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-primary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              {['Random', 'Logic', 'Manual'].map((type) => {
                const isActive = drawType === type.toLowerCase();
                return (
                  <button
                    key={type}
                    onClick={() => setDrawType(type.toLowerCase())}
                    style={{
                      flex: 1, padding: '8px 0', border: 'none', borderRadius: '4px',
                      background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                      color: isActive ? '#a78bfa' : 'var(--text-secondary)',
                      fontSize: '12px', fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer', transition: 'all 0.2s',
                      boxShadow: isActive ? 'inset 0 0 10px rgba(168,85,247,0.1)' : 'none'
                    }}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>

          {drawType === 'manual' && (
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Enter 5 numbers (1-45):</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {manualNumbers.map((num, i) => (
                  <input 
                    key={i}
                    type="number"
                    value={num}
                    onChange={(e) => {
                      const newNums = [...manualNumbers];
                      newNums[i] = e.target.value;
                      setManualNumbers(newNums);
                    }}
                    style={{ 
                      flex: 1, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', 
                      borderRadius: '8px', padding: '12px 4px', textAlign: 'center', 
                      color: 'white', fontWeight: 600, fontSize: '16px'
                    }} 
                  />
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button className="btn-glow" style={{ justifyContent: 'flex-start' }}><FileText size={16} /> Create Draft</Button>
            <Button variant="secondary" style={{ justifyContent: 'flex-start', background: 'rgba(255,255,255,0.02)', border: 'none' }}><Settings size={16} /> Simulate Draft</Button>
            <Button className="btn-glow-cyan" style={{ justifyContent: 'flex-start' }}><Play size={16} /> Publish Draw</Button>
            
            <div style={{ borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />

            <Button onClick={handleQuickRun} style={{ justifyContent: 'flex-start', background: 'linear-gradient(90deg, #4F46E5, #A855F7)', boxShadow: '0 0 25px rgba(79, 70, 229, 0.6)', border: 'none' }}>
              <Zap size={16} /> Quick Run (Draft + Publish)
            </Button>
          </div>
        </Card>

        {/* Current Draw Panel */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px' }}>Current Draw</h3>
            <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--color-warning)', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>Draft</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Month</label>
              <div style={{ fontSize: '18px', fontWeight: 600 }}>—</div>
            </div>

            <div>
              <label style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Draw Numbers</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Waiting for draft...</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Prize Pool</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-warning)' }}>£0.00</div>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Subscribers</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--brand-primary)' }}>0</div>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Jackpot C/F</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--brand-secondary)' }}>£0.00</div>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Type</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-success)' }}>random</div>
              </div>
            </div>
          </div>
        </Card>

      </div>

      <Card>
        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Draw History</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead style={{ borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>MONTH</th>
              <th style={{ padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>NUMBERS</th>
              <th style={{ padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>STATUS</th>
              <th style={{ padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>POOL</th>
              <th style={{ padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>SUBSCRIBERS</th>
              <th style={{ padding: '12px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>TYPE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="6" style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>No history available</td>
            </tr>
          </tbody>
        </table>
      </Card>

    </div>
  );
}

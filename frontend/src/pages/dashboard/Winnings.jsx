import React, { useState } from 'react';
import { Trophy, Download, Share2, CheckCircle2, Clock, AlertCircle, Upload, X, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function Winnings() {
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setShowModal(false);
    }, 2000);
  };

  const winningsHistory = [
    { id: 'DRW-004', date: 'Aug 2026', match: 3, prize: '$125.00', status: 'paid' },
    { id: 'DRW-002', date: 'Jun 2026', match: 4, prize: '$725.00', status: 'paid' },
  ];

  const recentDraw = {
    date: 'Sep 2026',
    drawNumbers: [12, 24, 31, 38, 42],
    yourNumbers: [12, 22, 31, 35, 42],
    matchedCount: 3,
    prize: '$140.00',
    status: 'pending' // pending payout
  };

  const StatusBadge = ({ status }) => {
    if (status === 'paid') return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}><CheckCircle2 size={12} /> Paid</span>;
    if (status === 'pending') return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-warning)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}><Clock size={12} /> Processing</span>;
    return null;
  };

  return (
    <div className="page-container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>My Winnings</h1>
          <p className="text-secondary">View draw results, track your payouts, and upload proof.</p>
        </div>
        <Button className="btn-glow-cyan" onClick={() => setShowModal(true)}>
          <Camera size={16} /> Upload Proof
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        {/* Latest Draw Results */}
        <Card style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>Latest Draw: {recentDraw.date}</h3>
              <p className="text-secondary text-body-small">You matched {recentDraw.matchedCount} numbers!</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estimated Prize</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--brand-primary)' }}>{recentDraw.prize}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', background: 'var(--bg-secondary)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            
            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>Winning Draw Numbers</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {recentDraw.drawNumbers.map((num, i) => (
                  <div key={i} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600 }}>
                    {num}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px', fontWeight: 600 }}>Your Logged Scores</div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {recentDraw.yourNumbers.map((num, i) => {
                  const isMatch = recentDraw.drawNumbers.includes(num);
                  return (
                    <motion.div 
                      initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}
                      key={i} 
                      style={{ 
                        width: '48px', height: '48px', borderRadius: '50%', 
                        background: isMatch ? 'var(--brand-primary)' : 'var(--bg-primary)', 
                        color: isMatch ? '#fff' : 'inherit',
                        border: isMatch ? 'none' : '1px solid var(--border-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600,
                        boxShadow: isMatch ? '0 4px 12px rgba(79, 70, 229, 0.4)' : 'none'
                      }}
                    >
                      {num}
                    </motion.div>
                  )
                })}
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              <AlertCircle size={16} /> Admin verification pending. Payouts process within 3 days.
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary"><Share2 size={16} /> Share Result</Button>
            </div>
          </div>
        </Card>

      </div>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px' }}>Winnings History</h3>
          <Button variant="tertiary"><Download size={16} /> Statement</Button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead style={{ background: 'var(--bg-secondary)' }}>
              <tr>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Draw ID</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Date</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Match</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Prize</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                <th style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {winningsHistory.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '16px', fontWeight: 500 }}>{row.id}</td>
                  <td style={{ padding: '16px' }}>{row.date}</td>
                  <td style={{ padding: '16px' }}>{row.match} Numbers</td>
                  <td style={{ padding: '16px', fontWeight: 600 }}>{row.prize}</td>
                  <td style={{ padding: '16px' }}><StatusBadge status={row.status} /></td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upload Winner Proof Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="modal-content"
            >
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={16} /></button>
              
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Upload Winner Proof</h3>
              <p className="text-secondary" style={{ fontSize: '12px', marginBottom: '24px' }}>
                Upload a screenshot of your scores from the golf platform (JPG/PNG/WEBP, max 5MB).
              </p>

              <div 
                className="dropzone" 
                onClick={() => setUploadedFileName('Screenshot 2026-03-27 095854.png')}
              >
                <Upload size={24} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
                {uploadedFileName ? (
                  <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '14px' }}>{uploadedFileName}</span>
                ) : (
                  <span className="text-secondary" style={{ fontSize: '14px' }}>Click to select a file or drag and drop</span>
                )}
              </div>

              <div style={{ marginTop: '24px' }}>
                <Button 
                  className={uploading ? 'btn-glow-cyan' : ''} 
                  variant={uploading ? 'primary' : 'secondary'}
                  loading={uploading} 
                  onClick={handleUpload}
                  disabled={!uploadedFileName}
                  style={{ width: '100%', height: '48px' }}
                >
                  {uploading ? 'Loading...' : 'Upload Proof'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

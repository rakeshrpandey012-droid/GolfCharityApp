import React, { useMemo } from 'react';

export function StatCardSkeleton() {
  return (
    <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="skeleton" style={{ height: 14, width: '60%' }} />
      <div className="skeleton" style={{ height: 32, width: '40%' }} />
      <div className="skeleton" style={{ height: 12, width: '80%' }} />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  const widths = useMemo(() => {
    return Array.from({ length: cols }, (_, index) => `${60 + ((index * 11) % 30)}%`);
  }, [cols]);

  return (
    <tr>
      {widths.map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div className="skeleton" style={{ height: 14, width: w }} />
        </td>
      ))}
    </tr>
  );
}

export function CardSkeleton({ height = 200 }) {
  return (
    <div className="glass" style={{ padding: 24, height }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="skeleton" style={{ height: 16, width: '50%' }} />
        <div className="skeleton" style={{ height: height - 80 }} />
      </div>
    </div>
  );
}

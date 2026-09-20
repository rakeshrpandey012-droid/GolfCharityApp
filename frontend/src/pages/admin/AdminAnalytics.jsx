import React, { useEffect, useState } from 'react';
import { getAnalytics, getDrawHistory } from '../../api/api';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import Card from '../../components/ui/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: 'var(--bg-tertiary)', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontWeight: 600, color: p.color }}>{p.name}: £{p.value}</div>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getAnalytics(), getDrawHistory()])
      .then(results => {
        const a = results[0]?.status === 'fulfilled' ? (results[0].value.data?.metrics || results[0].value.data || {}) : {};
        const h = results[1]?.status === 'fulfilled' ? (results[1].value.draws || results[1].value.data?.draws || results[1].value.data || []) : [];
        setAnalytics(a);
        setHistory(h);
      })
      .finally(() => setLoading(false));
  }, []);

  const areaData = history.length ? [...history].reverse().map(d => ({
    name: d.month?.split('-').reverse().join('/') || 'Draw',
    prizePool: d.totalPool || 0
  })) : [{ name: 'No Data', prizePool: 0 }];

  return (
    <div className="page-container" style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Platform Analytics</h1>
        <p className="text-secondary">Overview of user growth, revenue, and charity impact.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <Card style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Users</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>{analytics.totalUsers || 0}</div>
        </Card>
        <Card style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Prize Pool</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--brand-primary)' }}>£{(analytics.totalPrizePool || 0).toLocaleString()}</div>
        </Card>
        <Card style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Charities Supported</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-success)' }}>{analytics.charityCount || 0}</div>
        </Card>
        <Card style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Draws</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>{analytics.drawCount || history.length}</div>
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: '18px', marginBottom: '24px' }}>Prize Pool Growth</h3>
        <div style={{ height: '320px' }}>
          {loading ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>Loading chart data...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradPool" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="var(--text-tertiary)" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="prizePool" name="Prize Pool" stroke="var(--brand-primary)" strokeWidth={3} fillOpacity={1} fill="url(#gradPool)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}

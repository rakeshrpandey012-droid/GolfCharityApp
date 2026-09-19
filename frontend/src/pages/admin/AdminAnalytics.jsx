import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getAnalytics, getDrawHistory } from '../../api/api';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SimpleTooltip = ({ active, payload, label }) => {
	if (!active || !payload || !payload.length) return null;
	return (
		<div style={{ background: '#0b1220', padding: 8, borderRadius: 8, color: 'white' }}>
			<div style={{ fontSize: 12, opacity: 0.8 }}>{label}</div>
			{payload.map((p, i) => (
				<div key={i} style={{ fontWeight: 600 }}>{p.name}: £{p.value}</div>
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
				const a = results[0]?.status === 'fulfilled' ? (results[0].value.data.metrics || results[0].value.data) : {};
				const h = results[1]?.status === 'fulfilled' ? (results[1].value.data.draws || results[1].value.data || []) : [];
				setAnalytics(a);
				setHistory(h);
			})
			.finally(() => setLoading(false));
	}, []);

	const areaData = history.length ? history.slice(0, 6).reverse().map(d => ({
		name: d.month?.split(' ')[0] || 'Draw',
		revenue: (d.totalPool || 0) * 2,
		prize: d.totalPool || 0
	})) : [{ name: 'No Data', revenue: 0, prize: 0 }];

	return (
		<div style={{ paddingBottom: 40 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
				<h2 style={{ fontSize: 22, fontWeight: 600 }}>Platform Analytics</h2>
				<div style={{ display: 'flex', gap: 8 }}>
					<button style={{ padding: '6px 12px', borderRadius: 8, background: '#111827', color: 'white' }}>Dashboard</button>
					<button style={{ padding: '6px 12px', borderRadius: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.04)' }}>Reports</button>
				</div>
			</div>

			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
				<div style={{ padding: 12, background: 'white', borderRadius: 8 }}>
					<div style={{ fontSize: 12, color: '#6b7280' }}>Total Users</div>
					<div style={{ fontSize: 20, fontWeight: 700 }}>{analytics.totalUsers || 0}</div>
				</div>
				<div style={{ padding: 12, background: 'white', borderRadius: 8 }}>
					<div style={{ fontSize: 12, color: '#6b7280' }}>Prize Pool</div>
					<div style={{ fontSize: 20, fontWeight: 700 }}>£{(analytics.totalPrizePool || 0).toLocaleString()}</div>
				</div>
				<div style={{ padding: 12, background: 'white', borderRadius: 8 }}>
					<div style={{ fontSize: 12, color: '#6b7280' }}>Charities</div>
					<div style={{ fontSize: 20, fontWeight: 700 }}>{analytics.charityCount || 0}</div>
				</div>
				<div style={{ padding: 12, background: 'white', borderRadius: 8 }}>
					<div style={{ fontSize: 12, color: '#6b7280' }}>Draws</div>
					<div style={{ fontSize: 20, fontWeight: 700 }}>{analytics.drawCount || history.length}</div>
				</div>
			</div>

			<div style={{ background: 'white', borderRadius: 10, padding: 18, height: 320 }}>
				{loading ? (
					<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>Loading…</div>
				) : (
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={areaData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
							<defs>
								<linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
									<stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6e6e6" />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip content={<SimpleTooltip />} />
							<Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#gradRev)" />
						</AreaChart>
					</ResponsiveContainer>
				)}
			</div>
		</div>
	);
}


import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="page-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#3b82f6', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
        }} />
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="page-bg dashboard-root">
      <Sidebar />
      {/* Spacer for fixed mobile top bar */}
      <div className="mobile-topbar-spacer" />
      <main className="dashboard-main dashboard-content">
        <Outlet />
      </main>
      {/* Spacer for fixed bottom tab bar */}
      {user?.role !== 'admin' && <div className="mobile-tabbar-spacer" />}
    </div>
  );
}

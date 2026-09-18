import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion as FramerMotion } from 'framer-motion';
import {
  LayoutDashboard, Target, Heart, Trophy, Users,
  Dice5, BarChart2, LogOut, X, Menu,
} from 'lucide-react';
import { useAuth }  from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

const userLinks = [
  { to: '/dashboard',          icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/scores',   icon: Target,          label: 'My Scores' },
  { to: '/dashboard/charity',  icon: Heart,           label: 'Charity' },
  { to: '/dashboard/winnings', icon: Trophy,          label: 'Winnings' },
];

const adminLinks = [
  { to: '/admin',              icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/admin/users',        icon: Users,           label: 'Users' },
  { to: '/admin/draw',         icon: Dice5,           label: 'Draw Control' },
  { to: '/admin/charities',    icon: Heart,           label: 'Charities' },
  { to: '/admin/winners',      icon: Trophy,          label: 'Winners' },
  { to: '/admin/analytics',    icon: BarChart2,       label: 'Analytics' },
];

/* ── Theme toggle pill ─────────────────────────────────────────────────── */
function ThemeTogglePill() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="theme-toggle-knob">
        {theme === 'dark' ? '🌙' : '☀️'}
      </div>
    </button>
  );
}

const SidebarContent = ({
  user,
  links,
  inDrawer = false,
  setDrawerOpen,
  onLogout,
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    {/* ── Logo ─────────────────────────────────────────── */}
    <div className="sidebar-logo-area">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="sidebar-logo-icon">⛳</div>
          <div>
            <div className="sidebar-logo-text">
              Golf<span className="gradient-text">Win</span>
            </div>
            <div className="sidebar-logo-sub">
              {user?.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
            </div>
          </div>
        </div>
        {inDrawer && (
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer', padding: 6, display: 'flex' }}
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>

    {/* ── User Card ─────────────────────────────────────── */}
    <div className="sidebar-user-area">
      <div className="sidebar-user-card">
        <div className="sidebar-avatar">
          {user?.name?.[0]?.toUpperCase() || 'G'}
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name || 'Golfer'}
          </div>
          <span className={`badge ${user?.subscriptionStatus === 'active' ? 'badge-active' : 'badge-inactive'}`} style={{ fontSize: '0.6rem', padding: '2px 7px' }}>
            {user?.subscriptionStatus === 'active' ? '● Active' : '● Inactive'}
          </span>
        </div>
      </div>
    </div>

    {/* ── Nav Links ─────────────────────────────────────── */}
    <nav className="sidebar-nav">
      <div className="sidebar-nav-label">Navigation</div>
      {links.map((link) => {
        const { to, icon: IconComponent, label, end } = link;
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <IconComponent size={17} />
            <span>{label}</span>
          </NavLink>
        );
      })}
    </nav>

    {/* ── Actions ───────────────────────────────────────── */}
    <div className="sidebar-actions">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Theme</span>
        <ThemeTogglePill />
      </div>

      <button className="sidebar-link btn-danger" onClick={onLogout} style={{ color: 'var(--danger)', background: 'none', border: 'none' }}>
        <LogOut size={17} />
        <span>Logout</span>
      </button>
    </div>
  </div>
);

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  useEffect(() => {
    // Only close the mobile drawer on navigation if it's currently open.
    // Defer the state update to avoid synchronous setState inside the effect
    // which can trigger cascading renders (lint rule react-hooks/exhaustive-deps).
    if (!drawerOpen) return;
    const raf = requestAnimationFrame(() => setDrawerOpen(false));
    return () => cancelAnimationFrame(raf);
  }, [location.pathname, drawerOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar">
        <SidebarContent user={user} links={links} setDrawerOpen={setDrawerOpen} onLogout={handleLogout} />
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <button
          style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 8, padding: 8, display: 'flex', cursor: 'pointer', color: 'var(--text-primary)' }}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="sidebar-logo-icon" style={{ width: 30, height: 30, fontSize: '1rem', borderRadius: 8 }}>⛳</div>
          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            Golf<span className="gradient-text">Win</span>
          </span>
        </div>

        <ThemeTogglePill />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 55 }}
            />
            <motion.aside
              key="drawer"
              className="sidebar mobile-open"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <SidebarContent inDrawer user={user} links={links} setDrawerOpen={setDrawerOpen} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile bottom tab bar */}
      {user?.role !== 'admin' && (
        <nav className="mobile-tabbar">
          {userLinks.map((link) => {
            const { to, icon: Icon, label, end } = link;
            const isActive = end ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className="mobile-tab"
                style={{ color: isActive ? 'var(--brand-vivid)' : 'var(--text-muted)' }}
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>
      )}
    </>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import './styles/design-system.css';

// Pages
import Landing        from './pages/GolfWinLightThemeUI';
import Login          from './pages/Login';
import Register       from './pages/Register';
import Pricing        from './pages/Pricing';
import CheckoutSimulation from './pages/CheckoutSimulation';
import SubscriptionSuccess from './pages/SubscriptionSuccess';

// Dashboard
import DashboardLayout   from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Scores            from './pages/dashboard/Scores';
import Charity           from './pages/dashboard/Charity';
import Winnings          from './pages/dashboard/Winnings';

// Admin
import AdminLayout    from './pages/admin/AdminLayout';
import AdminOverview  from './pages/admin/AdminOverview';
import AdminUsers     from './pages/admin/AdminUsers';
import AdminDraw      from './pages/admin/AdminDraw';
import AdminCharities from './pages/admin/AdminCharities';
import AdminWinners   from './pages/admin/AdminWinners';
import AdminAnalytics from './pages/admin/AdminAnalytics';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-text)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '0.875rem',
                padding: '12px 16px',
                boxShadow: 'var(--shadow-lg)',
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/"        element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login"   element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout-simulation" element={<CheckoutSimulation />} />
            <Route path="/subscription/success" element={<SubscriptionSuccess />} />

            {/* User Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index          element={<DashboardOverview />} />
              <Route path="scores"  element={<Scores />} />
              <Route path="charity" element={<Charity />} />
              <Route path="winnings" element={<Winnings />} />
            </Route>

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index               element={<AdminOverview />} />
              <Route path="users"        element={<AdminUsers />} />
              <Route path="draw"         element={<AdminDraw />} />
              <Route path="charities"    element={<AdminCharities />} />
              <Route path="winners"      element={<AdminWinners />} />
              <Route path="analytics"    element={<AdminAnalytics />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

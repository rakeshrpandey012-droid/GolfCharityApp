import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// CSS - ADD THIS AT THE TOP
import './styles/lightTheme.css'

// Pages
import GolfWinLightThemeUI from './pages/GolfWinLightThemeUI'
import Login from './pages/Login';
import Register from './pages/Register';
import CheckoutSimulation from './pages/CheckoutSimulation';
import SubscriptionSuccess from './pages/SubscriptionSuccess';

// Dashboard
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import Scores from './pages/dashboard/Scores';
import Charity from './pages/dashboard/Charity';
import Winnings from './pages/dashboard/Winnings';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDraw from './pages/admin/AdminDraw';
import AdminCharities from './pages/admin/AdminCharities';
import AdminWinners from './pages/admin/AdminWinners';
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
                background: 'var(--toast-bg, rgba(10,10,30,0.95))',
                color: 'var(--toast-text, #f1f5f9)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                fontSize: '0.88rem',
                padding: '12px 16px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* Public */}
            <Route path="/" element={<GolfWinLightThemeUI />} />  {/* ← UPDATED */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout-simulation" element={<CheckoutSimulation />} />
            <Route path="/subscription/success" element={<SubscriptionSuccess />} />

            {/* User Dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="scores" element={<Scores />} />
              <Route path="charity" element={<Charity />} />
              <Route path="winnings" element={<Winnings />} />
            </Route>

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="draw" element={<AdminDraw />} />
              <Route path="charities" element={<AdminCharities />} />
              <Route path="winners" element={<AdminWinners />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

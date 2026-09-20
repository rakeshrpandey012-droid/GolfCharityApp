import React from 'react';
import { CheckCircle, XCircle, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * SubscriptionStatus component displays the user's subscription status.
 * It adapts to light/dark themes via Tailwind CSS variables.
 */
export default function SubscriptionStatus() {
  const { user } = useAuth();
  // Possible values: 'active', 'inactive', undefined (free plan)
  const status = user?.subscriptionStatus ?? 'free';

  const getInfo = () => {
    switch (status) {
      case 'active':
        return {
          label: 'Active Plan',
          desc: 'Your subscription is active. Enjoy full features!',
          icon: <CheckCircle size={24} className="text-success" />, // green check
          bg: 'bg-success/10',
          border: 'border-success/30',
          cta: null,
        };
      case 'inactive':
        return {
          label: 'Subscription Inactive',
          desc: 'Your subscription has expired. Upgrade to regain full access.',
          icon: <XCircle size={24} className="text-warning" />, // amber warning
          bg: 'bg-warning/10',
          border: 'border-warning/30',
          cta: (
            <a href="/dashboard/subscription" className="btn btn-primary btn-sm mt-2">
              Choose Plan
            </a>
          ),
        };
      default:
        return {
          label: 'Free Plan',
          desc: 'You are on the free tier. Upgrade for more features.',
          icon: <ShoppingBag size={24} className="text-muted" />, // neutral icon
          bg: 'bg-muted/10',
          border: 'border-muted/30',
          cta: (
            <a href="/dashboard/subscription" className="btn btn-ghost btn-sm mt-2">
              View Plans
            </a>
          ),
        };
    }
  };

  const { label, desc, icon, bg, border, cta } = getInfo();

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${border} ${bg} backdrop-blur-sm`}>
      <div className="flex-shrink-0 pt-1">{icon}</div>
      <div className="flex-1">
        <h3 className="text-lg font-medium text-primary">{label}</h3>
        <p className="text-sm text-secondary mt-1">{desc}</p>
        {cta}
      </div>
    </div>
  );
}

import React from 'react';

/**
 * PlanIcon renders an icon with a gradient background.
 * Used in the Subscription page to display the current plan's icon.
 *
 * Props:
 *  - Icon: React component (e.g., from lucide-react) to render.
 *  - gradient: CSS gradient string for the background.
 */
export default function PlanIcon({ Icon, gradient }) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Icon && <Icon size={24} color="#fff" />}
    </div>
  );
}

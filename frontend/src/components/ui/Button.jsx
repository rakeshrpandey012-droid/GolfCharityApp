import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  loading = false, 
  className = '', 
  ...props 
}) {
  const baseClass = `btn btn-${variant} ${className}`;
  
  return (
    <button 
      type={type} 
      className={baseClass} 
      disabled={disabled || loading} 
      {...props}
    >
      {loading ? (
        <span className="spinner" style={{ 
          width: '20px', 
          height: '20px', 
          border: '2px solid rgba(255,255,255,0.3)', 
          borderTopColor: '#fff', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }} />
      ) : children}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </button>
  );
}

import React from 'react';

export default function Card({ children, hoverable = false, className = '', ...props }) {
  return (
    <div className={`card ${hoverable ? 'hoverable' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}

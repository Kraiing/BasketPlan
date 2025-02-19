// components/ui/card/index.jsx
import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`border rounded shadow p-4 bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

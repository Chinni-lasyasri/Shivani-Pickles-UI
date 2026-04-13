import React, { useEffect } from 'react';

const toastStyle = {
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  zIndex: 9999,
  background: 'linear-gradient(135deg, #113c48, #164d60)',
  border: '1px solid rgba(26,85,104,0.4)',
  borderRadius: '12px',
  padding: '1rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
  color: '#f5f5f5',
  fontSize: '0.9rem',
  fontWeight: 500,
  animation: 'slideInRight 0.4s cubic-bezier(0.4,0,0.2,1)',
  maxWidth: '320px',
};

const toastIconStyle = {
  fontSize: '1.5rem',
  flexShrink: 0,
};

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={toastStyle}>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <span style={toastIconStyle}>🛒</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;

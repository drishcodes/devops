import React from 'react';
import '../styles/HeroSection.css';

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 3000,
};

const modalBoxStyle = {
  background: '#fff',
  borderRadius: '18px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  padding: '2.5rem 2.5rem 2rem 2.5rem',
  minWidth: 320,
  maxWidth: '90vw',
  textAlign: 'center',
  color: '#222',
  position: 'relative',
};

const closeBtnStyle = {
  position: 'absolute',
  top: 12,
  right: 18,
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  color: '#00c896',
  cursor: 'pointer',
};

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={modalBackdropStyle}>
      <div style={modalBoxStyle}>
        <button style={closeBtnStyle} onClick={onClose} aria-label="Close">&times;</button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 
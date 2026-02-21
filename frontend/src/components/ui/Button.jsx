import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  onClick,
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #FF3366, #4FACFE)',
      color: 'white',
      border: 'none',
      hover: 'scale(1.05)',
      boxShadow: '0 10px 30px rgba(255,51,102,0.3)'
    },
    secondary: {
      background: '#1a1a2a',
      color: 'white',
      border: '1px solid rgba(255,255,255,0.1)',
      hover: 'scale(1.02)',
      boxShadow: 'none'
    },
    outline: {
      background: 'transparent',
      color: 'white',
      border: '2px solid rgba(255,51,102,0.3)',
      hover: 'background: #FF3366',
      boxShadow: 'none'
    },
    ghost: {
      background: 'transparent',
      color: '#888',
      border: 'none',
      hover: 'color: white',
      boxShadow: 'none'
    }
  };

  const sizes = {
    small: {
      padding: '8px 16px',
      fontSize: '0.9rem'
    },
    medium: {
      padding: '12px 24px',
      fontSize: '1rem'
    },
    large: {
      padding: '16px 32px',
      fontSize: '1.1rem'
    }
  };

  const style = {
    ...variants[variant],
    ...sizes[size],
    width: fullWidth ? '100%' : 'auto',
    borderRadius: '30px',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={style}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
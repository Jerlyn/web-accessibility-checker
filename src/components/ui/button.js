import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  disabled, 
  className = '', 
  variant = 'default',
  type = 'button',
  ...props 
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  // Variant styles
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    link: 'bg-transparent text-blue-600 underline-offset-4 hover:underline'
  };

  // Size styles
  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-6 text-lg'
  };

  const variantStyle = variantStyles[variant] || variantStyles.default;
  const sizeStyle = sizeStyles[props.size || 'default'];

  // Combine all styles
  const buttonStyles = `${baseStyles} ${variantStyle} ${sizeStyle} ${className}`;

  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

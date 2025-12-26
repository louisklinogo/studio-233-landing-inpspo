import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'outline' | 'solid';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'outline' }) => {
  const baseStyles = "px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider inline-flex items-center";
  const variants = {
    outline: "border border-neutral-200 text-neutral-600 bg-transparent",
    solid: "bg-neutral-100 text-neutral-900",
  };
  
  return (
    <span className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </span>
  );
};
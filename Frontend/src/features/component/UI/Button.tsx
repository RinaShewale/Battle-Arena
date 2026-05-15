import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    outline: "border border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
  };

  return (
    <button 
      className={`px-8 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
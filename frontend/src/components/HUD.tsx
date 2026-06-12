import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface HUDPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const HUDPanel: React.FC<HUDPanelProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`hud-panel ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface HUDContainerProps {
  children: ReactNode;
  className?: string;
}

export const HUDContainer: React.FC<HUDContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none rounded-lg" />
      {children}
    </div>
  );
};

interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'btn-glow',
    secondary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg active:scale-95',
    outline: 'btn-outline',
  };

  return (
    <button
      className={`${sizeClasses[size]} ${variantClasses[variant]} transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const GlassInput: React.FC<GlassInputProps> = (props) => {
  return <input className="input-hud" {...props} />;
};

interface GlassTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const GlassTextArea: React.FC<GlassTextAreaProps> = (props) => {
  return <textarea className="input-hud resize-none" {...props} />;
};

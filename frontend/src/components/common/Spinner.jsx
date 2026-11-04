import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div className={`flex items-center justify-center p-6 ${className}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-brand-600`} />
    </div>
  );
};


import React from 'react';

/**
 * @param {{ size?: 'sm'|'md'|'lg', label?: string, className?: string }} props
 */
const Spinner = ({ size = 'md', label = 'Loading...', className = '' }) => {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-9 h-9', lg: 'w-14 h-14' };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`} role="status" aria-label={label}>
      <div
        className={`${sizeMap[size]} rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin`}
      />
      {size !== 'sm' && (
        <span className="text-sm text-slate-400 sr-only">{label}</span>
      )}
    </div>
  );
};

export default Spinner;

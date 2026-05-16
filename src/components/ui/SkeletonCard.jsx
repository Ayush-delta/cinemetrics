import React from 'react';

/**
 * @param {{ count?: number, className?: string }} props
 */
const SkeletonCard = ({ count = 1, className = '' }) => {
  const cards = Array.from({ length: count });

  return (
    <>
      {cards.map((_, i) => (
        <div
          key={i}
          className={`rounded-2xl overflow-hidden ${className}`}
          style={{
            background: 'linear-gradient(90deg, #161b2e 25%, #1e2540 50%, #161b2e 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.6s infinite',
          }}
        >
          {/* Poster placeholder */}
          <div className="w-full aspect-[2/3] bg-white/5" />
          {/* Info placeholder */}
          <div className="p-3 space-y-2">
            <div className="h-3.5 bg-white/10 rounded-full w-4/5" />
            <div className="h-3 bg-white/5 rounded-full w-2/5" />
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;

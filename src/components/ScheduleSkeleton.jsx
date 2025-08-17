import React from 'react';

// Create array outside component to avoid recreation
const SKELETON_ITEMS = Array.from({ length: 3 }, (_, index) => index);

const ScheduleSkeleton = () => {
  return (
    <div className="space-y-3">
      {SKELETON_ITEMS.map((index) => (
        <div
          key={index}
          className="block border rounded-lg p-4 mb-3 animate-pulse"
        >
          {/* Subject name skeleton */}
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          
          {/* Subject code skeleton */}
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          
          {/* Section and location skeleton */}
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          
          {/* Time skeleton */}
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ScheduleSkeleton);


export const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <div className={`${sizeClasses[size]} absolute border-2 border-primary/20 rounded-full`} />
        <div className={`${sizeClasses[size]} absolute border-2 border-transparent border-t-primary rounded-full animate-spin`} />
      </div>
      {text && <p className="text-sm text-gray-400 font-medium animate-pulse">{text}</p>}
    </div>
  );
};

export const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton h-24 rounded-xl ${className}`} />
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 py-3">
    <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-3 w-32 rounded" />
      <div className="skeleton h-2.5 w-20 rounded" />
    </div>
    <div className="skeleton h-3 w-16 rounded" />
    <div className="skeleton h-6 w-20 rounded-full" />
  </div>
);

const SkeletonBlock = ({ className = '' }) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {[...Array(lines)].map((_, i) => (
      <div
        key={i}
        className={`h-3 bg-gray-200 rounded animate-pulse ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
      />
    ))}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
    <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
      <div className="flex gap-3 mt-3">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
      </div>
      <div className="h-8 bg-gray-200 rounded animate-pulse w-full mt-4" />
    </div>
  </div>
);

const SkeletonStat = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
    <div className="w-10 h-10 rounded-xl bg-gray-200 mb-3" />
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-1/2" />
  </div>
);

const SkeletonListItem = () => (
  <div className="bg-white rounded-2xl p-5 animate-pulse shadow-sm">
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  </div>
);

export { SkeletonBlock, SkeletonText, SkeletonCard, SkeletonStat, SkeletonListItem };

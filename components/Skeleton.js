// components/Skeleton.js
export const Skeleton = ({ className = "", ...props }) => (
  <div
    className={`animate-pulse bg-gray-700/50 rounded ${className}`}
    {...props}
  />
);

export const StatCardSkeleton = () => (
  <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-808/30 border border-zinc-808/60 rounded-2xl p-4 md:p-4 backdrop-blur-sm shadow-lg">
    <Skeleton className="h-4 w-20 mb-2" />
    <div className="flex items-baseline space-x-2">
      <Skeleton className="h-8 w-12" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export const ProjectCardSkeleton = () => (
  <div className="group p-6 border border-gray-700 rounded-xl bg-gray-900/20">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-8 h-8 rounded" />
        <div>
          <Skeleton className="h-5 w-32 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-3/4 mb-4" />
    
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-14" />
    </div>
    
    <div className="flex flex-wrap gap-1 mb-5">
      <Skeleton className="h-6 w-16 rounded" />
      <Skeleton className="h-6 w-20 rounded" />
      <Skeleton className="h-6 w-14 rounded" />
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export const BlogCardSkeleton = () => (
  <div className="bg-gray-900/20 border border-gray-700 rounded-xl p-6">
    <Skeleton className="h-6 w-3/4 mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-2/3 mb-4" />
    <div className="flex items-center space-x-4">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
  </div>
);

export const RecentActivitySkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-center space-x-3 p-3 bg-gray-900/20 border border-gray-700 rounded-lg">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-1" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
    ))}
  </div>
);

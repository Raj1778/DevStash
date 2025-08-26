import { StatCardSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen min-w-[320px] flex flex-col relative">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-909/20 via-transparent to-zinc-808/20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 py-6 md:py-8 max-w-6xl mx-auto w-full relative z-10">
        {/* Welcome Section Skeleton */}
        <div className="mb-8 md:mb-8">
          <div className="h-12 bg-gray-800/50 rounded-lg animate-pulse mb-3"></div>
          <div className="h-6 bg-gray-800/50 rounded-lg animate-pulse w-3/4"></div>
        </div>

        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-8">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mb-8 md:mb-8">
          <div className="h-8 bg-gray-800/50 rounded-lg animate-pulse mb-5 w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-800/50 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <div className="mb-8 md:mb-8">
          <div className="flex items-center justify-between mb-5 md:mb-4">
            <div className="h-8 bg-gray-800/50 rounded-lg animate-pulse w-1/4"></div>
            <div className="h-6 bg-gray-800/50 rounded-lg animate-pulse w-16"></div>
          </div>
          <div className="flex overflow-x-auto gap-8 md:gap-12 p-2 mx-12 md:mx-24 my-4 scrollbar-hide md:flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 w-36 min-w-24 rounded-xl bg-gray-700/50 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Recent Blogs Skeleton */}
        <div className="mb-8 md:mb-8 pb-6 md:pb-0">
          <div className="flex items-center justify-between mb-5 md:mb-4">
            <div className="h-8 bg-gray-800/50 rounded-lg animate-pulse w-1/4"></div>
            <div className="h-6 bg-gray-800/50 rounded-lg animate-pulse w-24"></div>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[180px] md:min-w-0 h-24 rounded-xl bg-gray-700/50 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

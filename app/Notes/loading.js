export default function NotesLoading() {
  return (
    <div className="min-h-screen bg-black text-white flex relative">
      {/* Sidebar Skeleton */}
      <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen">
        {/* Sidebar Header Skeleton */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-zinc-800/50 rounded animate-pulse w-16"></div>
            <div className="h-8 bg-zinc-800/50 rounded animate-pulse w-8"></div>
          </div>
          <div className="h-10 bg-zinc-800/50 rounded-lg animate-pulse"></div>
        </div>

        {/* Notes List Skeleton */}
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 border-b border-zinc-800">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-24"></div>
                    <div className="h-3 bg-yellow-500/50 rounded animate-pulse w-3"></div>
                  </div>
                  <div className="space-y-1 mb-1">
                    <div className="h-3 bg-zinc-800/50 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-zinc-800/50 rounded animate-pulse w-3/4"></div>
                  </div>
                  <div className="h-3 bg-zinc-800/50 rounded animate-pulse w-20"></div>
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-4"></div>
                  <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Skeleton */}
        <div className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <div className="h-8 bg-zinc-800/50 rounded animate-pulse w-8"></div>
            <div className="h-6 bg-zinc-800/50 rounded animate-pulse w-32"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-6 bg-zinc-800/50 rounded animate-pulse w-20"></div>
            <div className="h-8 bg-zinc-800/50 rounded animate-pulse w-8"></div>
          </div>
        </div>

        {/* Editor Area Skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Title Skeleton */}
          <div className="p-4 md:p-6 border-b border-zinc-800">
            <div className="h-8 bg-zinc-800/50 rounded animate-pulse w-1/2"></div>
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 p-4 md:p-6">
            <div className="space-y-3">
              <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-5/6"></div>
              <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-4/6"></div>
              <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-zinc-800/50 rounded animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

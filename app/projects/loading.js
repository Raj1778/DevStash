export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-black px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-10 bg-gray-800/50 rounded animate-pulse mb-2 w-32"></div>
              <div className="w-16 h-px bg-gray-700 mb-4"></div>
              <div className="h-5 bg-gray-800/50 rounded animate-pulse w-48"></div>
            </div>
            <div className="h-12 bg-gray-800/50 rounded-lg animate-pulse w-32"></div>
          </div>

          {/* Filter Tabs Skeleton */}
          <div className="flex space-x-1 bg-gray-800/30 p-1 rounded-lg inline-flex">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-800/50 rounded-md animate-pulse w-20"></div>
            ))}
          </div>
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 border border-gray-700 rounded-xl bg-gray-900/20">
              {/* Header with Folder Icon Skeleton */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-800/50 rounded animate-pulse"></div>
                  <div>
                    <div className="h-5 bg-gray-800/50 rounded animate-pulse w-32 mb-1"></div>
                    <div className="h-4 bg-gray-800/50 rounded animate-pulse w-20"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-800/50 rounded-full animate-pulse w-16"></div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-800/50 rounded animate-pulse w-full"></div>
                <div className="h-4 bg-gray-800/50 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-gray-800/50 rounded animate-pulse w-4/6"></div>
              </div>

              {/* Stats Skeleton */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-4 bg-gray-800/50 rounded animate-pulse w-16"></div>
                <div className="h-4 bg-gray-800/50 rounded animate-pulse w-12"></div>
                <div className="h-4 bg-gray-800/50 rounded animate-pulse w-14"></div>
                <div className="h-4 bg-gray-800/50 rounded animate-pulse w-12"></div>
              </div>

              {/* Tech Stack Skeleton */}
              <div className="flex flex-wrap gap-1 mb-5">
                <div className="h-6 bg-gray-800/50 rounded animate-pulse w-16"></div>
                <div className="h-6 bg-gray-800/50 rounded animate-pulse w-20"></div>
                <div className="h-6 bg-gray-800/50 rounded animate-pulse w-14"></div>
                <div className="h-6 bg-gray-800/50 rounded animate-pulse w-18"></div>
              </div>

              {/* Actions Skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-gray-800/50 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-800/50 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-8 bg-gray-800/50 rounded-lg animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-800/50 rounded animate-pulse w-20"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Footer Skeleton */}
        <div className="mt-16 text-center">
          <div className="h-4 bg-gray-800/50 rounded animate-pulse w-64 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default function NewsLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <div className="h-12 bg-gray-800/50 rounded-lg animate-pulse mb-4 w-64 mx-auto"></div>
          <div className="w-20 h-px bg-gray-700 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-800/50 rounded-lg animate-pulse w-80 mx-auto"></div>
        </div>

        {/* News Cards Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 border border-zinc-800/50 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-zinc-800 animate-pulse"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-6 bg-zinc-800 rounded animate-pulse w-20"></div>
                    <div className="h-6 bg-zinc-800 rounded animate-pulse w-4"></div>
                    <div className="h-6 bg-zinc-800 rounded animate-pulse w-16"></div>
                  </div>
                  <div className="h-6 bg-zinc-800 rounded animate-pulse mb-3 w-full"></div>
                  <div className="h-4 bg-zinc-800 rounded animate-pulse mb-3 w-5/6"></div>
                  <div className="h-4 bg-zinc-800 rounded animate-pulse mb-3 w-4/6"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-zinc-800 rounded animate-pulse w-24"></div>
                    <div className="h-4 bg-zinc-800 rounded animate-pulse w-28"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Dashboard Skeleton */}
        <div className="mt-12 text-center">
          <div className="h-4 bg-gray-800/50 rounded animate-pulse w-32 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

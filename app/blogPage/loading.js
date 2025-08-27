export default function BlogPageLoading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header Skeleton */}
        <header className="mb-16 text-center">
          <div className="h-16 bg-gray-800/50 rounded-lg animate-pulse mb-4 w-32 mx-auto"></div>
          <div className="w-20 h-px bg-gray-700 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-800/50 rounded-lg animate-pulse w-64 mx-auto"></div>
        </header>

        {/* Blog Cards Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <article key={i} className="group mb-8">
              <div className="block p-6 border border-gray-700 rounded-xl bg-gray-900/20">
                {/* Image Skeleton */}
                <div className="mb-6 overflow-hidden rounded-lg">
                  <div className="w-full h-48 bg-gray-800/50 animate-pulse"></div>
                </div>

                {/* Meta Skeleton */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse w-20"></div>
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse w-4"></div>
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse w-24"></div>
                </div>

                {/* Title Skeleton */}
                <div className="h-8 bg-gray-800/50 rounded-lg animate-pulse mb-4 w-3/4"></div>

                {/* Excerpt Skeleton */}
                <div className="space-y-2 mb-5">
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse w-4/6"></div>
                </div>

                {/* Tags Skeleton */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="h-6 bg-gray-800/50 rounded-full animate-pulse w-16"></div>
                  <div className="h-6 bg-gray-800/50 rounded-full animate-pulse w-20"></div>
                  <div className="h-6 bg-gray-800/50 rounded-full animate-pulse w-14"></div>
                </div>

                {/* Read more indicator Skeleton */}
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse w-24"></div>
                  <div className="h-4 bg-gray-800/50 rounded animate-pulse w-16"></div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom spacing Skeleton */}
        <div className="mt-16 text-center">
          <div className="h-4 bg-gray-800/50 rounded animate-pulse w-48 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

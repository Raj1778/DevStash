import React from "react";

const RecentBlogs = ({ loading = false }) => {
  const recentBlogs = [
    { title: "Understanding React Hooks", author: "Raj" },
    { title: "Tailwind CSS Tips", author: "Alice" },
    { title: "JavaScript Closures Explained", author: "Bob" },
    { title: "Next.js Layout Patterns", author: "Charlie" },
  ];

  if (loading) {
    return (
      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="min-w-[180px] md:min-w-0 h-24 rounded-xl bg-gray-700/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4">
      {recentBlogs.map((blog, index) => (
        <TrendingCard key={index} title={blog.title} author={blog.author} />
      ))}
    </div>
  );
};

const TrendingCard = ({ title, author }) => {
  return (
    <div
      className="min-w-[180px] md:min-w-0 h-24 rounded-xl flex flex-col justify-center p-3
                    bg-gradient-to-br from-zinc-800/60 to-zinc-700/40 backdrop-blur-sm 
                    border border-zinc-700/50 shadow-lg cursor-pointer
                    hover:from-zinc-700/60 hover:to-zinc-600/40 hover:scale-105 
                    transition-all duration-200 active:scale-95"
    >
      <h2 className="text-white font-medium text-sm mb-2 leading-tight line-clamp-2">
        {title}
      </h2>
      <p className="text-zinc-300 text-xs">by {author}</p>
    </div>
  );
};

export default RecentBlogs;

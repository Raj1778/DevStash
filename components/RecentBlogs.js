import React from "react";

const RecentBlogs = () => {
  // Example data
  const recentBlogs = [
    { title: "Understanding React Hooks", author: "Raj" },
    { title: "Tailwind CSS Tips", author: "Alice" },
    { title: "JavaScript Closures Explained", author: "Bob" },
    { title: "Next.js Layout Patterns", author: "Charlie" },
  ];

  return (
    <div>
      <div className="flex items-center px-6 pt-8 mx-2">
        <h1 className="text-white text-2xl font-sans">Recent Blog Posts</h1>
      </div>

      <div className="flex overflow-x-auto gap-8 md:gap-12 p-2 mx-12 md:mx-24 my-4 scrollbar-hide md:flex-wrap">
        {recentBlogs.map((blog, index) => (
          <TrendingCard key={index} title={blog.title} author={blog.author} />
        ))}
      </div>
    </div>
  );
};

const TrendingCard = ({ title, author }) => {
  return (
    <div
      className="h-24 w-48 min-w-[12rem] rounded-xl flex flex-col justify-center 
                 text-white bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg cursor-pointer"
    >
      <h2 className="text-sm text-center md:text-base m-2">{title}</h2>
      <p className="text-xs text-gray-200 text-center">{author}</p>
    </div>
  );
};

export default RecentBlogs;

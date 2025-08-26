"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const RecentBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setBlogsLoading(true);
        
        // Fetch user data first
        const userRes = await fetch("/api/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData && userData.user) {
            setUser(userData.user);
          }
        }

        // Fetch blogs
        const response = await fetch("/api/blogs");
        if (response.ok) {
          const blogsData = await response.json();
          setBlogs(blogsData.slice(0, 4)); // Show only 4 most recent blogs
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setBlogsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (blogsLoading) {
    return (
      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="min-w-[180px] md:min-w-0 h-24 rounded-xl bg-gray-700/50 animate-pulse" />
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No blogs posted yet. Be the first to share your thoughts!</p>
        {user && (
          <Link 
            href="/createBlog" 
            prefetch={true}
            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Blog
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4">
      {blogs.map((blog, index) => (
        <BlogCard key={blog._id || index} blog={blog} />
      ))}
    </div>
  );
};

const BlogCard = ({ blog }) => {
  return (
    <Link href={`/blog/${blog.slug}`} prefetch={true}>
      <div
        className="min-w-[180px] md:min-w-0 h-24 rounded-xl flex flex-col justify-center p-3
                      bg-gradient-to-br from-zinc-800/60 to-zinc-700/40 backdrop-blur-sm 
                      border border-zinc-700/50 shadow-lg cursor-pointer
                      hover:from-zinc-700/60 hover:to-zinc-600/40 hover:scale-105 
                      transition-all duration-200 active:scale-95"
      >
        <h2 className="text-white font-medium text-sm mb-2 leading-tight line-clamp-2">
          {blog.title}
        </h2>
        <p className="text-zinc-300 text-xs">by {blog.author}</p>
        {blog.excerpt && (
          <p className="text-zinc-400 text-xs mt-1 line-clamp-1">{blog.excerpt}</p>
        )}
      </div>
    </Link>
  );
};

export default RecentBlogs;

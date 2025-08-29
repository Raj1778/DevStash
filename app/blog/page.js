"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { BlogCardSkeleton } from "@/components/Skeleton";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Start fetching immediately but don't block the UI
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (error) {
        setError("An error occurred while fetching blogs");
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to ensure skeleton is visible for better UX
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
       <Link href="/" className="inline-flex items-center space-x-2 m-8 text-emerald-400 hover:text-emerald-300 transition-colors">
                        <span>←</span>
                        <span>Back to Dashboard</span>
                      </Link>
      <div className="max-w-6xl mx-auto px-6 pt-2 pb-16">
       
        {/* Header */}
        <div className="mb-12">
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-white mb-3">
                All Blogs
              </h1>
              <p className="text-gray-400 text-lg">
                Discover insights and stories from our community
              </p>
            </div>
            <Link
              href="/createBlog"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Write a Blog
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900 bg-opacity-50 border border-red-700 text-red-100 rounded-xl">
            {error}
          </div>
        )}

        {/* Blogs Grid - Always show skeleton first for immediate loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Show skeleton loading immediately
            Array.from({ length: 9 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border border-zinc-800/60 rounded-2xl p-6 backdrop-blur-sm shadow-lg hover:from-zinc-800/60 hover:to-zinc-700/40 hover:border-zinc-700/60 transition-all duration-300"
              >
                <Link href={`/blog/${blog.slug}`}>
                  <h2 className="text-xl font-medium text-white mb-3 hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h2>
                  {blog.excerpt && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {blog.author}</span>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No blogs found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

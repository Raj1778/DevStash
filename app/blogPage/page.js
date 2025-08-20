// app/blogs/page.js
import { getAllBlogs } from "@/lib/db/blog";
import Link from "next/link";

// Force dynamic rendering to ensure SSR
export const dynamic = "force-dynamic";

const BlogCard = ({ title, author, date, image, excerpt, slug, tags }) => (
  <article className="group mb-8">
    <Link
      href={`/blog/${slug}`}
      className="block p-6 border border-gray-700 rounded-xl hover:border-gray-500 hover:shadow-lg hover:shadow-gray-900/20 transition-all duration-300 bg-gray-900/20 hover:bg-gray-900/40"
    >
      {/* Image */}
      {image && (
        <div className="mb-6 overflow-hidden rounded-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center space-x-3 text-xs text-gray-400 mb-4 uppercase tracking-wide">
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span>•</span>
        <span className="flex items-center">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          {author || "Anonymous"}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-2xl lg:text-3xl font-medium text-white mb-4 leading-tight group-hover:text-gray-100 transition-colors duration-200">
        {title}
      </h2>

      {/* Excerpt */}
      {excerpt && (
        <p className="text-gray-300 leading-relaxed mb-5 text-base group-hover:text-gray-200 transition-colors duration-200">
          {excerpt}
        </p>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs bg-gray-800/60 text-gray-300 rounded-full border border-gray-700 group-hover:bg-gray-700/60 group-hover:border-gray-600 transition-all duration-200"
            >
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="px-3 py-1 text-xs bg-gray-800/40 text-gray-500 rounded-full border border-gray-800">
              +{tags.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Read more indicator */}
      <div className="flex items-center justify-between">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-sm text-gray-400 flex items-center">
            Read article
            <svg
              className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>

        {/* Reading time estimate (optional) */}
        <span className="text-xs text-gray-500">
          {Math.ceil((excerpt?.length || 200) / 200)} min read
        </span>
      </div>
    </Link>
  </article>
);

// Main page component
export default async function BlogsPage() {
  // Use the centralized data fetching function
  const blogs = await getAllBlogs();

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-light text-white mb-4 tracking-tight">
            Blog
          </h1>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">
            Thoughts, stories, and insights
          </p>
        </header>

        {/* Blog list */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto p-8 border border-gray-700 rounded-xl bg-gray-900/20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p className="text-gray-400 text-lg mb-6">
                No stories to tell yet
              </p>
              <Link
                href="/createBlog"
                className="inline-flex items-center px-6 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Write your first post
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog) => (
              <div key={blog._id}>
                <BlogCard
                  title={blog.title}
                  author={blog.author}
                  date={blog.createdAt}
                  image={blog.image}
                  excerpt={blog.excerpt}
                  slug={blog.slug}
                  tags={blog.tags || []}
                />
              </div>
            ))}
          </div>
        )}

        {/* Bottom spacing */}
        <div className="mt-16 text-center">
          {blogs.length > 0 && (
            <p className="text-gray-600 text-sm">
              {blogs.length} {blogs.length === 1 ? "post" : "posts"} and
              counting...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

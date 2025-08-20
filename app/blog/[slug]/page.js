// app/blogs/[slug]/page.js
import connectDB from "@/lib/db/mongodb";
import Blog from "@/lib/models/Blog";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug });

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt || blog.content.substring(0, 160),
  };
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  await connectDB();
  const blog = await Blog.findOne({ slug });

  if (!blog) {
    notFound();
  }

  // Convert content string to array of paragraphs
  const contentParagraphs = blog.content.split("\n").filter((p) => p.trim());

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Back button */}
        <Link
          href="/blogPage"
          className="text-gray-400 hover:text-white mb-8 inline-block flex items-center text-sm"
        >
          ← Back to Blogs
        </Link>

        <article className="max-w-2xl w-full mx-auto">
          {/* Image */}
          {blog.image && (
            <div className="mb-6">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-sm"
              />
            </div>
          )}

          <div className="space-y-4">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-light text-white leading-tight">
              {blog.title}
            </h1>

            {/* Author and Date */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{blog.author || "Unknown"}</span>
              <span>•</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Blog content */}
            <div className="space-y-4 text-gray-300 leading-relaxed">
              {contentParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs bg-gray-800 text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  await connectDB();
  const blogs = await Blog.find({}, "slug");

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

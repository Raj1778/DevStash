// app/blog/page.js
import Link from "next/link";
import { getAllBlogs } from "@/lib/db/blog";

export default async function BlogPage() {
  const blogs = await getAllBlogs(); // Direct DB fetch

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog._id} className="mb-4">
          <Link
            href={`/blog/${blog.slug}`}
            className="text-blue-600 hover:underline"
          >
            {blog.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

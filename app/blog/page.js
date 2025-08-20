// app/blogs/page.js
import Link from "next/link";

export default async function BlogsPage() {
  const res = await fetch("http://localhost:3000/api/blogs");
  const blogs = await res.json();

  return (
    <div>
      <h1>All Blogs</h1>
      {blogs.map((blog) => (
        <div key={blog._id}>
          <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
        </div>
      ))}
    </div>
  );
}

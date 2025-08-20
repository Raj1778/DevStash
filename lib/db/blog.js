// lib/db/blog.js
import connectDB from "./mongodb";
import Blog from "@/models/Blog";

export async function getAllBlogs() {
  await connectDB();

  const blogs = await Blog.find().sort({ createdAt: -1 });
  return blogs.map((blog) => ({
    _id: blog._id.toString(),
    title: blog.title,
    slug: blog.slug,
    author: blog.author,
    content: blog.content,
    tags: blog.tags,
  }));
}

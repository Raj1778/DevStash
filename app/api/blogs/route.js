// app/api/blogs/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/lib/models/Blog";

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET() {
  try {
    await connectDB();
    console.log("Connected to database for blog fetching");

    const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(50);
    console.log(`Fetched ${blogs.length} blogs`);

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    console.log("Connected to database for blog creation");

    const { title, content, excerpt, author, tags } = await request.json();
    console.log("Received data:", { title, content, excerpt, author, tags });

    const slug = generateSlug(title);
    console.log("Generated slug:", slug);

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      author,
      tags: tags || [], // Ensure tags is always an array
    });

    const savedBlog = await blog.save();
    console.log("Blog saved successfully:", savedBlog);

    return NextResponse.json(savedBlog, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

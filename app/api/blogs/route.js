// app/api/blogs/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import Blog from "@/lib/models/Blog";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

// Cache blog data for 2 minutes
export const revalidate = 120;

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET(request) {
  try {
    await connectDB();
    console.log("Connected to database for blog fetching");

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let blogs;
    if (userId) {
      // Fetch blogs for specific user
      blogs = await Blog.find({ userId }).sort({ createdAt: -1 }).limit(50);
      console.log(`Fetched ${blogs.length} blogs for user ${userId}`);
    } else {
      // Fetch all blogs
      blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(50);
      console.log(`Fetched ${blogs.length} blogs`);
    }

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

    // Get user from JWT token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId;

    const { title, content, excerpt, author, tags } = await request.json();
    console.log("Received data:", { title, content, excerpt, author, tags, userId });

    const slug = generateSlug(title);
    console.log("Generated slug:", slug);

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      author,
      userId,
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

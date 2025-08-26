// app/api/me/route.js
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ user: null }), { status: 200 });
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, secret);
    const user = await User.findById(payload.userId);

    if (!user) {
      return new Response(JSON.stringify({ user: null }), { status: 200 });
    }

    return new Response(JSON.stringify({ user: user.getPublicProfile() }), {
      status: 200,
    });
  } catch (err) {
    console.error("Me route error:", err.message);
    return new Response(JSON.stringify({ user: null }), { status: 200 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify JWT
    const { payload } = await jwtVerify(token, secret);
    const body = await request.json();
    const { name, githubUsername, leetcodeUsername } = body;

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      {
        ...(name !== undefined && { name }),
        ...(githubUsername !== undefined && { githubUsername }),
        ...(leetcodeUsername !== undefined && { leetcodeUsername })
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser.getPublicProfile()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

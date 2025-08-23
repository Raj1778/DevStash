// app/api/me/route.js
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db/mongodb";
import User from "@/lib/models/User";

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

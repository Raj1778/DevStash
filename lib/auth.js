// lib/auth.js
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.userId;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}

export async function verifyJWT(token) {
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, secret);
    return { id: payload.userId };
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}

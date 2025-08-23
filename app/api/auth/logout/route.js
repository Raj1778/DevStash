import { cookies } from "next/headers";

export async function POST() {
  // Clear the auth token
  cookies().set("token", "", { expires: new Date(0) });

  return new Response(JSON.stringify({ message: "Logged out successfully" }), {
    status: 200,
  });
}

"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Sidebar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div
      className="w-64 p-4 flex flex-col justify-between
                 bg-black/30 backdrop-blur-xl border border-white/10 
                 rounded-2xl text-white shadow-2xl md:mx-4 opacity-90"
    >
      <ul className="space-y-2">
        <li>
          <Link
            href="/"
            className="block py-2 px-4 rounded hover:bg-white/10 transition"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/projects"
            className="block py-2 px-4 rounded hover:bg-white/10 transition"
          >
            Projects
          </Link>
        </li>
        <li>
          <Link
            href="/my-account"
            className="block py-2 px-4 rounded hover:bg-white/10 transition"
          >
            My Account
          </Link>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="block py-2 px-4 rounded hover:bg-white/10 transition"
          >
            LinkedIn
          </a>
        </li>

        {/* ✅ Proper Logout Button */}
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 rounded hover:bg-white/10 transition"
          >
            Logout
          </button>
        </li>

        <li>
          <Link
            href="/about-developers"
            className="block py-2 px-4 rounded bg-blue-700 hover:bg-blue-800 transition"
          >
            About Developer
          </Link>
        </li>
      </ul>
    </div>
  );
}

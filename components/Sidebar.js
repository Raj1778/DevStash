import Link from "next/link";
export default function Sidebar() {
  return (
    <div
      className="w-64 p-4 flex flex-col justify-between
                 bg-black/30 backdrop-blur-xl border border-white/10 
                 rounded-2xl text-white shadow-2xl md:mx-4 opacity-90"
    >
      {/* Top Section: Navigation */}
      <ul className="space-y-2">
        <li>
          <a
            href="#"
            className="block py-2 px-4 rounded hover:bg-white/10 transition"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block py-2 px-4 rounded hover:bg-white/10 transition"
          >
            Projects
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block py-2 px-4 rounded hover:bg-white/10 transition"
          >
            My Account
          </a>
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
        <li>
          <a
            href="#"
            className="block py-2 px-4 rounded hover:bg-white/10 transition"
          >
            Settings
          </a>
        </li>
        <li>
          <a
            href="#"
            className="block py-2 px-4 rounded hover:bg-white/10 transition"
          >
            Logout
          </a>
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

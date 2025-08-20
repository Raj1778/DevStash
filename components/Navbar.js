"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ home }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // List of paths where navbar should not be shown
  const hiddenPaths = ["/login", "/register", "/auth/login", "/auth/register"];

  // Don't render navbar on specified paths
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  // Alternative: Hide navbar for all auth-related paths
  // if (pathname.startsWith("/auth/")) {
  //   return null;
  // }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="h-20 bg-zinc-900 shadow-md p-8 flex items-center justify-between bg-[#0a0a0a]">
        <Link href="/">
          <h1 className="text-white text-2xl font-bold">DevStash</h1>
        </Link>
        <div
          className="flex items-center justify-center h-10 w-10 cursor-pointer "
          onClick={toggleSidebar}
        >
          <Menu className="text-white text-2xl" />
        </div>
      </div>

      {/* Overlay + Sidebar */}
      {isSidebarOpen && (
        <>
          {/* Full-screen invisible overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="absolute top-full right-0 z-50">
            <Sidebar />
          </div>
        </>
      )}
    </div>
  );
}

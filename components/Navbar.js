"use client";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ home }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // List of paths where navbar should not be shown
  const hiddenPaths = ["/login", "/register", "/auth/login", "/auth/register"];

  // Check authentication status - optimized to run only once
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/me");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.log("User not authenticated");
      } finally {
        setLoading(false);
      }
    };

    // Only check auth if not on auth pages
    if (!hiddenPaths.includes(pathname)) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [pathname]);

  // Check screen size for mobile detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Don't render navbar on specified paths
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="h-20 bg-zinc-900 shadow-md p-8 flex items-center justify-between bg-[#0a0a0a]">
        <Link href="/" prefetch={true}>
          <h1 className="text-white text-2xl font-bold">DevStash</h1>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Login Button - Show when user is not authenticated and not on mobile */}
          {!loading && !user && !isMobile && (
            <Link
              href="/login"
              prefetch={true}
              className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
          )}
          
          {/* Menu Button - Only show on desktop */}
          {!isMobile && (
            <div
              className="flex items-center justify-center h-10 w-10 cursor-pointer"
              onClick={toggleSidebar}
            >
              <Menu className="text-white text-2xl" />
            </div>
          )}
        </div>
      </div>

      {/* Overlay + Sidebar - Only show on desktop */}
      {isSidebarOpen && !isMobile && (
        <>
          {/* Full-screen invisible overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="absolute top-full right-0 z-50">
            <Sidebar user={user} />
          </div>
        </>
      )}
    </div>
  );
}

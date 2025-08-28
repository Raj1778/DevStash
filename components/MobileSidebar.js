"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBrandGithub,
  IconArticle,
  IconHome,
  IconEdit,
  IconUserCircle,
  IconNotebook,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

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
      }
    };

    checkAuth();
  }, []);

  // Close sidebar when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navigationItems = [
    {
      title: "Dashboard",
      icon: <IconHome className="w-5 h-5" />,
      href: "/",
    },
    {
      title: "Blogs",
      icon: <IconArticle className="w-5 h-5" />,
      href: "/blogPage",
    },
    {
      title: "Create Blog",
      icon: <IconEdit className="w-5 h-5" />,
      href: "/createBlog",
    },
    {
      title: "Notes",
      icon: <IconNotebook className="w-5 h-5" />,
      href: "/Notes",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="w-5 h-5" />,
      href: user?.githubUsername 
        ? `https://github.com/${user.githubUsername}` 
        : "https://github.com",
      external: true,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl text-white hover:bg-black/40 transition-all duration-300 shadow-2xl"
      >
        {isOpen ? <IconX className="w-6 h-6" /> : <IconMenu2 className="w-6 h-6" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed top-0 left-0 h-full w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">DevStash</h2>
            {user && (
              <p className="text-zinc-400 text-sm">Welcome, {user.name || user.username}</p>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <div key={item.title}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User Actions */}
          {user && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href="/my-account"
                className="flex items-center space-x-3 px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
              >
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </span>
                </div>
                <span>My Account</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

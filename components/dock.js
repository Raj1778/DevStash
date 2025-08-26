"use client";
import React, { useState, useEffect } from "react";
import { FloatingDock as DockUI } from "@/components/ui/dockui";
import { usePathname } from "next/navigation";
import {
  IconBrandGithub,
  IconArticle,
  IconHome,
  IconEdit,
  IconNotebook,
} from "@tabler/icons-react";

export function FloatingDockDemo() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  // Check authentication status to get GitHub username
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

  // pages where dock should NOT be shown
  const excludedPaths = ["/Notes", "/about-developers", "/login", "/register"];

  if (excludedPaths.includes(pathname)) {
    return null;
  }

  const links = [
    {
      title: "Dashboard",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/",
    },
    {
      title: "Blogs",
      icon: (
        <IconArticle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/blogPage",
    },
    {
      title: "Create Blog",
      icon: (
        <IconEdit className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/createBlog",
    },
    {
      title: "Notes",
      icon: (
        <IconNotebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/Notes",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: user?.githubUsername 
        ? `https://github.com/${user.githubUsername}` 
        : "https://github.com",
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <DockUI
        // remove this in prod
        mobileClassName="translate-y-20"
        items={links}
      />
    </div>
  );
}

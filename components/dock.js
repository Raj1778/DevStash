"use client";
import React from "react";
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
      href: "https://github.com/Raj1778",
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

"use client";
import Link from "next/link";
import Recent from "@/components/Recent";
import RecentBlogs from "@/components/RecentBlogs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Quick Action Cards - Mobile optimized
const QuickAction = ({ title, description, icon, onClick, href }) => {
  // If href is provided, use Link wrapper
  const content = (
    <div className="group bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 border border-zinc-800/50 rounded-2xl p-4 md:p-4 hover:from-zinc-800/60 hover:to-zinc-700/40 hover:border-zinc-700/60 transition-all duration-300 cursor-pointer active:scale-95 shadow-lg backdrop-blur-sm">
      <div className="flex items-center space-x-4 md:space-x-3">
        <div className="text-zinc-400 group-hover:text-white transition-colors p-2 md:p-0 bg-zinc-808/50 md:bg-transparent rounded-xl md:rounded-none">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium text-base md:text-sm">
            {title}
          </h3>
          <p className="text-zinc-400 text-sm md:text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} passHref>
      {content}
    </Link>
  ) : (
    <div onClick={onClick}>{content}</div>
  );
};

// Stats Card - Enhanced for mobile
const StatCard = ({ label, value, trend }) => (
  <div className="bg-gradient-to-br from-zinc-900/50 to-zinc-808/30 border border-zinc-808/60 rounded-2xl p-4 md:p-4 backdrop-blur-sm shadow-lg">
    <div className="text-zinc-400 text-xs md:text-sm font-medium mb-2">
      {label}
    </div>
    <div className="flex items-baseline space-x-2">
      <div className="text-2xl md:text-2xl font-light text-white">{value}</div>
      {trend && (
        <div className="text-xs text-emerald-400 font-medium">{trend}</div>
      )}
    </div>
  </div>
);

// Icons - Slightly larger for mobile
const PlusIcon = () => (
  <svg
    className="w-6 h-6 md:w-5 md:h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const BookIcon = () => (
  <svg
    className="w-6 h-6 md:w-5 md:h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477 4.5 1.253"
    />
  </svg>
);

const TrendingIcon = () => (
  <svg
    className="w-6 h-6 md:w-5 md:h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          // Don't redirect, just don't set user
          return null;
        }
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch((error) => {
        console.log("User not logged in, showing public view");
      });
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen min-w-[320px] flex flex-col relative">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-909/20 via-transparent to-zinc-808/20 pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 py-6 md:py-8 max-w-6xl mx-auto w-full relative z-10">
        {/* Welcome Section - Mobile optimized */}
        <div className="mb-8 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-white mb-3 md:mb-2 leading-tight">
            {user
              ? `Welcome back, ${user.name || user.username}!`
              : "Welcome to DevStash"}
          </h1>
          <p className="text-zinc-400 text-base md:text-base leading-relaxed">
            {user 
              ? "Here's what's happening with your content today"
              : "A developer's portfolio and productivity hub"
            }
          </p>
        </div>

        {/* Stats Overview - Mobile-first grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-8">
          <StatCard label="LeetCode Solved" value="247" trend="+5 this week" />
          <StatCard label="Blogs Posted" value="12" trend="+2 this month" />
          <StatCard label="GitHub Commits" value="156" trend="+8 this week" />
          <StatCard label="Current Streak" value="15" trend="days" />
        </div>

        {/* Quick Actions - Single column on mobile for better touch targets */}
        <div className="mb-8 md:mb-8">
          <h2 className="text-xl md:text-xl font-light text-white mb-5 md:mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <QuickAction
              title="Go to LeetCode"
              description="Practice coding challenges"
              icon={<PlusIcon />}
              onClick={() => window.open("https://leetcode.com/", "_blank")}
            />
            <QuickAction
              title="My Projects"
              description="Explore your repositories"
              icon={<BookIcon />}
              href="/projects" // Using Link instead of onClick
            />
            <QuickAction
              title="Trending in Tech"
              description="Discover popular topics"
              icon={<TrendingIcon />}
              onClick={() => console.log("Open search")}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8 md:mb-8">
          <div className="flex items-center justify-between mb-5 md:mb-4">
            <h2 className="text-xl md:text-xl font-light text-white">
              Recent Activity
            </h2>
            <button className="text-zinc-400 hover:text-white text-sm md:text-sm transition-colors px-3 py-2 md:px-0 md:py-0 rounded-lg md:rounded-none hover:bg-zinc-808/50 md:hover:bg-transparent">
              View all
            </button>
          </div>
          <Recent />
        </div>

        {/* Recent Blogs */}
        <div className="mb-8 md:mb-8 pb-6 md:pb-0">
          <div className="flex items-center justify-between mb-5 md:mb-4">
            <h2 className="text-xl md:text-xl font-light text-white">
              Latest Posts
            </h2>
            <button className="text-zinc-400 hover:text-white text-sm md:text-sm transition-colors px-3 py-2 md:px-0 md:py-0 rounded-lg md:rounded-none hover:bg-zinc-808/50 md:hover:bg-transparent">
              View all blogs
            </button>
          </div>
          <RecentBlogs />
        </div>
      </div>
    </div>
  );
}

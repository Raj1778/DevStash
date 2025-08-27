"use client";
import Link from "next/link";
import Recent from "@/components/Recent";
import RecentBlogs from "@/components/RecentBlogs";
import TrendingNews from "@/components/TrendingNews";
import { Suspense, useState, useEffect } from "react";
import { defer } from "@/lib/utils/defer";
import { StatCardSkeleton } from "@/components/Skeleton";
import { ClientStats } from "@/components/ClientStats";

// Quick Action Cards - Mobile optimized
const QuickAction = ({ title, description, icon, onClick, href }) => {
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
    <Link href={href} prefetch={false}>
      {content}
    </Link>
  ) : (
    <div onClick={onClick}>{content}</div>
  );
};

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

const DocumentsIcon = () => (
  <svg
    className="w-6 h-6 md:w-5 md:h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 11h10M7 15h7" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5z" />
  </svg>
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    defer(async () => {
      try {
        const response = await fetch("/api/me", { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        // ignore
      } finally {
        setLoading(false);
      }
    }, { timeout: 800 });
  }, []);

  const getWelcomeMessage = () => {
    if (loading) return "Welcome to DevStash";
    if (user) {
      const name = user.name || user.username || "there";
      return `Welcome back, ${name}!`;
    }
    return "Welcome to DevStash";
  };

  const getWelcomeSubtitle = () => {
    if (loading) return "A developer's portfolio and productivity hub";
    if (user) {
      return "Ready to continue building amazing things?";
    }
    return "A developer's portfolio and productivity hub";
  };

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
            {getWelcomeMessage()}
          </h1>
          <p className="text-zinc-400 text-base md:text-base leading-relaxed">
            {getWelcomeSubtitle()}
          </p>
        </div>

        {/* Login to See History Notification - Only show if not logged in */}
        {!loading && !user && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-emerald-400 font-medium mb-1">Login to See Your History</h3>
                <p className="text-emerald-300 text-sm">
                  Sign in to view your GitHub commits, LeetCode progress, and personalized dashboard
                </p>
              </div>
              <Link
                href="/login"
                prefetch={false}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition-colors"
              >
                Login Now
              </Link>
            </div>
          </div>
        )}

        {/* Missing usernames prompt */}
        {!loading && user && (!user.githubUsername || !user.leetcodeUsername) && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-yellow-400 font-medium mb-1">Complete your setup</h3>
                <p className="text-yellow-300 text-sm">
                  Add your GitHub and LeetCode usernames in My Account to see stats.
                </p>
              </div>
              <Link
                href="/my-account"
                prefetch={false}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors"
              >
                Go to My Account
              </Link>
            </div>
          </div>
        )}

        {/* Stats Overview - Mobile-first grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-8">
          <Suspense fallback={<>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>}>
            <ClientStats />
          </Suspense>
        </div>

        {/* Quick Actions - Improved responsiveness */}
        <div className="mb-8 md:mb-8">
          <h2 className="text-xl md:text-xl font-light text-white mb-5 md:mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
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
              href="/projects"
            />
            <QuickAction
              title="My Documents"
              description="Upload and manage your files"
              icon={<DocumentsIcon />}
              href="/documents"
            />
          </div>
        </div>


        {/* Recent Blogs */}
        <div className="mb-8 md:mb-8 pb-6 md:pb-0">
          <div className="flex items-center justify-between mb-5 md:mb-4">
            <h2 className="text-xl md:text-xl font-light text-white">
              Latest Posts
            </h2>
            <div className="flex items-center space-x-3">
              <Link 
                href="/blogPage"
                prefetch={false}
                className="text-zinc-400 hover:text-white text-sm md:text-sm transition-colors px-3 py-2 md:px-0 md:py-0 rounded-lg md:rounded-none hover:bg-zinc-808/50 md:hover:bg-transparent"
              >
                View all blogs
              </Link>
            </div>
          </div>
          <Suspense fallback={<div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[180px] md:min-w-0 h-24 rounded-xl bg-gray-700/50 animate-pulse" />
            ))}
          </div>}>
            <RecentBlogs />
          </Suspense>
        </div>

        {/* Trending News */}
        <div className="mb-8 md:mb-8 pb-6 md:pb-0">
          <div className="flex items-center justify-between mb-5 md:mb-4">
            <h2 className="text-xl md:text-xl font-light text-white">
              Trending Tech News
            </h2>
            <div className="flex items-center space-x-3">
              <Link 
                href="/news"
                prefetch={false}
                className="text-zinc-400 hover:text-white text-sm md:text-sm transition-colors px-3 py-2 md:px-0 md:py-0 rounded-lg md:rounded-none hover:bg-zinc-808/50 md:hover:bg-transparent"
              >
                View all news
              </Link>
            </div>
          </div>
          <Suspense fallback={<div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 border border-zinc-800/50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-zinc-800 animate-pulse"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="h-3 bg-zinc-800 rounded animate-pulse w-16"></div>
                      <div className="h-3 bg-zinc-800 rounded animate-pulse w-4"></div>
                      <div className="h-3 bg-zinc-800 rounded animate-pulse w-12"></div>
                    </div>
                    <div className="h-4 bg-zinc-800 rounded animate-pulse mb-2 w-full"></div>
                    <div className="h-3 bg-zinc-800 rounded animate-pulse w-3/4"></div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="h-3 bg-zinc-800 rounded animate-pulse w-20"></div>
                      <div className="h-3 bg-zinc-800 rounded animate-pulse w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>}>
            <TrendingNews />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import Recent from "@/components/Recent";
import RecentBlogs from "@/components/RecentBlogs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatCardSkeleton } from "@/components/Skeleton";

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
  const [stats, setStats] = useState({
    leetcode: { totalSolved: 0, problemsThisWeek: 0 },
    github: { commitsLast30Days: 0, commitsThisWeek: 0 },
    blogs: { total: 0, thisMonth: 0 },
    streak: { days: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [githubRateLimited, setGithubRateLimited] = useState(false);
  const router = useRouter();

  // Cache duration constants
  const CACHE_DURATION = {
    user: 30 * 60 * 1000,        // 30 minutes
    github: 15 * 60 * 1000,      // 15 minutes
    leetcode: 30 * 60 * 1000,    // 30 minutes
  };

  // Mobile detection for more conservative caching
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const MOBILE_CACHE_MULTIPLIER = 2; // Mobile devices cache data longer

  // Helper function to check if cache is valid
  const isCacheValid = (key, duration) => {
    const cached = localStorage.getItem(key);
    if (!cached) return false;
    
    try {
      const data = JSON.parse(cached);
      // Use longer cache duration on mobile
      const effectiveDuration = isMobile ? duration * MOBILE_CACHE_MULTIPLIER : duration;
      return (Date.now() - data.timestamp) < effectiveDuration;
    } catch {
      return false;
    }
  };

  // Helper function to get cached data
  const getCachedData = (key) => {
    try {
      const cached = localStorage.getItem(key);
      return cached ? JSON.parse(cached).data : null;
    } catch {
      return null;
    }
  };

  // Helper function to set cached data
  const setCachedData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  };

  // Function to fetch stats data
  const fetchStatsData = async () => {
    const currentUser = user || getCachedData('user');
    if (!currentUser) return;

    const newStats = { ...stats };

    // Fetch GitHub data if username is available
    if (currentUser.githubUsername) {
      try {
        const githubRes = await fetch(`/api/github?username=${currentUser.githubUsername}`);
        if (githubRes.ok) {
          const githubData = await githubRes.json();
          newStats.github = {
            commitsLast30Days: githubData.commits.last30Days,
            commitsThisWeek: githubData.commits.thisWeek
          };
          
          // Log if rate limited
          if (githubData.rateLimited) {
            console.log('GitHub data was rate limited:', githubData.message);
            setGithubRateLimited(true);
          } else {
            setGithubRateLimited(false);
          }
        } else if (githubRes.status === 429) {
          // Rate limited
          console.log('GitHub API rate limited');
          setGithubRateLimited(true);
          newStats.github = {
            commitsLast30Days: 'Rate Limited',
            commitsThisWeek: 'Rate Limited'
          };
        } else {
          console.error('GitHub API error:', githubRes.status);
          setGithubRateLimited(false);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      }
    }

    // Fetch LeetCode data if username is available
    if (currentUser.leetcodeUsername) {
      try {
        const leetcodeRes = await fetch(`/api/leetcode?username=${currentUser.leetcodeUsername}`);
        if (leetcodeRes.ok) {
          const leetcodeData = await leetcodeRes.json();
          console.log('LeetCode data received:', leetcodeData);
          
          newStats.leetcode = {
            totalSolved: leetcodeData.totalSolved || 0,
            problemsThisWeek: leetcodeData.problemsThisWeek || 0
          };
        } else {
          console.error('LeetCode API error:', leetcodeRes.status);
          const errorData = await leetcodeRes.json().catch(() => ({}));
          console.error('LeetCode error details:', errorData);
        }
      } catch (error) {
        console.error('Failed to fetch LeetCode data:', error);
      }
    }

    // Update stats and cache
    setStats(newStats);
    setCachedData('stats', newStats);
    console.log('Fetched fresh stats data');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if we have cached user data
        if (isCacheValid('user', CACHE_DURATION.user)) {
          const cachedUser = getCachedData('user');
          setUser(cachedUser);
          console.log('Using cached user data');
          
          // If we have user data but no stats, fetch stats
          if (!isCacheValid('stats', CACHE_DURATION.github)) {
            await fetchStatsData();
          }
        } else {
          // Fetch user data
          const userRes = await fetch("/api/me");
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData && userData.user) {
              setUser(userData.user);
              setCachedData('user', userData.user);
              console.log('Fetched fresh user data');
              
              // Fetch stats after getting user data
              await fetchStatsData();
            } else {
              // User not logged in, clear any cached data
              localStorage.removeItem('user');
              localStorage.removeItem('stats');
              console.log('User not logged in, cleared cache');
            }
          } else {
            // User not logged in, clear any cached data
            localStorage.removeItem('user');
            localStorage.removeItem('stats');
            console.log('User not logged in, cleared cache');
          }
        }

        // Check if we have cached stats data
        if (isCacheValid('stats', CACHE_DURATION.github)) {
          const cachedStats = getCachedData('stats');
          setStats(cachedStats);
          console.log('Using cached stats data');
        }
      } catch (error) {
        console.log("User not logged in, showing public view");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array - only run once on mount

  // Function to manually refresh data (for rate limit retry button)
  const refreshData = async () => {
    setLoading(true);
    
    // Clear cache to force fresh fetch
    localStorage.removeItem('stats');
    localStorage.removeItem('user');
    
    // Fetch fresh data
    try {
      const userRes = await fetch("/api/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData && userData.user) {
          setUser(userData.user);
          setCachedData('user', userData.user);
          
          // Fetch fresh stats
          await fetchStatsData();
        }
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to handle user data changes and fetch stats when needed
  useEffect(() => {
    if (user && !isCacheValid('stats', CACHE_DURATION.github)) {
      console.log('User data available but stats cache expired, fetching fresh stats');
      fetchStatsData();
    }
    
    // Check if usernames have changed (user might have updated their profile)
    const cachedStats = getCachedData('stats');
    if (cachedStats && user) {
      const cachedUser = getCachedData('user');
      if (cachedUser && (
        cachedUser.githubUsername !== user.githubUsername ||
        cachedUser.leetcodeUsername !== user.leetcodeUsername
      )) {
        console.log('Usernames changed, clearing stats cache and fetching fresh data');
        localStorage.removeItem('stats');
        fetchStatsData();
      }
    }

    // Background refresh: if cache is getting old but not expired, refresh in background
    if (user && isCacheValid('stats', CACHE_DURATION.github * 2)) { // If cache is older than 30 minutes
      const cachedStats = getCachedData('stats');
      if (cachedStats) {
        console.log('Background refresh: stats cache getting old, refreshing in background');
        setBackgroundLoading(true);
        // Don't await this - let it run in background
        fetchStatsData().then(() => {
          console.log('Background refresh completed');
          setBackgroundLoading(false);
        }).catch(error => {
          console.error('Background refresh failed:', error);
          setBackgroundLoading(false);
        });
      }
    }
  }, [user]);

  // Effect to handle page focus (when user returns to dashboard)
  useEffect(() => {
    const handleFocus = () => {
      // Check if we need to refresh data when user returns to the page
      if (user && !isCacheValid('stats', CACHE_DURATION.github)) {
        console.log('Page focused, stats cache expired, fetching fresh data');
        fetchStatsData();
      }
    };

    const handleVisibilityChange = () => {
      // Check if we need to refresh data when page becomes visible
      if (user && !isCacheValid('stats', CACHE_DURATION.github)) {
        console.log('Page visible, stats cache expired, fetching fresh data');
        fetchStatsData();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

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

        {/* Connect Accounts Notification */}
        {user && (!user.githubUsername || !user.leetcodeUsername) && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-400 font-medium mb-1">Connect Your Accounts</h3>
                <p className="text-blue-300 text-sm">
                  Add your GitHub and LeetCode usernames to see your real-time stats
                </p>
              </div>
              <Link
                href="/my-account"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Connect Now
              </Link>
            </div>
          </div>
        )}

        {/* GitHub Rate Limit Notification */}
        {user && user.githubUsername && githubRateLimited && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-yellow-400 font-medium mb-1">GitHub API Rate Limited</h3>
                <p className="text-yellow-300 text-sm">
                  GitHub API rate limit exceeded. Your commit data will be available once the limit resets.
                </p>
              </div>
              <button
                onClick={refreshData}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* GitHub Rate Limit Low Notification */}
        {user && user.githubUsername && typeof stats.github.commitsLast30Days === 'string' && stats.github.commitsLast30Days === 'Rate Limit Critical' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-400 font-medium mb-1">GitHub API Rate Limit Critical</h3>
                <p className="text-red-300 text-sm">
                  GitHub API rate limit is critically low. Some data may be limited until the limit resets.
                </p>
              </div>
              <button
                onClick={refreshData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Background Refresh Indicator */}
        {backgroundLoading && (
          <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-400 text-sm">Refreshing data in background...</span>
            </div>
          </div>
        )}

                {/* Stats Overview - Mobile-first grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-8">
          {loading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard 
                label="LeetCode Solved" 
                value={user?.leetcodeUsername ? stats.leetcode.totalSolved.toString() : "0"} 
                trend={user?.leetcodeUsername ? `+${stats.leetcode.problemsThisWeek} this week` : "Connect account"} 
              />
              <StatCard 
                label="Blogs Posted" 
                value={stats.blogs.total.toString()} 
                trend={`+${stats.blogs.thisMonth} this month`} 
              />
              <StatCard 
                label="GitHub Commits" 
                value={user?.githubUsername ? (typeof stats.github.commitsLast30Days === 'string' ? stats.github.commitsLast30Days : stats.github.commitsLast30Days.toString()) : "0"} 
                trend={user?.githubUsername ? (typeof stats.github.commitsThisWeek === 'string' ? stats.github.commitsThisWeek : `+${stats.github.commitsThisWeek} this week`) : "Connect account"} 
              />
              <StatCard 
                label="Current Streak" 
                value={stats.streak.days.toString()} 
                trend="days" 
              />
            </>
          )}
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
            {user && (!user.githubUsername || !user.leetcodeUsername) ? (
              <QuickAction
                title="Connect Accounts"
                description="Add GitHub & LeetCode usernames"
                icon={<TrendingIcon />}
                href="/my-account"
              />
            ) : (
              <QuickAction
                title="Trending in Tech"
                description="Discover popular topics"
                icon={<TrendingIcon />}
                onClick={() => console.log("Open search")}
              />
            )}
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
          <Recent loading={loading} />
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
          <RecentBlogs loading={loading} />
        </div>
      </div>
    </div>
  );
}

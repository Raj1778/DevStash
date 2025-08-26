"use client";
import { useState, useEffect } from "react";
import { StatCardSkeleton } from "./Skeleton";

// Stats Card Component
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

export function ClientStats() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    leetcode: { totalSolved: 0, problemsThisWeek: 0 },
    github: { commitsLast30Days: 0, commitsThisWeek: 0 },
    blogs: { total: 0, thisMonth: 0 },
    streak: { days: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [githubRateLimited, setGithubRateLimited] = useState(false);

  // Fetch user data and stats
  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userRes = await fetch("/api/me");
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData && userData.user) {
            setUser(userData.user);
            
            // Fetch stats based on user data
            await fetchStats(userData.user);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStats();
  }, []);

  // Fetch real-time stats
  const fetchStats = async (userData) => {
    if (!userData) return;

    try {
      // Fetch GitHub data if username is available
      if (userData.githubUsername) {
        try {
          const githubRes = await fetch(`/api/github?username=${userData.githubUsername}`);
          if (githubRes.ok) {
            const githubData = await githubRes.json();
            setStats(prev => ({
              ...prev,
              github: {
                commitsLast30Days: githubData.commits.last30Days,
                commitsThisWeek: githubData.commits.thisWeek
              }
            }));
            
            if (githubData.rateLimited) {
              setGithubRateLimited(true);
            } else {
              setGithubRateLimited(false);
            }
          } else if (githubRes.status === 429) {
            setGithubRateLimited(true);
            setStats(prev => ({
              ...prev,
              github: {
                commitsLast30Days: 'Rate Limited',
                commitsThisWeek: 'Rate Limited'
              }
            }));
          }
        } catch (error) {
          console.error('Failed to fetch GitHub data:', error);
        }
      }

      // Fetch LeetCode data if username is available
      if (userData.leetcodeUsername) {
        try {
          const leetcodeRes = await fetch(`/api/leetcode?username=${userData.leetcodeUsername}`);
          if (leetcodeRes.ok) {
            const leetcodeData = await leetcodeRes.json();
            setStats(prev => ({
              ...prev,
              leetcode: {
                totalSolved: leetcodeData.totalSolved || 0,
                problemsThisWeek: leetcodeData.problemsThisWeek || 0
              }
            }));
          }
        } catch (error) {
          console.error('Failed to fetch LeetCode data:', error);
        }
      }

      // Refresh blog stats
      try {
        const blogsRes = await fetch(`/api/blogs?userId=${userData._id}`);
        if (blogsRes.ok) {
          const blogsData = await blogsRes.json();
          const totalBlogs = blogsData.length;
          
          const now = new Date();
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const blogsThisMonth = blogsData.filter(blog => 
            new Date(blog.createdAt) >= thisMonth
          ).length;
          
          setStats(prev => ({
            ...prev,
            blogs: {
              total: totalBlogs,
              thisMonth: blogsThisMonth
            }
          }));
        }
      } catch (error) {
        console.error('Failed to fetch blog data:', error);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  if (loading) {
    return (
      <>
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </>
    );
  }

  return (
    <>
      <StatCard 
        label="LeetCode Solved" 
        value={user?.leetcodeUsername ? stats?.leetcode?.totalSolved?.toString() || "0" : "0"} 
        trend={user?.leetcodeUsername ? `+${stats?.leetcode?.problemsThisWeek || 0} this week` : "Connect account"} 
      />
      <StatCard 
        label="Blogs Posted" 
        value={stats?.blogs?.total?.toString() || "0"} 
        trend={`+${stats?.blogs?.thisMonth || 0} this month`} 
      />
      <StatCard 
        label="GitHub Commits" 
        value={user?.githubUsername ? (typeof stats?.github?.commitsLast30Days === 'string' ? stats.github.commitsLast30Days : stats?.github?.commitsLast30Days?.toString() || "0") : "0"} 
        trend={user?.githubUsername ? (typeof stats?.github?.commitsThisWeek === 'string' ? stats.github.commitsThisWeek : `+${stats?.github?.commitsThisWeek || 0} this week`) : "Connect account"} 
      />
      <StatCard 
        label="Current Streak" 
        value={stats?.streak?.days?.toString() || "0"} 
        trend="days" 
      />
    </>
  );
}

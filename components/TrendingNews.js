"use client";
import { useState, useEffect } from "react";
import { defer } from "@/lib/utils/defer";
import Link from "next/link";
import { showError } from "@/lib/toast";

// News card component
const NewsCard = ({ article }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text = "", maxLength = 100) => {
    if (typeof text !== "string") return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Link 
      href={`/news/${encodeURIComponent(article.url)}`}
      className="group block p-4 bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 border border-zinc-800/50 rounded-xl hover:from-zinc-800/60 hover:to-zinc-700/40 hover:border-zinc-700/60 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start space-x-3">
        {/* News Image */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-zinc-800">
          {article?.urlToImage ? (
            <img
              src={article.urlToImage}
              alt={article?.title || 'news image'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs" style={{ display: article?.urlToImage ? 'none' : 'flex' }}>
            📰
          </div>
        </div>

        {/* News Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs text-emerald-400 font-medium uppercase tracking-wide">
              {article?.query || 'Trending'}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-500">
              {formatDate(article?.publishedAt)}
            </span>
          </div>
          
          <h3 className="text-sm font-medium text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {article?.title || 'Untitled'}
          </h3>
          
          <p className="text-xs text-zinc-400 line-clamp-2">
            {truncateText(article?.description || '', 80)}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-zinc-500">
              {article?.source?.name || 'Unknown Source'}
            </span>
            <span className="text-xs text-emerald-400 group-hover:text-emerald-300 transition-colors">
              Read more →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Loading skeleton
const NewsCardSkeleton = () => (
  <div className="p-4 bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 border border-zinc-800/50 rounded-xl">
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
);

export default function TrendingNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  const fetchDashboardNews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/news?limit=3&priority=true");
      if (response.ok) {
        const data = await response.json();
        setNews(data.articles || []);
      } else {
        setError("Failed to fetch trending news");
      }
    } catch (err) {
      console.error("⚠️ News fetch error:", err);
      setError("Failed to fetch trending news");
    } finally {
      setLoading(false);
    }
  };

  const fetchFullNewsInBackground = async () => {
    try {
      console.log("🔄 Starting background fetch for full news...");
      const response = await fetch("/api/news?limit=10", { cache: "no-store" });

      if (response.ok) {
        const data = await response.json();
        console.log(
          `✅ Background fetch complete: ${data.articles?.length} articles cached`
        );
        // keep cached for /news page → no state update here
      }
    } catch (error) {
      console.error("⚠️ Background news fetch failed:", error);
    }
  };

  // Run both
  fetchDashboardNews();
  fetchFullNewsInBackground();
}, []);

  return (
    <div className="mt-3 mb-20 space-y-3">
      {loading ? (
        <>
          <NewsCardSkeleton />
          <NewsCardSkeleton />
          <NewsCardSkeleton />
        </>
      ) : (
        news.slice(0, 3).map((article, index) => (
          <NewsCard key={`${article.url}-${index}`} article={article} />
        ))
      )}

      {!loading && news.length > 0 && (
        <div className="pt-2">
          <Link
            href="/news"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center justify-center py-2 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/10"
          >
            View All Trending News →
          </Link>
        </div>
      )}
    </div>
  );
}
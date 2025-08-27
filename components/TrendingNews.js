"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { showError } from "@/lib/toast";

// News card component
const NewsCard = ({ article }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const truncateText = (text, maxLength = 100) => {
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
          {article.urlToImage ? (
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-xs" style={{ display: article.urlToImage ? 'none' : 'flex' }}>
            📰
          </div>
        </div>

        {/* News Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs text-emerald-400 font-medium uppercase tracking-wide">
              {article.query}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-500">
              {formatDate(article.publishedAt)}
            </span>
          </div>
          
          <h3 className="text-sm font-medium text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-xs text-zinc-400 line-clamp-2">
            {truncateText(article.description, 80)}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-zinc-500">
              {article.source?.name || 'Unknown Source'}
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
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/news');
        
        if (response.ok) {
          const data = await response.json();
          setNews(data.articles || []);
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to fetch news');
          showError('Failed to load trending news');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to fetch news');
        showError('Failed to load trending news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-xl">
        <p className="text-red-400 text-sm">
          Unable to load trending news. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {loading ? (
        // Show 3 skeleton cards while loading
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

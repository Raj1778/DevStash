"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { showError } from "@/lib/toast";

// News card component for the full page
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

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Link 
      href={`/news/${encodeURIComponent(article.url)}`}
      className="group block p-6 bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 border border-zinc-800/50 rounded-xl hover:from-zinc-800/60 hover:to-zinc-700/40 hover:border-zinc-700/60 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        {/* News Image */}
        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-zinc-800">
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
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-lg" style={{ display: article.urlToImage ? 'none' : 'flex' }}>
            📰
          </div>
        </div>

        {/* News Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-emerald-400 font-medium uppercase tracking-wide bg-emerald-400/10 px-2 py-1 rounded">
              {article.query}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-500">
              {formatDate(article.publishedAt)}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-sm text-zinc-400 line-clamp-3 mb-3">
            {truncateText(article.description, 200)}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">
              {article.source?.name || 'Unknown Source'}
            </span>
            <span className="text-sm text-emerald-400 group-hover:text-emerald-300 transition-colors font-medium">
              Read full article →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Loading skeleton
const NewsCardSkeleton = () => (
  <div className="p-6 bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 border border-zinc-800/50 rounded-xl">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-zinc-800 animate-pulse"></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-6 bg-zinc-800 rounded animate-pulse w-20"></div>
          <div className="h-6 bg-zinc-800 rounded animate-pulse w-4"></div>
          <div className="h-6 bg-zinc-800 rounded animate-pulse w-16"></div>
        </div>
        <div className="h-6 bg-zinc-800 rounded animate-pulse mb-3 w-full"></div>
        <div className="h-4 bg-zinc-800 rounded animate-pulse mb-3 w-5/6"></div>
        <div className="h-4 bg-zinc-800 rounded animate-pulse mb-3 w-4/6"></div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-zinc-800 rounded animate-pulse w-24"></div>
          <div className="h-4 bg-zinc-800 rounded animate-pulse w-28"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function NewsPage() {
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Trending Tech News
          </h1>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">
            Stay updated with the latest in AI, development, and technology
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-red-900/20 border border-red-800/50 rounded-xl text-center">
            <p className="text-red-400 text-lg mb-2">
              Unable to load trending news
            </p>
            <p className="text-red-300 text-sm">
              Please check your News API key configuration and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* News Grid */}
        <div className="space-y-6">
          {loading ? (
            // Show skeleton cards while loading
            <>
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
              <NewsCardSkeleton />
            </>
          ) : (
            news.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} />
            ))
          )}
        </div>

        {/* No News State */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-medium text-white mb-2">
              No news available
            </h3>
            <p className="text-gray-400">
              Check back later for the latest tech updates.
            </p>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

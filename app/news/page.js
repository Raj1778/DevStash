"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { showError } from "@/lib/toast";

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cacheStatus, setCacheStatus] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/news?limit=20&fresh=true', { cache: 'no-store' });

        
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles || []);
          
          // Check if response was cached
          const cacheHeader = response.headers.get('x-cache-status');
          if (cacheHeader) {
            setCacheStatus(cacheHeader);
          }
        } else {
          setError('Failed to load news');
          showError('Failed to load news articles');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news');
        showError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date not available';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date not available';
    }
  };

  const getArticleUrl = (article) => {
    // Encode the URL for the route parameter
    return `/news/${encodeURIComponent(article.url)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Header Skeleton */}
          <div className="mb-12 text-center">
            <div className="h-12 bg-gray-800/50 rounded-lg animate-pulse mb-4 w-64 mx-auto"></div>
            <div className="w-20 h-px bg-gray-700 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-800/50 rounded-lg animate-pulse w-80 mx-auto"></div>
          </div>

          {/* News Cards Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-6 bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 border border-zinc-800/50 rounded-xl">
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
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !articles.length) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">📰</div>
            <h1 className="text-2xl font-medium text-white mb-4">
              No News Available
            </h1>
            <p className="text-gray-400 mb-8">
              {error || 'Unable to load news articles at the moment.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>🔄</span>
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
            Tech News
          </h1>
          <div className="w-20 h-px bg-gray-700 mx-auto mb-4"></div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest in technology, programming, and innovation
          </p>
          {cacheStatus && (
            <div className="mt-4">
              <span className="text-xs text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
                {cacheStatus}
              </span>
            </div>
          )}
        </header>

        {/* News Articles */}
        <div className="space-y-6">
          {articles.map((article, index) => (
            <article
              key={index}
              className="p-6 bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 border border-zinc-800/50 rounded-xl hover:border-zinc-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="flex items-start space-x-4">
                {/* Article Image */}
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-zinc-800">
                  {article.urlToImage ? (
                    <>
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center bg-zinc-800">
                        <span className="text-2xl">📰</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                      <span className="text-2xl">📰</span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-emerald-400 font-medium uppercase tracking-wide bg-emerald-400/10 px-2 py-1 rounded">
                      {article.query || 'Tech'}
                    </span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400">
                      {article.source?.name || 'Unknown Source'}
                    </span>
                  </div>
                  
                  <h2 className="text-lg font-medium text-white mb-3 line-clamp-2 hover:text-emerald-300 transition-colors">
                    <Link href={getArticleUrl(article)} className="hover:underline">
                      {article.title}
                    </Link>
                  </h2>
                  
                  <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      {formatDate(article.publishedAt)}
                    </span>
                    <Link
                      href={getArticleUrl(article)}
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-1"
                    >
                      <span>Read More</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-500">
            News powered by multiple sources • Updated regularly
          </p>
        </footer>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { showError, showCopied } from "@/lib/toast";

export default function NewsArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cacheStatus, setCacheStatus] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const url = decodeURIComponent(params.url);
        
        // Fetch the article content from the original URL
        const response = await fetch(`/api/news/article?url=${encodeURIComponent(url)}`);
        
        if (response.ok) {
          const data = await response.json();
          setArticle(data);
          
          // Check if response was cached
          const cacheHeader = response.headers.get('x-cache-status');
          if (cacheHeader) {
            setCacheStatus(cacheHeader);
          }
        } else {
          setError('Failed to load article');
          showError('Failed to load article content');
        }
      } catch (error) {
        console.error('Error fetching article:', error);
        setError('Failed to load article');
        showError('Failed to load article content');
      } finally {
        setLoading(false);
      }
    };

    if (params.url) {
      fetchArticle();
    }
  }, [params.url]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date not available';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date not available';
    }
  };

  const copyToClipboard = () => {
    if (article?.url) {
      navigator.clipboard.writeText(article.url);
      showCopied();
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-8 bg-zinc-800 rounded w-32 mb-4"></div>
              <div className="h-12 bg-zinc-800 rounded w-full mb-4"></div>
              <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
            </div>
            
            {/* Image Skeleton */}
            <div className="w-full h-64 bg-zinc-800 rounded-lg mb-8"></div>
            
            {/* Content Skeleton */}
            <div className="space-y-4">
              <div className="h-4 bg-zinc-800 rounded w-full"></div>
              <div className="h-4 bg-zinc-800 rounded w-full"></div>
              <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
              <div className="h-4 bg-zinc-800 rounded w-full"></div>
              <div className="h-4 bg-zinc-800 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">📰</div>
            <h1 className="text-2xl font-medium text-white mb-4">
              Article Not Found
            </h1>
            <p className="text-gray-400 mb-8">
              The article you're looking for couldn't be loaded.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>←</span>
              <span>Back to News</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/news"
            className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>←</span>
            <span>Back to News</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xs text-emerald-400 font-medium uppercase tracking-wide bg-emerald-400/10 px-2 py-1 rounded">
              {article.query || 'Tech News'}
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-500">
              {formatDate(article.publishedAt)}
            </span>
            {cacheStatus && (
              <>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded">
                  {cacheStatus}
                </span>
              </>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-light text-white mb-4 leading-tight">
            {article.title || 'Article Title'}
          </h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {article.author && (
                <>
                  <span className="text-sm text-zinc-400">
                    By {article.author}
                  </span>
                  <span className="text-sm text-zinc-500">•</span>
                </>
              )}
              <span className="text-sm text-zinc-400">
                {article.source?.name || 'Unknown Source'}
              </span>
              {article.wordCount > 0 && (
                <>
                  <span className="text-sm text-zinc-500">•</span>
                  <span className="text-sm text-zinc-400">
                    {article.readingTime} min read
                  </span>
                </>
              )}
            </div>
            
            <button
              onClick={copyToClipboard}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </header>

        {/* Featured Image */}
        {article.urlToImage && !imageError && (
          <div className="mb-8">
            <img
              src={article.urlToImage}
              alt={article.title || 'Article image'}
              className="w-full h-64 md:h-96 object-cover rounded-lg"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          </div>
        )}

        {/* Fallback when no image or image fails to load */}
        {(!article.urlToImage || imageError) && (
          <div className="mb-8">
            <div className="w-full h-64 md:h-96 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl text-zinc-600 mb-2">📰</div>
                <span className="text-sm text-zinc-500">
                  {article.source?.name || 'News Article'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <article className="prose prose-invert max-w-none">
          <div className="text-lg leading-relaxed text-zinc-300 space-y-6">
            {/* Description */}
            {article.description && (
              <div className="bg-zinc-900/50 border-l-4 border-emerald-500 p-6 rounded-r-lg">
                <p className="text-xl text-zinc-200 font-medium leading-relaxed italic">
                  {article.description}
                </p>
              </div>
            )}
            
            {/* Main Content */}
            {article.content ? (
              <div className="space-y-6">
                {article.content.split('\n\n').map((paragraph, index) => {
                  if (!paragraph.trim()) return null;
                  
                  // Check if it's a heading
                  if (paragraph.length < 100 && (
                      paragraph.endsWith(':') || 
                      paragraph.match(/^[A-Z][^.!?]*[.!?]?$/) && paragraph.split(' ').length < 10
                    )) {
                    return (
                      <h2 key={index} className="text-2xl font-semibold text-white border-b border-zinc-700 pb-2 mt-8">
                        {paragraph}
                      </h2>
                    );
                  }
                  
                  // Check if it's a quote
                  if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
                    return (
                      <blockquote key={index} className="border-l-4 border-emerald-500 pl-6 italic text-zinc-200 bg-zinc-900/30 py-4 rounded-r">
                        {paragraph}
                      </blockquote>
                    );
                  }
                  
                  // Regular paragraph
                  return (
                    <p key={index} className="text-base leading-relaxed text-zinc-300">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            ) : (
              <p className="text-base leading-relaxed text-zinc-300">
                {article.description || 'Content not available. Please visit the original article for the full text.'}
              </p>
            )}
          </div>
        </article>

        {/* Source Links */}
        {article.sourceLinks && article.sourceLinks.length > 0 && (
          <div className="mt-12 p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Related Links</h3>
            <div className="space-y-3">
              {article.sourceLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors line-clamp-2">
                      {link.title}
                    </span>
                    <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors ml-2">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4 flex-wrap">
              <span className="text-sm text-zinc-500">
                Published: {formatDate(article.publishedAt)}
              </span>
              {article.source?.name && (
                <>
                  <span className="text-sm text-zinc-500">•</span>
                  <span className="text-sm text-zinc-400">
                    Source: {article.source.name}
                  </span>
                </>
              )}
              {article.wordCount > 0 && (
                <>
                  <span className="text-sm text-zinc-500">•</span>
                  <span className="text-sm text-zinc-400">
                    {article.wordCount} words
                  </span>
                </>
              )}
            </div>
            
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Read on {article.source?.name || 'Original Site'}</span>
              <span>→</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
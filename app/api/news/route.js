// app/api/news/route.js
import { NextResponse } from 'next/server';

// Simple in-memory cache for news
const newsCache = {
  data: null,
  timestamp: 0
};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function GET() {
  try {
    // Check cache first
    if (newsCache.data && Date.now() - newsCache.timestamp < CACHE_DURATION) {
      return NextResponse.json(newsCache.data);
    }

    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'News API key not configured' },
        { status: 500 }
      );
    }

    // Fetch trending tech news with multiple relevant queries
    const queries = [
      'artificial intelligence',
      'machine learning',
      'GPT-5',
      'Claude',
      'React',
      'Next.js',
      'JavaScript',
      'Python',
      'data structures algorithms',
      'web development'
    ];

    const allArticles = [];
    const seenUrls = new Set();

    // Fetch news for each query
    for (const query of queries) {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${apiKey}`
        );

        if (response.ok) {
          const data = await response.json();
          
          if (data.articles) {
            // Filter out duplicates and add to collection
            data.articles.forEach(article => {
              if (!seenUrls.has(article.url) && article.title && article.description) {
                seenUrls.add(article.url);
                allArticles.push({
                  ...article,
                  query: query // Track which query found this article
                });
              }
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching news for query "${query}":`, error);
      }
    }

    // Sort by published date (newest first) and take top 10
    const sortedArticles = allArticles
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 10);

    const result = {
      articles: sortedArticles,
      totalResults: sortedArticles.length
    };

    // Cache the result
    newsCache.data = result;
    newsCache.timestamp = Date.now();

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

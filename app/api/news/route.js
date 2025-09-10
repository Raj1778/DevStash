// app/api/news/route.js - Multiple API Sources
import { NextResponse } from 'next/server';

// Cache news data for 1 hour
export const revalidate = 3600;

const newsCache = {
  data: null,
  timestamp: 0,
  source: null,
};
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

function buildFallback() {
  const nowIso = new Date().toISOString();
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="100%" height="100%" fill="%2318181b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="16" font-family="Inter, Arial">Tech News</text></svg>';
  
  const curated = [
    {
      title: 'AI Development Tools Transform Software Engineering in 2025',
      description: 'Latest AI coding assistants and automated testing tools are reshaping how developers work.',
      url: 'https://openai.com/research',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'Tech Today' },
      query: 'Curated'
    },
    {
      title: 'React 19 and Next.js 15: Major Performance Improvements',
      description: 'New concurrent features and server components boost app performance significantly.',
      url: 'https://nextjs.org/blog',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'React News' },
      query: 'Curated'
    },
    {
      title: 'TypeScript 5.4: Enhanced Type Safety and Developer Experience',
      description: 'Latest TypeScript release includes better inference and new utility types.',
      url: 'https://devblogs.microsoft.com/typescript/',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'TypeScript' },
      query: 'Curated'
    }
  ];

  return { articles: curated, totalResults: curated.length };
}

// Alternative API 1: Guardian API (Free, 12,000 requests/day)
async function fetchFromGuardian(limit = 10) {
  const apiKey = process.env.GUARDIAN_API_KEY;
  if (!apiKey) {
    console.error('GUARDIAN_API_KEY is not set');
    return null;
  }

  // Calculate the date from one week ago in YYYY-MM-DD format
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoIso = oneWeekAgo.toISOString().split('T')[0];

  try {
    // Multiple search queries for diverse content
    const searchQueries = [
      { query: 'artificial intelligence', tag: 'AI' },
      { query: 'machine learning', tag: 'ML' },
      { query: 'React OR Next.js', tag: 'React' },
      { query: 'TypeScript OR JavaScript', tag: 'JavaScript' },
      { query: 'Python programming', tag: 'Python' },
      { query: 'cybersecurity', tag: 'Security' },
      { query: 'cloud computing', tag: 'Cloud' },
      { query: 'blockchain OR cryptocurrency', tag: 'Blockchain' },
      { query: 'startup OR funding', tag: 'Startup' },
      { query: 'web development', tag: 'Web Dev' }
    ];

    const allArticles = [];
    const seenUrls = new Set();
    const articlesPerQuery = Math.max(1, Math.ceil(limit / 6)); // Distribute across queries

    // Get articles from multiple queries for diversity
    for (const { query, tag } of searchQueries) {
      if (allArticles.length >= limit) break;
      
      try {
        const response = await fetch(
          `https://content.guardianapis.com/search?q=${encodeURIComponent(query)}&section=technology|business|science&from-date=${oneWeekAgoIso}&page-size=${articlesPerQuery + 2}&show-fields=thumbnail,trailText&order-by=newest&api-key=${apiKey}`,
          { next: { revalidate: 3600 } }
        );

        
        if (response.ok) {
          const data = await response.json();
          if (data.response?.results) {
            // Take articles from this query
            let addedFromQuery = 0;
            for (const article of data.response.results) {
              if (!seenUrls.has(article.webUrl) && 
                  allArticles.length < limit && 
                  addedFromQuery < articlesPerQuery) {
                
                seenUrls.add(article.webUrl);
                allArticles.push({
                  title: article.webTitle,
                  description: article.fields?.trailText || 'Read more on The Guardian',
                  url: article.webUrl,
                  urlToImage: article.fields?.thumbnail || null,
                  publishedAt: article.webPublicationDate,
                  source: { name: 'The Guardian' },
                  query: tag
                });
                addedFromQuery++;
              }
            }
          }
        } else {
          console.error(`Guardian API response failed with status: ${response.status} for query: ${query}`);
        }
        
        // Small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`Guardian query failed for ${query}:`, error);
      }
    }

    // If we didn't get enough diverse articles, fill with general tech section
    if (allArticles.length < Math.min(limit, 5)) {
      try {
        const needed = limit - allArticles.length;
       const response = await fetch(
          `https://content.guardianapis.com/search?section=technology&from-date=${oneWeekAgoIso}&page-size=${needed + 3}&show-fields=thumbnail,trailText&order-by=newest&api-key=${apiKey}`,
          { next: { revalidate: 3600 } }
        );

        
        if (response.ok) {
          const data = await response.json();
          if (data.response?.results) {
            for (const article of data.response.results) {
              if (!seenUrls.has(article.webUrl) && allArticles.length < limit) {
                seenUrls.add(article.webUrl);
                allArticles.push({
                  title: article.webTitle,
                  description: article.fields?.trailText || 'Read more on The Guardian',
                  url: article.webUrl,
                  urlToImage: article.fields?.thumbnail || null,
                  publishedAt: article.webPublicationDate,
                  source: { name: 'The Guardian' },
                  query: 'Technology'
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Guardian fallback failed:', error);
      }
    }

    return allArticles.length > 0 ? { 
      articles: allArticles, 
      totalResults: allArticles.length 
    } : null;

  } catch (error) {
    console.error('Guardian API failed:', error);
    return null;
  }
}


// Alternative API 2: RSS Feeds (Always free)
async function fetchFromRSS(limit = 3) {
  try {
    const feeds = [
      { url: 'https://feeds.feedburner.com/oreilly/radar', tag: 'Tech' },
      { url: 'https://www.wired.com/feed/category/science/rss', tag: 'Science' },
      { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', tag: 'AI' },
      { url: 'https://css-tricks.com/feed/', tag: 'Web Dev' }
    ];

    const articles = [];
    const seenUrls = new Set();

    for (const { url: feedUrl, tag } of feeds) {
      if (articles.length >= limit) break;
      
      try {
        const response = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=2`,
          { next: { revalidate: 3600 } }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.items) {
            for (const item of data.items) {
              if (!seenUrls.has(item.link) && articles.length < limit) {
                seenUrls.add(item.link);
                articles.push({
                  title: item.title,
                  description: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || '',
                  url: item.link,
                  urlToImage: item.thumbnail || item.enclosure?.link || null,
                  publishedAt: item.pubDate,
                  source: { name: data.feed?.title?.split(' - ')[0] || 'Tech RSS' },
                  query: tag // Use specific tag for each feed
                });
                break; // One article per feed
              }
            }
          }
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (e) {
        console.error('RSS feed failed:', feedUrl, e);
      }
    }

    return articles.length > 0 ? { 
      articles, 
      totalResults: articles.length 
    } : null;
  } catch (error) {
    console.error('RSS fetch failed:', error);
    return null;
  }
}

// Alternative API 3: HackerNews API (Free, unlimited)
async function fetchFromHackerNews(limit = 3) {
  try {
    // Get top stories
    const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    if (!topStoriesResponse.ok) return null;
    
    const topStories = await topStoriesResponse.json();
    
    // Keywords with their tags
    const techCategories = [
      { keywords: ['ai', 'artificial intelligence', 'machine learning', 'gpt', 'openai'], tag: 'AI' },
      { keywords: ['react', 'vue', 'angular', 'frontend', 'javascript'], tag: 'Frontend' },
      { keywords: ['python', 'django', 'flask', 'backend'], tag: 'Python' },
      { keywords: ['rust', 'go', 'golang', 'systems'], tag: 'Systems' },
      { keywords: ['startup', 'funding', 'ycombinator', 'venture'], tag: 'Startup' },
      { keywords: ['security', 'privacy', 'crypto', 'blockchain'], tag: 'Security' }
    ];
    
    const articles = [];
    const seenUrls = new Set();
    
    // Get first 30 stories and categorize them
    for (let i = 0; i < Math.min(30, topStories.length) && articles.length < limit; i++) {
      try {
        const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${topStories[i]}.json`);
        if (!storyResponse.ok) continue;
        
        const story = await storyResponse.json();
        
        if (story.title && story.url && !seenUrls.has(story.url)) {
          const titleLower = story.title.toLowerCase();
          
          // Find the best matching category
          let bestTag = 'Tech';
          for (const category of techCategories) {
            if (category.keywords.some(keyword => titleLower.includes(keyword))) {
              bestTag = category.tag;
              break;
            }
          }
          
          seenUrls.add(story.url);
          articles.push({
            title: story.title,
            description: `Popular on Hacker News with ${story.descendants || 0} comments. Score: ${story.score || 0}`,
            url: story.url,
            urlToImage: null,
            publishedAt: new Date(story.time * 1000).toISOString(),
            source: { name: 'Hacker News' },
            query: bestTag
          });
        }
      } catch (e) {
        console.error('HN story fetch failed:', topStories[i], e);
      }
    }

    return articles.length > 0 ? { 
      articles, 
      totalResults: articles.length 
    } : null;
  } catch (error) {
    console.error('HackerNews fetch failed:', error);
    return null;
  }
}

export async function GET(request) {
  let limit = 10; // Default fallback
  try {
    const url = new URL(request.url);
    limit = parseInt(url.searchParams.get('limit')) || 10; // Default to 10, allow override
    const priority = url.searchParams.get('priority') === 'true'; // For dashboard priority loading
    
   // Allow bypassing the cache with ?fresh=true
const forceFresh = url.searchParams.get('fresh') === 'true';

if (!forceFresh && newsCache.data && 
    newsCache.timestamp && 
    (Date.now() - newsCache.timestamp) < CACHE_DURATION &&
    newsCache.data.articles.length >= Math.min(limit, 3)) {

  const cachedResult = {
    articles: newsCache.data.articles.slice(0, limit),
    totalResults: newsCache.data.totalResults,
    cached: true
  };
  console.log(`Serving ${cachedResult.articles.length} cached articles`);
  return NextResponse.json(cachedResult);
}

    console.log(`Fetching ${limit} fresh articles from alternative sources...`);

    // Try alternative sources in order of preference
    const sources = [
      { name: 'Guardian', fetch: fetchFromGuardian },
      { name: 'RSS', fetch: fetchFromRSS },
      { name: 'HackerNews', fetch: fetchFromHackerNews }
    ];

    let allArticles = [];
    
    for (const source of sources) {
      try {
        console.log(`Trying ${source.name} API...`);
        const result = await source.fetch(limit); // Pass limit to each fetcher
        
        if (result && result.articles && result.articles.length > 0) {
          console.log(`✅ ${source.name}: ${result.articles.length} articles`);
          allArticles = [...allArticles, ...result.articles];
          
          // If we have enough for priority request (dashboard), return immediately
          if (priority && allArticles.length >= 3) {
            const priorityResult = {
              articles: allArticles.slice(0, 3),
              totalResults: allArticles.length,
              source: source.name,
              priority: true
            };
            
            // Cache what we have so far
            newsCache.data = { articles: allArticles, totalResults: allArticles.length };
            newsCache.timestamp = Date.now();
            newsCache.source = source.name;
            
            console.log(`🚀 Priority: Returning first 3 articles from ${source.name}`);
            return NextResponse.json(priorityResult);
          }
          
          // If we have enough articles, break
          if (allArticles.length >= limit) break;
        } else {
          console.log(`❌ ${source.name} returned no articles`);
        }
      } catch (error) {
        console.error(`❌ ${source.name} failed:`, error.message);
      }
    }

    // Remove duplicates based on URL
    const uniqueArticles = [];
    const seenUrls = new Set();
    
    for (const article of allArticles) {
      if (!seenUrls.has(article.url)) {
        seenUrls.add(article.url);
        uniqueArticles.push(article);
        if (uniqueArticles.length >= limit) break;
      }
    }

    if (uniqueArticles.length > 0) {
      const result = {
        articles: uniqueArticles,
        totalResults: uniqueArticles.length,
        mixed: true // Indicates articles from multiple sources
      };

      // Cache the full result
      newsCache.data = result;
      newsCache.timestamp = Date.now();
      newsCache.source = 'mixed';
      
      console.log(`✅ Success: Returning ${result.articles.length} unique articles`);
      return NextResponse.json(result);
    }

    // All sources failed, use fallback
    console.log('All sources failed, using curated fallback');
    const fallback = buildFallback();
    newsCache.data = fallback;
    newsCache.timestamp = Date.now();
    newsCache.source = 'fallback';
    
    return NextResponse.json({
      ...fallback,
      articles: fallback.articles.slice(0, limit)
    });

  } catch (error) {
    console.error('Error in news route:', error);
    const fallback = buildFallback();
    return NextResponse.json({
      ...fallback,
      articles: fallback.articles.slice(0, Math.min(limit, 3))
    });
  }
}
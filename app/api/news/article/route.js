// app/api/news/article/route.js
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Simple in-memory cache with size limit
const articleCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_SIZE = 100; // Prevent memory issues

// Rate limiting for scraping
let lastScrapeTime = 0;
const MIN_SCRAPE_INTERVAL = 1000; // 1 second between scrapes

function cleanCache() {
  if (articleCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entries
    const entries = Array.from(articleCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest 20% of entries
    const toRemove = Math.floor(entries.length * 0.2);
    for (let i = 0; i < toRemove; i++) {
      articleCache.delete(entries[i][0]);
    }
  }
}

async function rateLimitedScrape(url, options) {
  const now = Date.now();
  const timeSinceLastScrape = now - lastScrapeTime;
  
  if (timeSinceLastScrape < MIN_SCRAPE_INTERVAL) {
    const delay = MIN_SCRAPE_INTERVAL - timeSinceLastScrape;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastScrapeTime = Date.now();
  return fetch(url, options);
}

function validateUrl(url) {
  try {
    const urlObj = new URL(url);
    // Only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    // Block potentially problematic domains
    const blockedDomains = ['localhost', '127.0.0.1', '0.0.0.0'];
    if (blockedDomains.includes(urlObj.hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Validate URL
    if (!validateUrl(url)) {
      return NextResponse.json(
        { error: 'Invalid or blocked URL' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = url;
    const cached = articleCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Clean cache if needed
    cleanCache();

    // Fetch with timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await rateLimitedScrape(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch: ${response.status} ${response.statusText}` },
          { status: response.status }
        );
      }

      // Check content type
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) {
        return NextResponse.json(
          { error: 'URL does not return HTML content' },
          { status: 400 }
        );
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract article content
      const articleData = {
        url: url,
        title: '',
        author: '',
        publishedAt: '',
        content: '',
        sourceLinks: [],
        wordCount: 0,
        readingTime: 0
      };

      // Extract title with better fallbacks
      articleData.title = $('meta[property="og:title"]').attr('content') ||
                         $('meta[name="twitter:title"]').attr('content') ||
                         $('h1').first().text().trim() ||
                         $('title').text().trim().split(' - ')[0] || // Remove site name
                         '';

      // Extract author with more selectors
      articleData.author = $('meta[name="author"]').attr('content') ||
                          $('meta[property="article:author"]').attr('content') ||
                          $('[rel="author"]').text().trim() ||
                          $('.author, .byline, [class*="author"], [class*="byline"]').first().text().trim() ||
                          '';

      // Extract published date with better parsing
      const publishedDate = $('meta[property="article:published_time"]').attr('content') ||
                           $('meta[property="article:published"]').attr('content') ||
                           $('meta[name="publishdate"]').attr('content') ||
                           $('meta[name="date"]').attr('content') ||
                           $('time[datetime]').attr('datetime') ||
                           $('time').attr('datetime') ||
                           $('.date, .publish-date, [class*="date"]').first().text().trim() ||
                           '';

      // Try to parse and validate date
      if (publishedDate) {
        try {
          const date = new Date(publishedDate);
          if (!isNaN(date.getTime())) {
            articleData.publishedAt = date.toISOString();
          }
        } catch {
          articleData.publishedAt = publishedDate; // Keep original if parsing fails
        }
      }

      // Enhanced content extraction
      const contentSelectors = [
        'article[role="main"]',
        'main article',
        '[role="main"] article',
        'article',
        '.post-content',
        '.entry-content',
        '.article-content',
        '.content',
        '[class*="article-body"]',
        '[class*="post-body"]',
        '[class*="content-body"]',
        'main',
        '.main-content'
      ];

      let contentElement = null;
      let bestScore = 0;

      // Score-based content selection
      for (const selector of contentSelectors) {
        const elements = $(selector);
        elements.each((i, el) => {
          const $el = $(el);
          const textLength = $el.text().trim().length;
          const paragraphs = $el.find('p').length;
          const score = textLength + (paragraphs * 50); // Bonus for paragraphs
          
          if (score > bestScore) {
            bestScore = score;
            contentElement = $el;
          }
        });
        
        if (contentElement && bestScore > 500) break; // Good enough
      }

      if (contentElement && contentElement.length > 0) {
        // Remove unwanted elements more aggressively
        contentElement.find(`
          script, style, noscript, 
          nav, header, footer, aside,
          .ad, .ads, .advertisement, .advertising,
          .sidebar, .widget, .social, .share,
          .comments, .comment, .newsletter,
          .related, .recommended, .trending,
          .popup, .modal, .overlay,
          [class*="ad-"], [id*="ad-"],
          [class*="social"], [class*="share"],
          [class*="comment"], [class*="newsletter"]
        `).remove();
        
        // Extract meaningful content
        const contentParts = [];
        const textElements = contentElement.find('p, h2, h3, h4, h5, h6, blockquote, li').not(':empty');
        
        textElements.each((i, el) => {
          const $el = $(el);
          const text = $el.text().trim();
          
          // Filter out short/meaningless content
          if (text.length > 30 && 
              !text.match(/^(subscribe|follow|share|click|read more|continue reading)/i) &&
              !text.match(/^\d+\s*(comments?|shares?|likes?)$/i)) {
            contentParts.push(text);
          }
        });

        articleData.content = contentParts.join('\n\n');
        
        // Calculate reading metrics
        const words = articleData.content.split(/\s+/).length;
        articleData.wordCount = words;
        articleData.readingTime = Math.max(1, Math.ceil(words / 200)); // ~200 WPM
      }

      // Extract relevant links (limit and filter better)
      const validLinks = [];
      $('a[href]').each((i, el) => {
        if (validLinks.length >= 5) return false; // Stop after 5
        
        const $el = $(el);
        const href = $el.attr('href');
        const text = $el.text().trim();
        
        if (href && text.length > 10 && text.length < 100 &&
            !href.startsWith('#') && 
            !href.startsWith('javascript:') &&
            !href.startsWith('mailto:') &&
            !text.match(/^(share|tweet|facebook|instagram|subscribe)/i)) {
          
          try {
            const fullUrl = href.startsWith('http') ? href : new URL(href, url).href;
            validLinks.push({
              url: fullUrl,
              title: text.substring(0, 80) // Limit title length
            });
          } catch {
            // Skip invalid URLs
          }
        }
      });

      articleData.sourceLinks = validLinks;

      // Only cache if we got meaningful content
      if (articleData.content.length > 100) {
        articleCache.set(cacheKey, {
          data: articleData,
          timestamp: Date.now()
        });
      }

      return NextResponse.json(articleData);

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout - article took too long to fetch' },
          { status: 408 }
        );
      }
      
      throw error; // Re-throw other errors
    }

  } catch (error) {
    console.error('Error fetching article:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch article content' },
      { status: 500 }
    );
  }
}
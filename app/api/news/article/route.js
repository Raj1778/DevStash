// app/api/news/article/route.js
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Simple in-memory cache (in production, use Redis or similar)
const articleCache = new Map();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

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

    // Check cache first
    const cacheKey = url;
    const cached = articleCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Fetch the article content from the original URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch article content' },
        { status: response.status }
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
      sourceLinks: []
    };

    // Extract title
    articleData.title = $('h1').first().text().trim() || 
                       $('title').text().trim() || 
                       $('meta[property="og:title"]').attr('content') || '';

    // Extract author
    articleData.author = $('meta[name="author"]').attr('content') ||
                        $('.author, [class*="author"], [class*="byline"]').first().text().trim() ||
                        $('[rel="author"]').text().trim() || '';

    // Extract published date
    articleData.publishedAt = $('meta[property="article:published_time"]').attr('content') ||
                             $('meta[name="publish_date"]').attr('content') ||
                             $('time[datetime]').attr('datetime') || '';

    // Extract main content
    const contentSelectors = [
      'article',
      '[class*="content"]',
      '[class*="article"]',
      '[class*="post"]',
      '.entry-content',
      '.post-content',
      '.article-content',
      'main'
    ];

    let contentElement = null;
    for (const selector of contentSelectors) {
      contentElement = $(selector).first();
      if (contentElement.length > 0) break;
    }

    if (contentElement.length === 0) {
      // Fallback: try to find the largest text block
      const textBlocks = $('p, div').filter((i, el) => {
        const text = $(el).text().trim();
        return text.length > 100;
      });
      
      if (textBlocks.length > 0) {
        contentElement = textBlocks.first().parent();
      }
    }

    if (contentElement.length > 0) {
      // Remove unwanted elements
      contentElement.find('script, style, nav, header, footer, .ad, .advertisement, .sidebar, .comments, .social-share').remove();
      
      // Extract text content
      const paragraphs = contentElement.find('p, h2, h3, h4, h5, h6, blockquote, ul, ol, li');
      const content = [];
      
      paragraphs.each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 20) { // Only include substantial paragraphs
          content.push(text);
        }
      });

      articleData.content = content.join('\n\n');
    }

    // Extract source links (related articles, references, etc.)
    const links = $('a[href]').filter((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      return href && text.length > 10 && !href.startsWith('#') && !href.startsWith('javascript:');
    }).slice(0, 5); // Limit to 5 links

    links.each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && text) {
        articleData.sourceLinks.push({
          url: href.startsWith('http') ? href : new URL(href, url).href,
          title: text
        });
      }
    });

    // Cache the result
    articleCache.set(cacheKey, {
      data: articleData,
      timestamp: Date.now()
    });

    return NextResponse.json(articleData);

  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article content' },
      { status: 500 }
    );
  }
}

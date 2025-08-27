// app/api/news/route.js
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Simple in-memory cache for news
const newsCache = {
  data: null,
  timestamp: 0,
  mode: null,
};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

function buildFallback() {
  const nowIso = new Date().toISOString();
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="100%" height="100%" fill="%2318181b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="20" font-family="Inter, Arial">Curated News</text></svg>';
  const curated = [
    {
      title: 'AI breakthroughs shaping software in 2025',
      description: 'From agentic workflows to multimodal reasoning, AI is changing dev work.',
      url: 'https://openai.com/research',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'OpenAI' },
      query: 'Curated'
    },
    {
      title: 'Next.js patterns: Server Actions, RSC, and streaming UI',
      description: 'Practical patterns to build modern apps with performance and DX in mind.',
      url: 'https://nextjs.org/blog',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'Vercel' },
      query: 'Curated'
    },
    {
      title: 'TypeScript 5.x: what you should adopt now',
      description: 'Smarter type narrowing, decorators, and tooling improvements for stability.',
      url: 'https://devblogs.microsoft.com/typescript/',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'TypeScript Team' },
      query: 'Curated'
    },
    {
      title: 'React compiler progress and implications for apps',
      description: 'Automatic memoization is coming—what it means for components today.',
      url: 'https://react.dev/blog',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'React Team' },
      query: 'Curated'
    },
    {
      title: 'Rust in production: safety and performance wins',
      description: 'Why teams are choosing Rust for critical services and tooling.',
      url: 'https://blog.rust-lang.org/',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'Rust Lang' },
      query: 'Curated'
    },
    {
      title: 'Bun and Deno: the evolving JS runtime landscape',
      description: 'A look at speed, APIs, and compatibility for 2025.',
      url: 'https://bun.sh/blog',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'Bun' },
      query: 'Curated'
    },
    {
      title: 'Kubernetes 1.31: what operators should know',
      description: 'Upgrades, deprecations, and features that matter for clusters.',
      url: 'https://kubernetes.io/blog/',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'Kubernetes' },
      query: 'Curated'
    },
    {
      title: 'Modern CSS: container queries and new viewport units',
      description: 'Design responsive layouts with less JS and more predictability.',
      url: 'https://web.dev/',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'web.dev' },
      query: 'Curated'
    },
    {
      title: 'PostgreSQL performance tips for scalable apps',
      description: 'Indexes, query plans, and connection pooling in practice.',
      url: 'https://www.postgresql.org/docs/',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'PostgreSQL' },
      query: 'Curated'
    },
    {
      title: 'Secure by default: practical appsec for web apps',
      description: 'OWASP updates, threat modeling, and supply-chain realities.',
      url: 'https://owasp.org',
      urlToImage: placeholder,
      publishedAt: nowIso,
      source: { name: 'OWASP' },
      query: 'Curated'
    }
  ];

  return {
    articles: curated,
    totalResults: curated.length
  };
}

export async function GET(request) {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      const fallback = buildFallback();
      newsCache.data = fallback;
      newsCache.timestamp = Date.now();
      newsCache.mode = 'fallback';
      return NextResponse.json(fallback);
    }
    
    // Mode toggle: default to 'everything' (broad). Allow ?mode=... to override.
    const url = new URL(request.url);
    const queryMode = (url.searchParams.get('mode') || '').toLowerCase();
    const envMode = (process.env.NEWS_MODE || 'everything').toLowerCase();
    const mode = (queryMode === 'everything' || queryMode === 'top') ? queryMode : envMode;

    // Check cache first with mode-aware key
    if (newsCache.data && newsCache.mode === mode && (Date.now() - newsCache.timestamp) < CACHE_DURATION) {
      return NextResponse.json(newsCache.data);
    }

    if (mode === 'everything') {
      const queries = [
  'artificial intelligence',
  'machine learning',
  'React',
  'Next.js',
  'Node.js',
  'TypeScript',
  'Python',
  'Rust',
  'cloud computing',
  'cybersecurity'
];


      const allArticles = [];
      const seen = new Set();
      for (const q of queries) {
        try {
          const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${apiKey}`);
          const status = response.status;
          const text = await response.text();
          console.log('NewsAPI everything', q, status);
          let data; try { data = JSON.parse(text); } catch { data = {}; }
          (data.articles || []).forEach(a => {
            if (a && a.url && a.title && !seen.has(a.url)) {
              seen.add(a.url);
              allArticles.push({ ...a, query: q });
            }
          });
        } catch (e) {
          console.error('Everything fetch failed for', q, e);
        }
      }

      const sorted = allArticles
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 10);

      const result = sorted.length > 0 ? { articles: sorted, totalResults: sorted.length } : buildFallback();
      newsCache.data = result;
      newsCache.timestamp = Date.now();
      newsCache.mode = mode;
      return NextResponse.json(result);
    } else {
      // Default: top-headlines for technology (lightweight, trending)
      try {
        const url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=${apiKey}`;
        const response = await fetch(url);
        const status = response.status;
        const text = await response.text();
        console.log('NewsAPI top-headlines', status, text.slice(0, 200));

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = {};
        }

        const incoming = Array.isArray(data?.articles) ? data.articles : [];
        const articles = incoming
          .filter(a => a && a.title && a.url)
          .map(a => ({ ...a, query: 'Technology' }))
          .slice(0, 10);

        const result = articles.length > 0 ? {
          articles,
          totalResults: articles.length
        } : buildFallback();

        newsCache.data = result;
        newsCache.timestamp = Date.now();
        newsCache.mode = mode;
        return NextResponse.json(result);
      } catch (e) {
        console.error('NewsAPI fetch failed:', e);
        const fallback = buildFallback();
        newsCache.data = fallback;
        newsCache.timestamp = Date.now();
        newsCache.mode = 'fallback';
        return NextResponse.json(fallback);
      }
    }


  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

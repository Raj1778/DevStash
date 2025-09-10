import { NextResponse } from 'next/server';

// Simple in-memory cache for GitHub data (in production, use Redis or similar)
const githubCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (increased from 5 minutes)

// Cache GitHub data for 10 minutes
export const revalidate = 600;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `github_${username}`;
    const cachedData = githubCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      console.log(`Returning cached GitHub data for ${username}`);
      return NextResponse.json(cachedData.data);
    }

    console.log(`Fetching GitHub data for username: ${username}`);

    // Check rate limit first - only check if we haven't cached recently
    const rateLimitResponse = await fetch('https://api.github.com/rate_limit');
    if (rateLimitResponse.ok) {
      const rateLimitData = await rateLimitResponse.json();
      const remaining = rateLimitData.resources.core.remaining;
      const resetTime = new Date(rateLimitData.resources.core.reset * 1000);
      console.log(`GitHub API rate limit: ${remaining} requests remaining, resets at ${resetTime.toISOString()}`);
      
      // Only be conservative if rate limit is critically low (less than 3 requests)
      if (remaining < 3) {
        console.log('GitHub API rate limit is critically low, being more conservative');
        // If rate limit is critically low, only fetch user data and repos, skip commit fetching
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (userResponse.ok && reposResponse.ok) {
          const [userData, repos] = await Promise.all([
            userResponse.json(),
            reposResponse.json()
          ]);
          
          return NextResponse.json({
            commits: {
              last30Days: 'Rate Limit Critical',
              thisWeek: 'Rate Limit Critical'
            },
            repositories: repos.map(repo => ({
              id: repo.id,
              name: repo.name,
              description: repo.description,
              language: repo.language,
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              size: repo.size,
              lastUpdated: repo.updated_at,
              url: repo.html_url,
              homepage: repo.homepage,
              topics: repo.topics || [],
              private: repo.private,
              archived: repo.archived,
              fork: repo.fork
            })),
            user: {
              username: userData.login,
              name: userData.name,
              bio: userData.bio,
              publicRepos: userData.public_repos,
              followers: userData.followers,
              following: userData.following
            },
            rateLimited: true,
            message: 'Rate limit is critically low, commit data unavailable until reset'
          });
        }
      }
    }

    // Fetch GitHub data with better error handling
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    
    if (!userResponse.ok) {
      if (userResponse.status === 403) {
        console.log('GitHub API rate limited for user data');
        return NextResponse.json({ 
          error: 'GitHub API rate limit exceeded. Please try again later or authenticate your account.',
          rateLimited: true,
          message: 'Rate limit exceeded. Data will be available once the limit resets.'
        }, { status: 429 });
      }
      if (userResponse.status === 404) {
        return NextResponse.json({ error: 'GitHub user not found' }, { status: 404 });
      }
      return NextResponse.json({ 
        error: `GitHub API error: ${userResponse.status}` 
      }, { status: userResponse.status });
    }

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    
    if (!reposResponse.ok) {
      if (reposResponse.status === 403) {
        console.log('GitHub API rate limited for repositories');
        return NextResponse.json({ 
          error: 'GitHub API rate limit exceeded. Please try again later or authenticate your account.',
          rateLimited: true,
          message: 'Rate limit exceeded. Data will be available once the limit resets.'
        }, { status: 429 });
      }
      return NextResponse.json({ 
        error: `Failed to fetch repositories: ${reposResponse.status}` 
      }, { status: reposResponse.status });
    }

    const [userData, repos] = await Promise.all([
      userResponse.json(),
      reposResponse.json()
    ]);

    console.log(`Found ${repos.length} repositories for ${username}`);

    // Get user's public repos to calculate commits
    const publicRepos = repos.filter(repo => !repo.private && !repo.fork);
    console.log(`Found ${publicRepos.length} public, non-forked repositories`);
    
    // Calculate commits for each repo in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let commitsLast30Days = 0;
    let commitsThisWeek = 0;
    let rateLimited = false;

    // Fetch commits for each public repo (limit to first 2 to avoid rate limits)
    for (const repo of publicRepos.slice(0, 2)) {
      try {
        console.log(`Fetching commits for repository: ${repo.name}`);
        
        // Add a small delay between requests to be more conservative
        if (publicRepos.indexOf(repo) > 0) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?since=${thirtyDaysAgo.toISOString()}&per_page=30`
        );
        
        if (commitsResponse.ok) {
          const commits = await commitsResponse.json();
          console.log(`Found ${commits.length} commits for ${repo.name}`);
          
          commits.forEach(commit => {
            const commitDate = new Date(commit.commit.author.date);
            if (commitDate >= thirtyDaysAgo) {
              commitsLast30Days++;
            }
            if (commitDate >= sevenDaysAgo) {
              commitsThisWeek++;
            }
          });
        } else if (commitsResponse.status === 403) {
          // Rate limited, break out of the loop
          console.log(`Rate limited when fetching commits for ${repo.name}, stopping commit fetching`);
          rateLimited = true;
          break;
        } else {
          console.log(`Failed to fetch commits for ${repo.name}: ${commitsResponse.status}`);
        }
      } catch (error) {
        console.error(`Error fetching commits for ${repo.name}:`, error);
        // Continue with other repos even if one fails
      }
    }

    console.log(`Total commits - Last 30 days: ${commitsLast30Days}, This week: ${commitsThisWeek}`);

    // Process repositories
    const processedRepos = repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      size: repo.size,
      lastUpdated: repo.updated_at,
      url: repo.html_url,
      homepage: repo.homepage,
      topics: repo.topics || [],
      private: repo.private,
      archived: repo.archived,
      fork: repo.fork
    }));

    const result = {
      commits: {
        last30Days: commitsLast30Days,
        thisWeek: commitsThisWeek
      },
      repositories: processedRepos,
      user: {
        username: userData.login,
        name: userData.name,
        bio: userData.bio,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following
      },
      rateLimited: rateLimited,
      message: rateLimited ? 'Some commit data may be incomplete due to rate limiting' : undefined
    };

    console.log('GitHub API result:', result);

    // Cache the result
    githubCache.set(cacheKey, {
      timestamp: Date.now(),
      data: result
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

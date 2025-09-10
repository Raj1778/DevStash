import { NextResponse } from 'next/server';

// Simple in-memory cache for LeetCode data (in production, use Redis or similar)
const leetcodeCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (LeetCode data changes less frequently)

// Cache LeetCode data for 10 minutes
export const revalidate = 600;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    // Check cache first
    const cacheKey = `leetcode_${username}`;
    const cachedData = leetcodeCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      console.log(`Returning cached LeetCode data for ${username}`);
      return NextResponse.json(cachedData.data);
    }

    console.log(`Fetching LeetCode data for username: ${username}`);

    // LeetCode GraphQL query - Updated for better accuracy
    const query = `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          username
          userCalendar(year: $year) {
            totalActiveDays
            submissionCalendar
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          profile {
            ranking
            reputation
          }
        }
      }
    `;

    const variables = {
      username: username,
      year: new Date().getFullYear()
    };

    console.log('GraphQL variables:', variables);

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });

    if (!response.ok) {
      console.error(`LeetCode API response not ok: ${response.status} ${response.statusText}`);
      return NextResponse.json({ error: 'Failed to fetch LeetCode data' }, { status: 500 });
    }

    const data = await response.json();
    console.log('LeetCode API response:', JSON.stringify(data, null, 2));
    
    if (data.errors) {
      console.error('LeetCode GraphQL errors:', data.errors);
      return NextResponse.json({ error: 'User not found or data unavailable', details: data.errors }, { status: 404 });
    }

    const userData = data.data?.matchedUser;
    
    if (!userData) {
      console.error('No matched user found in LeetCode response');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Matched user data:', userData);

    // Calculate total problems solved - use the 'all' value from problemsByDifficulty
    let totalSolved = 0;
    if (userData.submitStatsGlobal?.acSubmissionNum) {
      // Find the 'all' difficulty entry which represents total solved
      const allDifficulty = userData.submitStatsGlobal.acSubmissionNum.find(stat => stat.difficulty === 'All');
      if (allDifficulty) {
        totalSolved = parseInt(allDifficulty.count || 0);
      } else {
        // Fallback: sum all difficulties if 'all' is not available
        totalSolved = userData.submitStatsGlobal.acSubmissionNum.reduce((total, stat) => {
          return total + parseInt(stat.count || 0);
        }, 0);
      }
    }

    console.log('Total solved:', totalSolved);

    // Calculate problems solved this week
    let problemsThisWeek = 0;
    
    if (userData.userCalendar?.submissionCalendar) {
      try {
        const submissionCalendar = userData.userCalendar.submissionCalendar;
        const calendarData = JSON.parse(submissionCalendar);
        
        const sevenDaysAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
        console.log('Seven days ago timestamp:', sevenDaysAgo);
        
        Object.entries(calendarData).forEach(([timestamp, count]) => {
          const timestampInt = parseInt(timestamp);
          const countInt = parseInt(count);
          if (timestampInt >= sevenDaysAgo) {
            problemsThisWeek += countInt;
            console.log(`Adding ${countInt} problems from ${new Date(timestampInt * 1000).toISOString()}`);
          }
        });
      } catch (parseError) {
        console.error('Error parsing submission calendar:', parseError);
        problemsThisWeek = 0;
      }
    }

    console.log('Problems this week:', problemsThisWeek);

    // Get problems by difficulty
    const problemsByDifficulty = {};
    if (userData.submitStatsGlobal?.acSubmissionNum) {
      userData.submitStatsGlobal.acSubmissionNum.forEach(stat => {
        if (stat.difficulty && stat.count !== undefined) {
          problemsByDifficulty[stat.difficulty.toLowerCase()] = parseInt(stat.count);
        }
      });
    }

    console.log('Problems by difficulty:', problemsByDifficulty);

    const result = {
      totalSolved,
      problemsThisWeek,
      problemsByDifficulty,
      totalActiveDays: userData.userCalendar?.totalActiveDays || 0,
      ranking: userData.profile?.ranking || 0,
      reputation: userData.profile?.reputation || 0,
      username: userData.username
    };

    console.log('Final result:', result);

    // Cache the response
    leetcodeCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('LeetCode API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

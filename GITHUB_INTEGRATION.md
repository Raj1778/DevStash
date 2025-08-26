# GitHub and LeetCode Integration

This app now supports dynamic data fetching from GitHub and LeetCode APIs to display real-time statistics and projects.

## Features Added

### 1. Dynamic GitHub Data
- **Commits in Last 30 Days**: Fetches actual commit count from the last 30 days
- **Commits This Week**: Shows commits made in the current week
- **Repository Import**: Automatically imports all public repositories from GitHub
- **Real Repository Details**: Shows actual stars, forks, language, topics, and last updated dates

### 2. Dynamic LeetCode Data
- **Total Problems Solved**: Fetches actual problem count from LeetCode profile
- **Problems Solved This Week**: Shows problems solved in the current week
- **Difficulty Breakdown**: Available through the API (can be extended in UI)

### 3. User Profile Settings
- **GitHub Username**: Users can add their GitHub username to connect their account
- **LeetCode Username**: Users can add their LeetCode username to connect their account
- **Profile Settings Page**: Dedicated page at `/profile-settings` for account management

## API Endpoints

### GitHub API (`/api/github`)
- **GET** `/api/github?username={username}`
- Returns:
  - `commits.last30Days`: Number of commits in last 30 days
  - `commits.thisWeek`: Number of commits this week
  - `repositories`: Array of user's public repositories

### LeetCode API (`/api/leetcode`)
- **GET** `/api/leetcode?username={username}`
- Returns:
  - `totalSolved`: Total problems solved
  - `problemsThisWeek`: Problems solved this week
  - `problemsByDifficulty`: Breakdown by difficulty level
  - `totalActiveDays`: Total active days on LeetCode

### Profile API (`/api/profile`)
- **GET** `/api/profile`: Get current user profile
- **PUT** `/api/profile`: Update user profile with GitHub/LeetCode usernames

## Database Changes

### User Model Updates
Added new fields to the User schema:
- `githubUsername`: String field for GitHub username
- `leetcodeUsername`: String field for LeetCode username

## How to Use

1. **Register/Login**: Create an account or log in to the app
2. **Connect Accounts**: Go to Profile Settings (accessible via sidebar or main page notification)
3. **Add Usernames**: Enter your GitHub and LeetCode usernames
4. **View Stats**: Your dashboard will now show real-time data from both platforms
5. **View Projects**: The Projects page will display your actual GitHub repositories

## UI Improvements

### Main Dashboard
- Dynamic stats cards showing real-time data
- Notification banner for users who haven't connected accounts
- Quick action button to connect accounts
- Fallback values (0) when accounts aren't connected

### Projects Page
- Real GitHub repositories with actual data
- Repository filtering (All, Active, Completed, Paused)
- Fork detection and display
- Real stars, forks, and repository sizes
- GitHub topics as tech stack tags

### Profile Settings
- Clean form interface for adding usernames
- Real-time validation and feedback
- Preview of connected accounts
- Success/error message handling

## Error Handling

- Graceful fallbacks when APIs are unavailable
- User-friendly error messages
- Loading states for better UX
- Network error handling

## Security

- API calls are made server-side to protect API keys
- User authentication required for profile updates
- Input validation and sanitization
- Rate limiting considerations for external APIs

## Future Enhancements

- GitHub contribution graph integration
- LeetCode submission history
- More detailed statistics
- Repository analytics
- Integration with other platforms (HackerRank, CodeForces, etc.)

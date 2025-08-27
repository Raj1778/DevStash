# News API Setup Guide

## 🚀 Quick Setup

### 1. Get Your News API Key
1. Go to [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Add API Key to Environment
Add this line to your `.env.local` file:

```env
NEWS_API_KEY=your_api_key_here
```

### 3. Restart Your Development Server
```bash
npm run dev
```

## 🎯 Features

### Dashboard Integration
- **Trending News Widget**: Shows top 3 trending tech news on dashboard
- **Smart Categories**: AI, Machine Learning, GPT-5, Claude, React, Next.js, JavaScript, Python, DSA, Web Development
- **Real-time Updates**: Latest news sorted by publication date

### News Pages
- **Full News List**: `/news` - View all trending tech news
- **Individual Articles**: `/news/[url]` - Read full articles on your website
- **Responsive Design**: Works perfectly on mobile and desktop

### User Experience
- **Loading Skeletons**: Smooth loading states
- **Error Handling**: Graceful error messages
- **Toast Notifications**: User feedback for actions
- **Copy Links**: Easy sharing functionality

## 📰 News Categories Covered

The system automatically fetches news about:
- 🤖 **Artificial Intelligence** & Machine Learning
- 🧠 **GPT-5** & Claude updates
- ⚛️ **React** & Next.js developments
- 💻 **JavaScript** & Python news
- 🧮 **Data Structures & Algorithms**
- 🌐 **Web Development** trends

## 🔧 Technical Details

### API Endpoints
- `GET /api/news` - Fetch trending news
- `GET /api/news/article?url=...` - Fetch individual article content

### Components
- `TrendingNews.js` - Dashboard widget
- `app/news/page.js` - Full news page
- `app/news/[url]/page.js` - Individual article page

### Features
- **Duplicate Prevention**: No duplicate articles
- **Image Fallbacks**: Handles missing images gracefully
- **Responsive Design**: Mobile-first approach
- **Performance Optimized**: Fast loading with skeletons

## 🎨 Customization

### Add More Categories
Edit `app/api/news/route.js` and add to the `queries` array:

```javascript
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
  'web development',
  // Add your custom queries here
  'blockchain',
  'cybersecurity',
  'cloud computing'
];
```

### Change News Count
Modify the `.slice(0, 10)` in the API route to show more/fewer articles.

### Styling
All components use Tailwind CSS classes that match your app's dark theme.

## 🚨 Troubleshooting

### "News API key not configured"
- Check your `.env.local` file has `NEWS_API_KEY=your_key`
- Restart your development server

### "Failed to fetch news"
- Verify your API key is correct
- Check your internet connection
- NewsAPI.org might be down (rare)

### No images showing
- Some news sources don't provide images
- The system shows a 📰 emoji as fallback

## 📊 API Limits

**Free Plan:**
- 1,000 requests per day
- Perfect for development and small projects

**Paid Plans:**
- Higher limits available
- More features and endpoints

## 🎉 That's It!

Your website now has a complete trending tech news system! Users can:
1. See trending news on the dashboard
2. Browse all news on `/news`
3. Read full articles on your website
4. Share articles easily

The system automatically stays updated with the latest tech news! 🚀

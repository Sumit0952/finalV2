# Instagram Scraper API

A minimal backend API for scraping Instagram profiles, posts, and reels with MongoDB storage.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally on default port 27017)
- Valid Instagram session ID

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start MongoDB:**
Make sure MongoDB is running on `mongodb://localhost:27017`

3. **Start the server:**
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and available endpoints.

### Scraping Endpoints (POST)

#### 1. Scrape Profile
```
POST /api/scrape/profile
Content-Type: application/json

{
  "username": "virat.kohli",
  "sessionId": "your_instagram_session_id"
}
```

#### 2. Scrape Posts
```
POST /api/scrape/posts
Content-Type: application/json

{
  "username": "virat.kohli",
  "sessionId": "your_instagram_session_id",
  "maxPosts": 20
}
```

#### 3. Scrape Reels
```
POST /api/scrape/reels
Content-Type: application/json

{
  "username": "virat.kohli",
  "sessionId": "your_instagram_session_id",
  "maxReels": 20
}
```

### Data Retrieval Endpoints (GET)

#### 1. Get Profile from Database
```
GET /api/scrape/profile/virat.kohli
```

#### 2. Get Posts from Database
```
GET /api/scrape/posts/virat.kohli?limit=50
```

#### 3. Get Reels from Database
```
GET /api/scrape/reels/virat.kohli?limit=50
```

## 🔑 Getting Instagram Session ID

1. Open Instagram in your browser and log in
2. Open Developer Tools (F12)
3. Go to **Application** > **Cookies** > `https://www.instagram.com`
4. Find the `sessionid` cookie and copy its value
5. Use this value in your API requests

## 📊 Response Format

### Success Response:
```json
{
  "success": true,
  "data": {
    // Scraped data here
  },
  "message": "Operation completed successfully"
}
```

### Error Response:
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human readable error message"
}
```

### Error Codes:
- `INVALID_REQUEST` - Missing or invalid parameters
- `PRIVATE_PROFILE` - Profile is private
- `PROFILE_NOT_FOUND` - Profile doesn't exist
- `NO_POSTS_FOUND` - No posts found for user
- `NO_REELS_FOUND` - No reels found for user
- `SCRAPING_FAILED` - General scraping failure
- `DATABASE_ERROR` - Database operation failed
- `SERVER_ERROR` - Internal server error

## 🗄️ Database Structure

### Collections:
- **profiles** - User profile information
- **posts** - Instagram posts data
- **reels** - Instagram reels data

### Data Handling:
- Private profiles are marked but not scraped
- Null values are used for unavailable data (especially for reels)
- Duplicate data is automatically handled (latest scrape overwrites)
- All usernames are stored in lowercase for consistency

## ⚠️ Important Notes

1. **Rate Limiting**: Instagram has aggressive anti-bot measures. Use reasonable delays between requests.

2. **Session Management**: Instagram session IDs expire. You'll need to refresh them periodically.

3. **Reels Limitation**: Instagram heavily restricts reel data access. Most engagement metrics (likes, comments) will be null.

4. **Legal Compliance**: Only scrape public profiles and respect Instagram's Terms of Service.

5. **Error Handling**: The API gracefully handles private profiles and missing data.

## 🛠️ Development

### Project Structure:
```
├── server.js           # Main server file
├── models/            
│   └── index.js       # MongoDB schemas
├── services/          
│   ├── ProfileService.js
│   ├── PostsService.js
│   └── ReelsService.js
├── routes/            
│   └── scrapeRoutes.js
└── package.json       
```

### Adding New Features:
1. Create new service in `services/` folder
2. Add routes in `routes/` folder  
3. Update main server if needed

## 📝 Example Usage

```javascript
// Scrape and store posts
const response = await fetch('http://localhost:3000/api/scrape/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'virat.kohli',
    sessionId: 'your_session_id_here',
    maxPosts: 10
  })
});

const result = await response.json();
console.log(result);
```

## 🔧 Environment Variables (Optional)

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/instagram_scraper
NODE_ENV=development
```
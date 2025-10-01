# 🎯 Instagram Analytics & Scraper Platform

A comprehensive full-stack application for Instagram data analytics, featuring a professional influencer portfolio interface with advanced scraping capabilities and AI-powered vibe analysis.

## ✨ Features

### 🖥️ Professional Frontend Interface
- **Influencer Portfolio Design** - Modern glass morphism UI with gradient backgrounds
- **Interactive Dashboard** - Tabbed interface for Posts, Reels, and Analytics
- **Auto-loading Data** - Seamless navigation with automatic data fetching
- **Responsive Design** - Mobile-first approach with modern CSS animations

### 🤖 Advanced Analytics
- **AI Vibe Analysis** - 8-category emotion detection (Positive, Motivational, Emotional, Energetic, Calm, Professional, Romantic, Travel)
- **Content Insights** - Comprehensive post and reel analytics
- **Real-time Processing** - Dynamic content analysis with emoji and hashtag recognition
- **Visual Analytics** - Interactive charts and data visualization

### 📊 Instagram Scraping
- **Profile Analytics** - Complete user profile information
- **Posts Extraction** - Bulk post data with engagement metrics
- **Reels Analytics** - Video content analysis and statistics
- **MongoDB Storage** - Persistent data storage with cloud database

### 🌐 Deployment Ready
- **Railway Compatible** - Production-ready with Nixpacks configuration
- **ngrok Integration** - Instant public URL generation
- **Docker Support** - Containerized deployment with Puppeteer optimization
- **Cloud Database** - MongoDB Atlas integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- Valid Instagram session ID
- Internet connection for MongoDB Atlas

### Installation

1. **Clone and Install:**
```bash
git clone https://github.com/Sumit0952/finalV2.git
cd finalV2
npm install
```

2. **Configure Session ID:**
Update the session ID in `.env.example` or use the pre-configured one:
```bash
INSTAGRAM_SESSION_ID=77230796546%3AwieAbSVxQ9BjoP%3A21%3AAYh8U8dvo3TJ3loA48EbYEYpraBhs9n6bizTNG0GpQ
```

3. **Start the Application:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

4. **Access the Application:**
- **Frontend:** `http://localhost:3000`
- **API Health:** `http://localhost:3000/api/health`

## 📡 API Documentation

### Core Endpoints

#### Health Check
```http
GET /api/health
```
**Response:** Server status, database connection, and API endpoint list

#### Instagram Scraping Endpoints

##### 1. Profile Analytics
```http
POST /api/scrape/profile
Content-Type: application/json

{
  "username": "virat.kohli",
  "sessionId": "77230796546%3AwieAbSVxQ9BjoP%3A21%3AAYh8U8dvo3TJ3loA48EbYEYpraBhs9n6bizTNG0GpQ"
}
```

##### 2. Posts Extraction
```http
POST /api/scrape/posts
Content-Type: application/json

{
  "username": "virat.kohli",
  "sessionId": "77230796546%3AwieAbSVxQ9BjoP%3A21%3AAYh8U8dvo3TJ3loA48EbYEYpraBhs9n6bizTNG0GpQ",
  "maxPosts": 20
}
```

##### 3. Reels Analytics
```http
POST /api/scrape/reels
Content-Type: application/json

{
  "username": "virat.kohli", 
  "sessionId": "77230796546%3AwieAbSVxQ9BjoP%3A21%3AAYh8U8dvo3TJ3loA48EbYEYpraBhs9n6bizTNG0GpQ",
  "maxReels": 20
}
```

#### AI Vibe Analysis Endpoints

##### 4. Content Vibe Analysis
```http
POST /api/vibe/analyze
Content-Type: application/json

{
  "content": "Amazing sunset! Feeling grateful for this beautiful moment ✨🌅",
  "platform": "instagram"
}
```

##### 5. Bulk Vibe Analysis
```http
POST /api/vibe/analyze-posts
Content-Type: application/json

{
  "username": "virat.kohli",
  "limit": 10
}
```

#### Data Retrieval Endpoints (GET)

##### Cached Data Access
```http
GET /api/scrape/profile/{username}     # Get cached profile data
GET /api/scrape/posts/{username}       # Get cached posts data  
GET /api/scrape/reels/{username}       # Get cached reels data
```

**Query Parameters:**
- `limit` - Maximum number of records (default: 50)
- `page` - Page number for pagination (default: 1)

## 🔑 Authentication Setup

### Getting Instagram Session ID

1. **Login to Instagram** in your browser
2. **Open Developer Tools** (F12 or Ctrl+Shift+I)
3. **Navigate to Application Tab** > Storage > Cookies > `https://www.instagram.com`
4. **Find `sessionid` Cookie** and copy its value
5. **Update Configuration:**
   - Replace in `.env` file: `INSTAGRAM_SESSION_ID=your_copied_value`
   - Or use in API requests directly

### Session Management
- **Expiration:** Instagram sessions expire after ~90 days of inactivity
- **Refresh:** Get new session ID when you see authentication errors
- **Security:** Keep session IDs private - they provide full account access

## 📊 Response Formats & Error Handling

### Success Response Structure
```json
{
  "success": true,
  "data": {
    "profile": {
      "username": "virat.kohli",
      "fullName": "Virat Kohli",
      "followers": 271000000,
      "following": 226,
      "posts": 3398,
      "isVerified": true,
      "biography": "Husband, Father & Cricketer..."
    },
    "analytics": {
      "vibeAnalysis": {
        "positive": 0.85,
        "motivational": 0.72,
        "professional": 0.91
      },
      "engagement": {
        "avgLikes": 2500000,
        "avgComments": 45000
      }
    }
  },
  "message": "Data scraped successfully",
  "timestamp": "2025-10-01T00:00:00.000Z"
}
```

### Error Response Structure
```json
{
  "success": false,
  "error": "AUTHENTICATION_FAILED",
  "message": "Instagram session expired. Please update your session ID.",
  "details": {
    "errorCode": "ERR_SESSION_INVALID",
    "suggestion": "Get a fresh session ID from Instagram cookies"
  }
}
```

### Complete Error Code Reference
| Error Code | Description | Solution |
|------------|-------------|----------|
| `INVALID_REQUEST` | Missing required parameters | Check request body format |
| `AUTHENTICATION_FAILED` | Invalid/expired session ID | Update session ID |
| `PRIVATE_PROFILE` | Profile is private | Use public profile or get access |
| `PROFILE_NOT_FOUND` | Username doesn't exist | Verify username spelling |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait before retrying |
| `SCRAPING_FAILED` | General scraping error | Check network/Instagram status |
| `DATABASE_ERROR` | MongoDB connection issue | Check database connectivity |
| `SERVER_ERROR` | Internal server error | Check server logs |

## 🗄️ Database Architecture

### MongoDB Collections

#### Profiles Collection
```javascript
{
  _id: ObjectId,
  username: "virat.kohli",
  fullName: "Virat Kohli", 
  followers: 271000000,
  following: 226,
  postsCount: 3398,
  isVerified: true,
  biography: "Husband, Father & Cricketer...",
  profilePicture: "https://...",
  lastUpdated: ISODate,
  vibeAnalysis: {
    positive: 0.85,
    motivational: 0.72,
    // ... other vibe categories
  }
}
```

#### Posts Collection
```javascript
{
  _id: ObjectId,
  username: "virat.kohli",
  postId: "instagram_post_id",
  caption: "Post caption text...",
  likes: 2500000,
  comments: 45000,
  timestamp: ISODate,
  images: ["https://..."],
  hashtags: ["cricket", "fitness"],
  mentions: ["@anushkasharma"],
  vibeScore: {
    positive: 0.9,
    motivational: 0.8
  }
}
```

#### Reels Collection  
```javascript
{
  _id: ObjectId,
  username: "virat.kohli",
  reelId: "instagram_reel_id", 
  caption: "Reel caption...",
  views: 15000000,
  likes: 3000000,
  comments: 75000,
  duration: 30,
  videoUrl: "https://...",
  thumbnailUrl: "https://..."
}
```

### Data Management Features
- **Automatic Deduplication** - Prevents duplicate entries using unique constraints
- **Incremental Updates** - Only fetches new content since last scrape
- **Data Validation** - Ensures data integrity with schema validation
- **Indexing** - Optimized queries with compound indexes on username + timestamp

## 🚀 Deployment Guide

### Local Development
```bash
# Clone repository
git clone https://github.com/Sumit0952/finalV2.git
cd finalV2
npm install

# Start development server
npm run dev
# Access: http://localhost:3000
```

### Deploy with ngrok (Instant Public Access)
```bash
# Install ngrok globally
npm install -g ngrok

# Start your server
npm start

# In another terminal, expose to internet
ngrok http 3000
# Get public URL: https://random-name.ngrok-free.app
```

### Deploy to Railway (Production)
1. **Connect Repository:**
   - Go to [Railway.app](https://railway.app)
   - Connect GitHub repository `Sumit0952/finalV2`

2. **Automatic Deployment:**
   - Railway auto-detects Node.js project
   - Uses included `railway.toml` configuration
   - Installs dependencies with Puppeteer support

3. **Environment Variables:**
   ```
   NODE_ENV=production
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
   ```

### Docker Deployment
```bash
# Build image
docker build -t instagram-scraper .

# Run container
docker run -p 3000:3000 instagram-scraper
```

### Vercel/Netlify (Frontend Only)
The `public/` directory can be deployed as a static site, but requires separate backend hosting.

## ⚠️ Production Considerations

### Performance & Scaling
- **Rate Limiting:** Built-in delays prevent Instagram blocking
- **Caching:** MongoDB stores results for faster subsequent requests  
- **Session Rotation:** Use multiple session IDs for higher throughput
- **Load Balancing:** Deploy multiple instances behind a load balancer

### Security Best Practices
- **Environment Variables:** Never commit session IDs to version control
- **CORS Configuration:** Restrict origins in production
- **Input Validation:** All inputs are sanitized and validated
- **Error Handling:** Detailed errors only in development mode

### Legal & Compliance
- **Public Data Only:** Only scrape publicly accessible profiles
- **Rate Respect:** Honor Instagram's rate limits
- **Terms of Service:** Ensure compliance with Instagram's ToS
- **Data Privacy:** Handle scraped data according to privacy laws

## 🛠️ Development Guide

### Project Architecture
```
finalV2/
├── 📁 public/                     # Frontend Assets
│   ├── index.html                 # Main HTML file
│   ├── simple.html               # Portfolio interface  
│   ├── script.js                 # Frontend JavaScript
│   └── style.css                 # Styling & animations
├── 📁 routes/                     # API Route Handlers
│   ├── scrapeRoutes.js           # Instagram scraping endpoints
│   ├── vibeRoutes.js            # AI vibe analysis endpoints
│   └── imageProxy.js            # Image proxy service
├── 📁 services/                   # Business Logic Layer
│   ├── ProfileService.js         # Profile scraping logic
│   ├── PostsService.js          # Posts extraction service
│   ├── ReelsService.js          # Reels analytics service
│   ├── AnalyticsService.js      # Data analytics processing
│   └── vibeAnalyzer.js          # AI vibe analysis engine
├── 📁 models/                     # Database Schemas
│   └── index.js                  # MongoDB data models
├── 📁 instagram-scrapers/         # Core Scraping Modules  
│   ├── instagram-auth.js         # Authentication handler
│   ├── insta_posts_v2.js        # Advanced posts scraper
│   ├── insta_reels.js           # Reels scraping engine
│   └── scrape-instagram.js      # Profile scraper
├── 📁 deployment/                 # Deployment Configurations
│   ├── railway.toml             # Railway platform config
│   ├── nixpacks.toml           # Nixpacks build config
│   ├── Dockerfile              # Container configuration
│   └── .env.example            # Environment template
├── server.js                     # Express server entry point
└── package.json                  # Dependencies & scripts
```

### Technology Stack

#### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Scraping:** Puppeteer + Chromium
- **Authentication:** Instagram Session ID

#### Frontend  
- **Styling:** Modern CSS3 with Glass Morphism
- **JavaScript:** Vanilla ES6+ with Fetch API
- **Design:** Responsive mobile-first approach
- **UI/UX:** Professional influencer portfolio theme

#### AI & Analytics
- **Vibe Analysis:** Custom NLP engine with 8 emotion categories
- **Keywords:** 800+ emotional keywords database
- **Emojis:** Unicode emotion mapping
- **Hashtags:** Trend analysis and categorization

### Adding New Features

#### 1. New Scraping Endpoint
```javascript
// 1. Create service in services/
class NewService {
  static async scrapeAndStore(params) {
    // Implementation
  }
}

// 2. Add route in routes/
router.post('/new-endpoint', async (req, res) => {
  const result = await NewService.scrapeAndStore(req.body);
  res.json(result);
});

// 3. Update frontend in public/script.js
async function loadNewData() {
  const response = await fetch(`${API_BASE_URL}/scrape/new-endpoint`);
  // Handle response
}
```

#### 2. New Vibe Category
```javascript
// Update services/vibeAnalyzer.js
const vibeCategories = {
  newCategory: {
    keywords: ['keyword1', 'keyword2'],
    emojis: ['😊', '🎉'],
    hashtags: ['#hashtag1', '#hashtag2']
  }
};
```

#### 3. Database Schema Updates
```javascript  
// Update models/index.js
const newSchema = new mongoose.Schema({
  // Define new schema
});
```

## 📝 Usage Examples

### Frontend Interface Usage
1. **Open the Application:** Navigate to `http://localhost:3000`
2. **Enter Username:** Type Instagram username in the input field
3. **Select Content Type:** Choose Posts, Reels, or Analytics tab
4. **View Results:** Data automatically loads with vibe analysis

### API Usage Examples

#### JavaScript/Node.js
```javascript
// Profile Analytics
const profileData = await fetch('/api/scrape/profile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'virat.kohli',
    sessionId: 'your_session_id_here'
  })
});

// Vibe Analysis  
const vibeAnalysis = await fetch('/api/vibe/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Amazing workout session! Feeling motivated 💪✨',
    platform: 'instagram'
  })
});
```

#### Python
```python
import requests

# Scrape posts with Python
response = requests.post('http://localhost:3000/api/scrape/posts', 
  json={
    'username': 'virat.kohli',
    'sessionId': 'your_session_id_here',
    'maxPosts': 20
  }
)
data = response.json()
```

#### cURL
```bash
# Health check
curl http://localhost:3000/api/health

# Scrape reels
curl -X POST http://localhost:3000/api/scrape/reels \
  -H "Content-Type: application/json" \
  -d '{
    "username": "virat.kohli", 
    "sessionId": "your_session_id_here",
    "maxReels": 15
  }'
```

### Postman Collection
Import the included `Instagram_Scraper_API.postman_collection.json` for ready-to-use API requests with pre-configured examples.

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database (MongoDB Atlas pre-configured)
MONGODB_URI=mongodb+srv://skr:NOvZfdF9Z6y81zHU@cluster0.cf1jwrf.mongodb.net/instagram-scraper

# Instagram Authentication  
INSTAGRAM_SESSION_ID=77230796546%3AwieAbSVxQ9BjoP%3A21%3AAYh8U8dvo3TJ3loA48EbYEYpraBhs9n6bizTNG0GpQ

# Puppeteer Configuration (Production)
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

### Package Scripts
```json
{
  "start": "node server.js",           # Production server
  "dev": "nodemon server.js",         # Development with auto-reload  
  "build": "echo 'No build required'", # Build placeholder
  "test": "node test-api.js"          # API testing
}
```

## 🤝 Contributing

### Development Workflow
1. **Fork Repository** and create feature branch
2. **Install Dependencies:** `npm install` 
3. **Start Development:** `npm run dev`
4. **Test Changes:** Use included Postman collection
5. **Submit Pull Request** with detailed description

### Code Style Guidelines
- **ESLint:** Follow included linting rules
- **Naming:** Use camelCase for variables, PascalCase for classes
- **Comments:** Document complex functions and API endpoints
- **Error Handling:** Always include try-catch blocks for async operations

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sumit Kumar**
- GitHub: [@Sumit0952](https://github.com/Sumit0952)
- Project: [finalV2](https://github.com/Sumit0952/finalV2)

## 🙏 Acknowledgments

- **Instagram** for providing the platform and data
- **MongoDB Atlas** for cloud database hosting  
- **Railway** for seamless deployment platform
- **Puppeteer** for reliable web scraping capabilities
- **Express.js** community for excellent documentation

---

## 🔗 Quick Links

- **🌐 Live Demo:** [Deploy with ngrok](#deploy-with-ngrok-instant-public-access)
- **📡 API Documentation:** [Postman Collection](Instagram_Scraper_API.postman_collection.json)
- **🚀 Deploy to Railway:** [One-Click Deploy](https://railway.app)
- **🐛 Report Issues:** [GitHub Issues](https://github.com/Sumit0952/finalV2/issues)
- **💡 Feature Requests:** [GitHub Discussions](https://github.com/Sumit0952/finalV2/discussions)

---

⭐ **Star this repository if you found it helpful!**
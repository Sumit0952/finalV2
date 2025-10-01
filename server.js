const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Import routes
const scrapeRoutes = require('./routes/scrapeRoutes');
const vibeRoutes = require('./routes/vibeRoutes');
const imageProxy = require('./routes/imageProxy');
const { stat } = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Atlas Connection (Hardcoded)
const MONGO_URI = 'mongodb+srv://skr:NOvZfdF9Z6y81zHU@cluster0.cf1jwrf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/instagram-scraper';

mongoose.connect(MONGO_URI)
.then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
})
.catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});

// Routes
app.use('/api/scrape', scrapeRoutes);
app.use('/api/vibe', vibeRoutes);
app.use('/api', imageProxy);

// Serve frontend at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Instagram Scraper API is running',
        timestamp: new Date().toISOString(),
        frontend: 'Available at /',
        endpoints: {
            frontend: '/',
            health: '/api/health',
            scrape: {
                posts: 'POST /api/scrape/posts',
                reels: 'POST /api/scrape/reels', 
                profile: 'POST /api/scrape/profile'
            },
            vibe: {
                analyze: 'POST /api/vibe/analyze'
            }
        }
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('❌ Server Error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌐 Frontend available at: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log('📡 Available API endpoints:');
    console.log('   POST /api/scrape/posts');
    console.log('   POST /api/scrape/reels');
    console.log('   POST /api/scrape/profile');
    console.log('   POST /api/vibe/analyze');
});

module.exports = app;

const express = require('express');
const router = express.Router();

const ProfileService = require('../services/ProfileService');
const PostsService = require('../services/PostsService');
const ReelsService = require('../services/ReelsService');
const AnalyticsService = require('../services/AnalyticsService');

// Middleware to validate request body
const validateScrapeRequest = (req, res, next) => {
    const { username, sessionId } = req.body;
    
    if (!username || typeof username !== 'string' || username.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'INVALID_REQUEST',
            message: 'Username is required and must be a valid string'
        });
    }
    
    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
        return res.status(400).json({
            success: false,
            error: 'INVALID_REQUEST',
            message: 'SessionId is required for Instagram authentication'
        });
    }
    
    // Clean username (remove @ if present)
    req.body.username = username.replace('@', '').trim().toLowerCase();
    next();
};

// POST /api/scrape/profile
router.post('/profile', validateScrapeRequest, async (req, res) => {
    try {
        const { username, sessionId } = req.body;
        
        console.log(`📡 API Request: Scraping profile for @${username}`);
        
        const result = await ProfileService.scrapeAndStore(username, sessionId);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            // Determine status code based on error type
            let statusCode = 400;
            if (result.error === 'PRIVATE_PROFILE') statusCode = 403;
            if (result.error === 'PROFILE_NOT_FOUND') statusCode = 404;
            if (result.error === 'SCRAPING_FAILED') statusCode = 500;
            
            res.status(statusCode).json(result);
        }
        
    } catch (error) {
        console.error('❌ Profile API Error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Internal server error occurred'
        });
    }
});

// POST /api/scrape/posts
router.post('/posts', validateScrapeRequest, async (req, res) => {
    try {
        const { username, sessionId, maxPosts = 20 } = req.body;
        
        console.log(`📡 API Request: Scraping posts for @${username}, maxPosts: ${maxPosts}`);
        
        const result = await PostsService.scrapeAndStore(username, maxPosts, sessionId);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            // Determine status code based on error type
            let statusCode = 400;
            if (result.error === 'PRIVATE_PROFILE') statusCode = 403;
            if (result.error === 'PROFILE_NOT_FOUND') statusCode = 404;
            if (result.error === 'NO_POSTS_FOUND') statusCode = 404;
            if (result.error === 'SCRAPING_FAILED') statusCode = 500;
            
            res.status(statusCode).json(result);
        }
        
    } catch (error) {
        console.error('❌ Posts API Error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Internal server error occurred'
        });
    }
});

// POST /api/scrape/reels
router.post('/reels', validateScrapeRequest, async (req, res) => {
    try {
        const { username, sessionId, maxReels = 20 } = req.body;
        
        console.log(`📡 API Request: Scraping reels for @${username}, maxReels: ${maxReels}`);
        
        const result = await ReelsService.scrapeAndStore(username, maxReels, sessionId);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            // Determine status code based on error type
            let statusCode = 400;
            if (result.error === 'PRIVATE_PROFILE') statusCode = 403;
            if (result.error === 'PROFILE_NOT_FOUND') statusCode = 404;
            if (result.error === 'NO_REELS_FOUND') statusCode = 404;
            if (result.error === 'SCRAPING_FAILED') statusCode = 500;
            
            res.status(statusCode).json(result);
        }
        
    } catch (error) {
        console.error('❌ Reels API Error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Internal server error occurred'
        });
    }
});

// GET /api/scrape/profile/:username - Get profile from database
router.get('/profile/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_REQUEST',
                message: 'Username is required'
            });
        }
        
        const result = await ProfileService.getProfile(username.replace('@', '').trim());
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            const statusCode = result.error === 'PROFILE_NOT_FOUND' ? 404 : 500;
            res.status(statusCode).json(result);
        }
        
    } catch (error) {
        console.error('❌ Get Profile API Error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Internal server error occurred'
        });
    }
});

// GET /api/scrape/posts/:username - Get posts from database
router.get('/posts/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { limit = 50 } = req.query;
        
        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_REQUEST',
                message: 'Username is required'
            });
        }
        
        const result = await PostsService.getPosts(username.replace('@', '').trim(), parseInt(limit));
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            const statusCode = result.error === 'NO_POSTS_FOUND' ? 404 : 500;
            res.status(statusCode).json(result);
        }
        
    } catch (error) {
        console.error('❌ Get Posts API Error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Internal server error occurred'
        });
    }
});

// GET /api/scrape/reels/:username - Get reels from database
router.get('/reels/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { limit = 50 } = req.query;
        
        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_REQUEST',
                message: 'Username is required'
            });
        }
        
        const result = await ReelsService.getReels(username.replace('@', '').trim(), parseInt(limit));
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            const statusCode = result.error === 'NO_REELS_FOUND' ? 404 : 500;
            res.status(statusCode).json(result);
        }
        
    } catch (error) {
        console.error('❌ Get Reels API Error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Internal server error occurred'
        });
    }
});

// GET /api/scrape/analytics/:username
router.get('/analytics/:username', async (req, res) => {
    try {
        const { username } = req.params;
        
        if (!username) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_REQUEST',
                message: 'Username is required'
            });
        }
        
        console.log(`📊 API Request: Getting analytics for @${username}`);
        
        const result = await AnalyticsService.getEngagementAnalytics(username.replace('@', '').trim());
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            const statusCode = result.error === 'PROFILE_NOT_FOUND' ? 404 : 500;
            res.status(statusCode).json(result);
        }
        
    } catch (error) {
        console.error('❌ Analytics API Error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Internal server error occurred'
        });
    }
});

module.exports = router;
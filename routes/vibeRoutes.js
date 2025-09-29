const express = require('express');
const router = express.Router();
const VibeAnalyzer = require('../services/vibeAnalyzer');
const { Profile, Post, Reel } = require('../models');

// Analyze vibe of a single text
router.post('/analyze-text', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({
                success: false,
                message: 'Text is required'
            });
        }

        const vibeResult = VibeAnalyzer.analyzeText(text);
        
        res.json({
            success: true,
            data: vibeResult
        });
    } catch (error) {
        console.error('Vibe analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze vibe',
            error: error.message
        });
    }
});

// Analyze vibe of posts for a specific user
router.get('/posts/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        
        // Get posts from database
        const posts = await Post.find({ username: username.toLowerCase() })
            .sort({ scrapedAt: -1 })
            .limit(limit)
            .lean();
        
        if (posts.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No posts found for this user'
            });
        }

        const vibeAnalysis = VibeAnalyzer.analyzePostBatch(posts);
        
        res.json({
            success: true,
            data: {
                username,
                ...vibeAnalysis,
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Post vibe analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze post vibes',
            error: error.message
        });
    }
});

// Analyze vibe of reels for a specific user
router.get('/reels/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const limit = parseInt(req.query.limit) || 50;
        
        // Get reels from database
        const reels = await Reel.find({ username: username.toLowerCase() })
            .sort({ scrapedAt: -1 })
            .limit(limit)
            .lean();
        
        if (reels.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No reels found for this user'
            });
        }

        const vibeAnalysis = VibeAnalyzer.analyzePostBatch(reels);
        
        res.json({
            success: true,
            data: {
                username,
                contentType: 'reels',
                ...vibeAnalysis,
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Reel vibe analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze reel vibes',
            error: error.message
        });
    }
});

// Combined vibe analysis for both posts and reels
router.get('/combined/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const limit = parseInt(req.query.limit) || 25; // 25 each for posts and reels
        
        // Get both posts and reels
        const [posts, reels] = await Promise.all([
            Post.find({ username: username.toLowerCase() })
                .sort({ scrapedAt: -1 })
                .limit(limit)
                .lean(),
            Reel.find({ username: username.toLowerCase() })
                .sort({ scrapedAt: -1 })
                .limit(limit)
                .lean()
        ]);
        
        if (posts.length === 0 && reels.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No content found for this user'
            });
        }

        // Analyze posts and reels separately
        const postVibeAnalysis = posts.length > 0 ? VibeAnalyzer.analyzePostBatch(posts) : null;
        const reelVibeAnalysis = reels.length > 0 ? VibeAnalyzer.analyzePostBatch(reels) : null;
        
        // Combine all content for overall analysis
        const allContent = [...posts, ...reels];
        const overallVibeAnalysis = VibeAnalyzer.analyzePostBatch(allContent);
        
        res.json({
            success: true,
            data: {
                username,
                overall: overallVibeAnalysis,
                posts: postVibeAnalysis,
                reels: reelVibeAnalysis,
                summary: {
                    totalContent: allContent.length,
                    totalPosts: posts.length,
                    totalReels: reels.length,
                    dominantVibe: overallVibeAnalysis.overallVibe,
                    vibeConfidence: overallVibeAnalysis.averageVibeScore,
                    contentMix: {
                        posts: posts.length,
                        reels: reels.length,
                        postsPercentage: Math.round((posts.length / allContent.length) * 100),
                        reelsPercentage: Math.round((reels.length / allContent.length) * 100)
                    }
                },
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Combined vibe analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze content vibes',
            error: error.message
        });
    }
});

// Get vibe trends over time
router.get('/trends/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const days = parseInt(req.query.days) || 30;
        
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);
        
        // Get recent posts and reels
        const [posts, reels] = await Promise.all([
            Post.find({ 
                username: username.toLowerCase(),
                scrapedAt: { $gte: dateLimit }
            }).sort({ scrapedAt: -1 }).lean(),
            Reel.find({ 
                username: username.toLowerCase(),
                scrapedAt: { $gte: dateLimit }
            }).sort({ scrapedAt: -1 }).lean()
        ]);
        
        const allContent = [...posts, ...reels];
        
        if (allContent.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No content found in the last ${days} days`
            });
        }

        // Group content by day and analyze vibes
        const trendData = {};
        allContent.forEach(item => {
            const date = new Date(item.scrapedAt).toISOString().split('T')[0];
            if (!trendData[date]) {
                trendData[date] = [];
            }
            trendData[date].push(item);
        });
        
        const trends = Object.entries(trendData).map(([date, content]) => {
            const vibeAnalysis = VibeAnalyzer.analyzePostBatch(content);
            return {
                date,
                contentCount: content.length,
                dominantVibe: vibeAnalysis.overallVibe,
                vibeDistribution: vibeAnalysis.vibeDistribution,
                averageVibeScore: vibeAnalysis.averageVibeScore
            };
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        res.json({
            success: true,
            data: {
                username,
                period: `${days} days`,
                trends,
                summary: {
                    totalDays: trends.length,
                    totalContent: allContent.length,
                    averageContentPerDay: Math.round(allContent.length / trends.length),
                    mostCommonVibe: Object.entries(
                        trends.reduce((acc, day) => {
                            if (day.dominantVibe !== 'neutral') {
                                acc[day.dominantVibe] = (acc[day.dominantVibe] || 0) + 1;
                            }
                            return acc;
                        }, {})
                    ).sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral'
                },
                generatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Vibe trends analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to analyze vibe trends',
            error: error.message
        });
    }
});

module.exports = router;
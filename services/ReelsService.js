const { scrapeInstagramPosts } = require('../insta_reels'); // Note: function name is scrapeInstagramPosts but it scrapes reels
const { Reel } = require('../models');

class ReelsService {
    static async scrapeAndStore(username, maxReels = 20, sessionId) {
        try {
            console.log(`🔍 Starting reels scraping for @${username}, maxReels: ${maxReels}`);
            
            // Prepare auth options
            const authOptions = sessionId ? { sessionId } : {};
            
            // Scrape reels data (function is named scrapeInstagramPosts but scrapes reels)
            const reelsData = await scrapeInstagramPosts(username, maxReels, authOptions);
            
            if (!reelsData || reelsData.length === 0) {
                return {
                    success: false,
                    error: 'NO_REELS_FOUND',
                    message: `No reels found for @${username}. Profile might be private or empty.`
                };
            }
            
            // Clear existing reels for this user to avoid duplicates
            await Reel.deleteMany({ username: username.toLowerCase() });
            
            // Prepare reels for MongoDB
            const reelsToSave = reelsData.map(reel => ({
                username: username.toLowerCase(),
                reelUrl: reel['Reel URL'] || reel.reelUrl,
                reelThumbnail: (reel['Image URL'] || reel.imageUrl) === 'Not available' ? null : (reel['Image URL'] || reel.imageUrl),
                reelCaption: (reel['Caption'] || reel.caption) === 'Not available (Instagram blocks detailed scraping)' ? null : (reel['Caption'] || reel.caption),
                reelLikes: (reel['Likes Count'] || reel.likes) === 'Not available (Instagram blocks detailed scraping)' ? null : (reel['Likes Count'] || reel.likes),
                reelComments: (reel['Comments Count'] || reel.comments) === 'Not available (Instagram blocks detailed scraping)' ? null : (reel['Comments Count'] || reel.comments),
                reelNumber: reel['Reel #'] || reel.reelNumber,
                scrapedAt: new Date()
            }));
            
            // Save reels to database
            const savedReels = await Reel.insertMany(reelsToSave);
            
            console.log(`✅ ${savedReels.length} reels saved to database for @${username}`);
            
            return {
                success: true,
                data: {
                    username: `@${username}`,
                    totalReels: savedReels.length,
                    reels: savedReels,
                    note: 'Instagram blocks detailed reel data (likes, comments, captions). Only URLs and basic info available.'
                },
                message: `${savedReels.length} reels scraped and saved for @${username}`
            };
            
        } catch (error) {
            console.error(`❌ Reels scraping failed for @${username}:`, error.message);
            
            // Handle specific error cases
            if (error.message.includes('private')) {
                return {
                    success: false,
                    error: 'PRIVATE_PROFILE',
                    message: `Profile @${username} is private - cannot scrape reels`
                };
            }
            
            if (error.message.includes('not found')) {
                return {
                    success: false,
                    error: 'PROFILE_NOT_FOUND',
                    message: `Profile @${username} not found`
                };
            }
            
            return {
                success: false,
                error: 'SCRAPING_FAILED',
                message: error.message
            };
        }
    }
    
    static async getReels(username, limit = 50) {
        try {
            const reels = await Reel.find({ username: username.toLowerCase() })
                .sort({ reelNumber: 1 }) // Sort by reel number (latest first based on scraping)
                .limit(limit);
            
            if (!reels || reels.length === 0) {
                return {
                    success: false,
                    error: 'NO_REELS_FOUND',
                    message: `No reels found for @${username} in database`
                };
            }
            
            return {
                success: true,
                data: {
                    username: `@${username}`,
                    totalReels: reels.length,
                    reels: reels,
                    note: 'Instagram blocks detailed reel data. Most engagement metrics will be null.'
                },
                message: `${reels.length} reels retrieved for @${username}`
            };
            
        } catch (error) {
            console.error(`❌ Error retrieving reels for @${username}:`, error.message);
            return {
                success: false,
                error: 'DATABASE_ERROR',
                message: error.message
            };
        }
    }
}

module.exports = ReelsService;
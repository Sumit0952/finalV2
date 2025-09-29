const { scrapeInstagramProfile } = require('../scrape-instagram');
const { Profile } = require('../models');

class ProfileService {
    static async scrapeAndStore(username, sessionId) {
        try {
            console.log(`🔍 Starting profile scraping for @${username}`);
            
            // Scrape profile data
            const profileData = await scrapeInstagramProfile(username, sessionId);
            
            // Check if profile is private (based on error or data)
            if (!profileData || profileData.error) {
                throw new Error(`Failed to scrape profile: ${profileData?.error || 'Unknown error'}`);
            }
            
            // Prepare data for MongoDB
            const profileDoc = {
                username: username.toLowerCase(),
                displayName: profileData.displayName || null,
                profilePicture: profileData.profilePicture || null,
                bio: profileData.bio || null,
                followersCount: profileData.followersCount || null,
                followingCount: profileData.followingCount || null,
                postsCount: profileData.postsCount || null,
                isVerified: profileData.isVerified || false,
                isPrivate: false, // If we got data, it's not private
                lastScraped: new Date()
            };
            
            // Update or create profile in database
            const savedProfile = await Profile.findOneAndUpdate(
                { username: username.toLowerCase() },
                profileDoc,
                { 
                    new: true, 
                    upsert: true,
                    runValidators: true
                }
            );
            
            console.log(`✅ Profile saved to database: @${username}`);
            return {
                success: true,
                data: savedProfile,
                message: `Profile for @${username} scraped and saved successfully`
            };
            
        } catch (error) {
            console.error(`❌ Profile scraping failed for @${username}:`, error.message);
            
            // Handle specific error cases
            if (error.message.includes('private')) {
                // Mark profile as private in database
                await Profile.findOneAndUpdate(
                    { username: username.toLowerCase() },
                    { 
                        username: username.toLowerCase(),
                        isPrivate: true,
                        lastScraped: new Date()
                    },
                    { upsert: true }
                );
                
                return {
                    success: false,
                    error: 'PRIVATE_PROFILE',
                    message: `Profile @${username} is private`
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
    
    static async getProfile(username) {
        try {
            const profile = await Profile.findOne({ username: username.toLowerCase() });
            
            if (!profile) {
                return {
                    success: false,
                    error: 'PROFILE_NOT_FOUND',
                    message: `Profile @${username} not found in database`
                };
            }
            
            return {
                success: true,
                data: profile,
                message: `Profile @${username} retrieved successfully`
            };
            
        } catch (error) {
            console.error(`❌ Error retrieving profile @${username}:`, error.message);
            return {
                success: false,
                error: 'DATABASE_ERROR',
                message: error.message
            };
        }
    }
}

module.exports = ProfileService;
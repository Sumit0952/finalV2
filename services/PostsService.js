const { scrapeInstagramPostsV2 } = require('../insta_posts_v2');
const { Post } = require('../models');

class PostsService {
    static async scrapeAndStore(username, maxPosts = 20, sessionId) {
        try {
            console.log(`🔍 Starting posts scraping for @${username}, maxPosts: ${maxPosts}`);
            
            // Prepare auth options
            const authOptions = sessionId ? { sessionId } : {};
            
            // Scrape posts data
            const postsData = await scrapeInstagramPostsV2(username, maxPosts, authOptions);
            
            if (!postsData || postsData.length === 0) {
                return {
                    success: false,
                    error: 'NO_POSTS_FOUND',
                    message: `No posts found for @${username}. Profile might be private or empty.`
                };
            }
            
            // Clear existing posts for this user to avoid duplicates
            await Post.deleteMany({ username: username.toLowerCase() });
            
            // Prepare posts for MongoDB
            const postsToSave = postsData.map(post => ({
                username: username.toLowerCase(),
                postUrl: post['Post Link'] || post.post_link,
                postThumbnail: (post['Post Thumbnail'] || post.post_thumb) === 'Not available' ? null : (post['Post Thumbnail'] || post.post_thumb),
                postDescription: (post['Post Description'] || post.post_desc) === 'Not available' ? null : (post['Post Description'] || post.post_desc),
                postLikes: (post['Post Likes'] || post.post_likes) === 'Not available' ? null : (post['Post Likes'] || post.post_likes),
                postComments: (post['Post Comments'] || post.post_comments) === 'Not available' ? null : (post['Post Comments'] || post.post_comments),
                postNumber: post['Post #'] || post.postNumber,
                scrapedAt: new Date()
            }));
            
            // Save posts to database
            const savedPosts = await Post.insertMany(postsToSave);
            
            console.log(`✅ ${savedPosts.length} posts saved to database for @${username}`);
            
            return {
                success: true,
                data: {
                    username: `@${username}`,
                    totalPosts: savedPosts.length,
                    posts: savedPosts
                },
                message: `${savedPosts.length} posts scraped and saved for @${username}`
            };
            
        } catch (error) {
            console.error(`❌ Posts scraping failed for @${username}:`, error.message);
            
            // Handle specific error cases
            if (error.message.includes('private')) {
                return {
                    success: false,
                    error: 'PRIVATE_PROFILE',
                    message: `Profile @${username} is private - cannot scrape posts`
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
    
    static async getPosts(username, limit = 50) {
        try {
            const posts = await Post.find({ username: username.toLowerCase() })
                .sort({ postNumber: 1 }) // Sort by post number (latest first based on scraping)
                .limit(limit);
            
            if (!posts || posts.length === 0) {
                return {
                    success: false,
                    error: 'NO_POSTS_FOUND',
                    message: `No posts found for @${username} in database`
                };
            }
            
            return {
                success: true,
                data: {
                    username: `@${username}`,
                    totalPosts: posts.length,
                    posts: posts
                },
                message: `${posts.length} posts retrieved for @${username}`
            };
            
        } catch (error) {
            console.error(`❌ Error retrieving posts for @${username}:`, error.message);
            return {
                success: false,
                error: 'DATABASE_ERROR',
                message: error.message
            };
        }
    }
}

module.exports = PostsService;
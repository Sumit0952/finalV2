const mongoose = require('mongoose');
const { Profile, Post, Reel } = require('./models');

async function checkDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/instagram_scraper');
        console.log('✅ Connected to MongoDB');

        // Check profiles collection
        const profilesCount = await Profile.countDocuments();
        console.log(`📊 Profiles in database: ${profilesCount}`);
        
        if (profilesCount > 0) {
            const profiles = await Profile.find({}, 'username displayName lastScraped').limit(5);
            console.log('Recent profiles:', profiles);
        }

        // Check posts collection
        const postsCount = await Post.countDocuments();
        console.log(`📊 Posts in database: ${postsCount}`);
        
        if (postsCount > 0) {
            const posts = await Post.find({}, 'username createdAt').limit(5);
            console.log('Recent posts:', posts);
        }

        // Check reels collection
        const reelsCount = await Reel.countDocuments();
        console.log(`📊 Reels in database: ${reelsCount}`);
        
        if (reelsCount > 0) {
            const reels = await Reel.find({}, 'username createdAt').limit(5);
            console.log('Recent reels:', reels);
        }

        // Test API call simulation
        console.log('\n🧪 Testing API functionality...');
        
        // Import some existing JSON data if available
        const fs = require('fs');
        const path = require('path');
        
        const postsDir = path.join(__dirname, 'instagram-posts');
        const reelsDir = path.join(__dirname, 'instagram-reels');
        
        if (fs.existsSync(postsDir)) {
            const postFiles = fs.readdirSync(postsDir);
            console.log(`📁 Found ${postFiles.length} post files`);
        }
        
        if (fs.existsSync(reelsDir)) {
            const reelFiles = fs.readdirSync(reelsDir);
            console.log(`📁 Found ${reelFiles.length} reel files`);
        }

    } catch (error) {
        console.error('❌ Database check failed:', error.message);
    } finally {
        mongoose.connection.close();
    }
}

checkDatabase();
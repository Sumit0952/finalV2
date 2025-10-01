const InstagramAuth = require('./instagram-auth');
const path = require('path');


async function scrapeInstagramProfile(username, sessionId) {
    const auth = new InstagramAuth();
    
    try {
        // Authenticate with Instagram using session ID
        await auth.login(sessionId);
        const page = auth.getPage();
        
        console.log(`🔍 Scraping Instagram profile: @${username}`);
        await page.goto(`https://www.instagram.com/${username}/`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for the profile to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if profile exists by looking for error messages
        const pageContent = await page.content();
        if (pageContent.includes("Sorry, this page isn't available")) {
            throw new Error(`❌ Profile @${username} not found`);
        }
        
        if (pageContent.includes("This Account is Private")) {
            console.log(`🔒 Profile @${username} is private`);
        }

        // Extract profile information
        const profileData = await page.evaluate(() => {
            const data = {};
            
            try {
                // Get profile picture - try multiple selectors
                const profilePicSelectors = [
                    'img[data-testid="user-avatar"]',
                    'header img',
                    'img[alt*="profile picture"]',
                    'img[alt*="Profile picture"]'
                ];
                
                for (const selector of profilePicSelectors) {
                    const element = document.querySelector(selector);
                    if (element && element.src) {
                        data.profilePicture = element.src;
                        break;
                    }
                }

                // Get username - try multiple selectors
                const usernameSelectors = [
                    'h2',
                    'header h2',
                    '[data-testid="user-name"]',
                    'span[dir="auto"]'
                ];
                
                for (const selector of usernameSelectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent.trim()) {
                        data.username = element.textContent.trim();
                        break;
                    }
                }

                // Get display name
                const displayNameSelectors = [
                    'header h1',
                    'h1',
                    '[data-testid="user-full-name"]'
                ];
                
                for (const selector of displayNameSelectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent.trim()) {
                        data.displayName = element.textContent.trim();
                        break;
                    }
                }

                // Get bio/description
                const bioSelectors = [
                    'header div[data-testid="user-bio"]',
                    'header div span',
                    '[data-testid="user-bio"]'
                ];
                
                for (const selector of bioSelectors) {
                    const element = document.querySelector(selector);
                    if (element && element.textContent.trim()) {
                        data.bio = element.textContent.trim();
                        break;
                    }
                }

                // Extract numbers from the page text using regex
                const pageText = document.body.textContent;
                
                // More flexible regex patterns
                const followersMatch = pageText.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s*(?:followers?|follower)/i);
                const followingMatch = pageText.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s*(?:following)/i);
                const postsMatch = pageText.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s*(?:posts?|post)/i);

                data.followers = followersMatch ? followersMatch[1] : null;
                data.following = followingMatch ? followingMatch[1] : null;
                data.posts = postsMatch ? postsMatch[1] : null;

                // Convert K, M, B suffixes to numbers
                function parseNumber(str) {
                    if (!str) return null;
                    const num = parseFloat(str.replace(/,/g, ''));
                    if (str.includes('K')) return Math.floor(num * 1000);
                    if (str.includes('M')) return Math.floor(num * 1000000);
                    if (str.includes('B')) return Math.floor(num * 1000000000);
                    return Math.floor(num);
                }

                data.followersCount = parseNumber(data.followers);
                data.followingCount = parseNumber(data.following);
                data.postsCount = parseNumber(data.posts);

                // Get verification status
                const verifiedSelectors = [
                    '[data-testid="verified-icon"]',
                    'svg[aria-label="Verified"]',
                    '[aria-label*="Verified"]'
                ];
                
                data.isVerified = false;
                for (const selector of verifiedSelectors) {
                    if (document.querySelector(selector)) {
                        data.isVerified = true;
                        break;
                    }
                }

                return data;
            } catch (error) {
                console.error('Error extracting data:', error);
                return { error: error.message };
            }
        });

        console.log('✅ Profile data extracted successfully!');
        return profileData;

    } catch (error) {
        console.error('❌ Error scraping profile:', error);
        throw error;
    } finally {
        await auth.close();
    }
}

// Function to format the data nicely
function formatProfileData(data, username) {
    return {
        'Influencer Name': data.displayName || data.username || username,
        'Username (@handle)': `@${data.username || username}`,
        'Profile Picture': data.profilePicture || 'Not available',
        'Followers Count': data.followersCount ? data.followersCount.toLocaleString() : (data.followers || 'Not available'),
        'Following Count': data.followingCount ? data.followingCount.toLocaleString() : (data.following || 'Not available'),
        'Number of Posts': data.postsCount ? data.postsCount.toLocaleString() : (data.posts || 'Not available'),
        'Bio': data.bio || 'Not available',
        'Is Verified': data.isVerified ? 'Yes' : 'No'
    };
}

// Main execution - COMMENTED OUT TO PREVENT AUTO-EXECUTION WHEN IMPORTED
// Uncomment this section if you want to run this file directly with: node scrape-instagram.js
/*
(async () => {
    try {
        // 🔧 CHANGE THESE VALUES TO SCRAPE DIFFERENT PROFILES
        const username = 'just_rishuuuuu'; // Replace with any Instagram username
        const sessionId = '77230796546%3AwieAbSVxQ9BjoP%3A21%3AAYh8U8dvo3TJ3loA48EbYEYpraBhs9n6bizTNG0GpQ'; // Replace with your Instagram session ID
        
        // Validate session ID
        if (sessionId === '77230796546%3AwieAbSVxQ9BjoP%3A21%3AAYh8U8dvo3TJ3loA48EbYEYpraBhs9n6bizTNG0GpQ') {
            console.error('❌ Please provide a valid Instagram session ID!');
            console.log('📝 To get your session ID:');
            console.log('1. Open Instagram in your browser and log in');
            console.log('2. Open Developer Tools (F12)');
            console.log('3. Go to Application/Storage tab > Cookies > https://www.instagram.com');
            console.log('4. Find the "sessionid" cookie and copy its value');
            console.log('5. Replace the session ID in the code with that value');
            return;
        }
        
        console.log(`🚀 Starting Instagram profile scraping for @${username}...`);
        
        const profileData = await scrapeInstagramProfile(username, sessionId);
        const formattedData = formatProfileData(profileData, username);
        
        console.log('\n📊 === INSTAGRAM PROFILE DATA ===');
        console.log(JSON.stringify(formattedData, null, 2));
        
        // Save to file
        const fs = require('fs');
        const filename = `instagram-${username}-${new Date().toISOString().split('T')[0]}.json`;
        const folder = 'instagram-profiles';
        const filepath = path.join(folder, filename);
        fs.writeFileSync(filepath, JSON.stringify(formattedData, null, 2));
        console.log(`\n💾 Data saved to: ${filename}`);
        
    } catch (error) {
        console.error('💥 Scraping failed:', error.message);
    }
})();
*/

module.exports = { scrapeInstagramProfile, formatProfileData };

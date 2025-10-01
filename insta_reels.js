const puppeteer = require('puppeteer');
const InstagramAuth = require('./instagram-auth');
const path = require('path');

/**
 * Instagram Reels Scraper with Authentication Support
 * 
 * Features:
 * - Scrape Instagram reels from any public profile's reels page
 * - Optional authentication using session ID or credentials
 * - Handles both authenticated and guest scraping
 * - Multiple scraping approaches for better success rate
 * 
 * Usage:
 * 1. Set username and maxPosts in the main execution section
 * 2. Choose authentication method:
 *    - Session ID: Set instagramSessionId (recommended)
 *    - Credentials: Set instagramUsername and instagramPassword
 *    - No auth: Leave all auth fields null
 * 3. Run the script: node ppinstareels.js
 * 
 * Note: Authentication helps access more content but Instagram may still block detailed scraping
 */

async function scrapeInstagramPosts(username, maxPosts = 10, authOptions = {}) {
    let auth = null;
    let browser = null;
    let page = null;

    try {
        // Initialize authentication if provided
        if (authOptions.sessionId) {
            auth = new InstagramAuth();
            
            console.log('🔐 Using session ID authentication...');
            await auth.login(authOptions.sessionId, { headless: true });
            
            browser = auth.getBrowser();
            page = auth.getPage();
        } else {
            // No authentication - use regular browser
            console.log('⚠️ No authentication provided - scraping as guest');
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-features=VizDisplayCompositor'
                ]
            });
            page = await browser.newPage();
            
            // Set user agent to avoid detection
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setViewport({ width: 1366, height: 768 });
        }
        
        // Block images and other resources to speed up loading
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'image' || req.resourceType() === 'media') {
                req.abort();
            } else {
                req.continue();
            }
        });
        
        console.log(`🔍 Scraping Instagram reels for @${username}...`);
        await page.goto(`https://www.instagram.com/${username}/reels/`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait for the profile to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if profile exists
        const pageContent = await page.content();
        if (pageContent.includes("Sorry, this page isn't available")) {
            throw new Error(`❌ Profile @${username} not found`);
        }
        
        if (pageContent.includes("This Account is Private")) {
            throw new Error(`🔒 Profile @${username} is private - cannot scrape reels`);
        }

        console.log(`📱 Loading reels for @${username}...`);

        // Smart incremental scroll logic to collect all reels
        console.log('📜 Starting smart incremental scroll to collect all reels...');
        
        let allReelLinks = new Set(); // Use Set to automatically handle duplicates
        let scrollAttempts = 0;
        const maxScrollAttempts = 100; // Increased for thoroughness
        let noNewLinksCount = 0;
        const maxNoNewLinksAttempts = 3; // Stop if no new links for 3 consecutive attempts

        while (scrollAttempts < maxScrollAttempts && noNewLinksCount < maxNoNewLinksAttempts) {
            // Get current reel links
            const currentReelLinks = await page.evaluate(() => {
                const links = [];
                const reelElements = document.querySelectorAll('a[href*="/reel/"]');
                
                reelElements.forEach(element => {
                    const href = element.getAttribute('href');
                    if (href && href.includes('/reel/')) {
                        // Convert relative URLs to absolute
                        const fullUrl = href.startsWith('http') ? href : `https://www.instagram.com${href}`;
                        links.push(fullUrl);
                    }
                });
                
                return links;
            });

            console.log(`📊 Found ${currentReelLinks.length} reel links on page`);

            // Add new links to our collection
            const previousCount = allReelLinks.size;
            currentReelLinks.forEach(link => allReelLinks.add(link));
            const newLinksCount = allReelLinks.size - previousCount;

            if (newLinksCount > 0) {
                console.log(`✅ Added ${newLinksCount} new unique reels (Total: ${allReelLinks.size})`);
                noNewLinksCount = 0; // Reset counter
            } else {
                noNewLinksCount++;
                console.log(`⏳ No new unique reels found (attempt ${noNewLinksCount}/${maxNoNewLinksAttempts})`);
            }

            // Check if we have enough reels
            if (allReelLinks.size >= maxPosts) {
                console.log(`🎯 Target of ${maxPosts} reels reached! (Found: ${allReelLinks.size})`);
                break;
            }

            // Scroll down to load more content
            await page.evaluate(() => {
                // Multiple scroll strategies for better content loading
                const currentScroll = window.pageYOffset;
                const documentHeight = document.body.scrollHeight;
                const viewportHeight = window.innerHeight;
                
                // Strategy 1: Scroll to bottom
                window.scrollTo(0, documentHeight);
                
                // Strategy 2: Additional scroll by viewport height
                setTimeout(() => {
                    window.scrollBy(0, viewportHeight);
                }, 500);
                
                // Strategy 3: Smooth scroll to trigger lazy loading
                setTimeout(() => {
                    window.scrollTo({
                        top: documentHeight,
                        behavior: 'smooth'
                    });
                }, 1000);
            });

            // Progressive wait time based on attempt number
            const waitTime = Math.min(2000 + (scrollAttempts * 100), 5000);
            await new Promise(resolve => setTimeout(resolve, waitTime));

            scrollAttempts++;
        }

        console.log(`📊 Scroll complete! Total attempts: ${scrollAttempts}, Unique reels collected: ${allReelLinks.size}`);

        // Convert Set to Array for easier handling
        const reelUrls = Array.from(allReelLinks);

        console.log(`🎯 Final collection: ${reelUrls.length} unique reels found`);

        // Limit to maxPosts if specified
        const finalReelUrls = maxPosts ? reelUrls.slice(0, maxPosts) : reelUrls;

        console.log(`📊 Found ${finalReelUrls.length} reel URLs`);

        if (finalReelUrls.length === 0) {
            console.log('⚠️ No reels found. Profile might be empty or private.');
            return [];
        }

        console.log(`🔍 Processing ${finalReelUrls.length} reels...`);

        const postsData = [];

        // For each reel, try to extract what we can from the profile page
        for (let i = 0; i < finalReelUrls.length; i++) {
            const reelUrl = finalReelUrls[i];
            console.log(`📱 Processing reel ${i + 1}/${finalReelUrls.length}`);

            try {
                // Try to get basic info from the profile page first
                const basicInfo = await page.evaluate((url) => {
                    // Find the reel container on the profile page
                    const reelLink = document.querySelector(`a[href="${url}"]`);
                    if (!reelLink) return null;

                    const container = reelLink.closest('article') || reelLink.closest('div');
                    if (!container) return null;

                    const data = {};

                    // Try to get thumbnail image
                    const img = container.querySelector('img');
                    if (img) {
                        data.imageUrl = img.src || img.getAttribute('srcset')?.split(' ')[0];
                    }

                    return data;
                }, reelUrl);

                // Create reel data
                const reelData = {
                    reelNumber: i + 1,
                    reelUrl: reelUrl,
                    imageUrl: basicInfo?.imageUrl || 'Not available',
                    caption: 'Not available (Instagram blocks detailed scraping)',
                    likes: 'Not available (Instagram blocks detailed scraping)',
                    comments: 'Not available (Instagram blocks detailed scraping)',
                    postDate: 'Not available (Instagram blocks detailed scraping)',
                    note: 'Instagram has strong anti-bot measures that prevent detailed reel scraping'
                };

                postsData.push(reelData);
                console.log(`✅ Reel ${i + 1}: ${reelData.imageUrl !== 'Not available' ? 'Has thumbnail' : 'No thumbnail'}`);

            } catch (error) {
                console.error(`❌ Error processing reel ${i + 1}:`, error.message);
                // Add the reel with minimal data
                postsData.push({
                    reelNumber: i + 1,
                    reelUrl: reelUrl,
                    imageUrl: 'Error loading',
                    caption: 'Error loading',
                    likes: 'Error loading',
                    comments: 'Error loading',
                    postDate: 'Error loading',
                    note: 'Error occurred during scraping'
                });
            }
        }

        console.log(`✅ Successfully scraped ${postsData.length} reels`);
        return postsData;

    } catch (error) {
        console.error('❌ Error scraping reels:', error);
        throw error;
    } finally {
        if (auth) {
            await auth.close();
        } else if (browser) {
            await browser.close();
        }
    }
}

// Function to format reels data nicely
function formatReelsData(reels, username) {
    return {
        username: `@${username}`,
        totalReels: reels.length,
        scrapingNote: 'Instagram has strong anti-bot measures. This scraper gets reel URLs and basic info, but detailed data (likes, comments, captions) is often blocked.',
        reels: reels.map(reel => ({
            'Reel #': reel.reelNumber,
            'Reel URL': reel.reelUrl,
            'Image URL': reel.imageUrl,
            'Caption': reel.caption,
            'Likes Count': reel.likes,
            'Comments Count': reel.comments,
            'Post Date': reel.postDate,
            'Note': reel.note
        }))
    };
}

// Alternative approach: Try to get some data from the profile page itself
async function scrapeProfilePosts(username, maxPosts = 10, authOptions = {}) {
    let auth = null;
    let browser = null;
    let page = null;

    try {
        // Initialize authentication if provided
        if (authOptions.sessionId) {
            auth = new InstagramAuth();
            
            console.log('🔐 Using session ID authentication...');
            await auth.login(authOptions.sessionId, { headless: true });
            
            browser = auth.getBrowser();
            page = auth.getPage();
        } else {
            // No authentication - use regular browser
            console.log('⚠️ No authentication provided - scraping as guest');
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            });
            page = await browser.newPage();
            
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await page.setViewport({ width: 1366, height: 768 });
        }
        
        console.log(`🔍 Alternative approach: Scraping profile reels for @${username}...`);
        await page.goto(`https://www.instagram.com/${username}/reels/`, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        await new Promise(resolve => setTimeout(resolve, 5000));

        // Try to extract reels data directly from profile page
        const reelsData = await page.evaluate((maxPosts) => {
            const reels = [];
            
            try {
                // Find all reel containers
                const reelContainers = document.querySelectorAll('article, div[role="link"]');
                
                for (let i = 0; i < Math.min(reelContainers.length, maxPosts); i++) {
                    const container = reelContainers[i];
                    const reel = {};

                    // Get reel link
                    const linkElement = container.querySelector('a[href*="/reel/"]');
                    if (linkElement) {
                        reel.reelUrl = linkElement.href;
                    }

                    // Get image
                    const imgElement = container.querySelector('img');
                    if (imgElement) {
                        reel.imageUrl = imgElement.src || imgElement.getAttribute('srcset')?.split(' ')[0];
                    }

                    // Try to get any visible text that might be caption
                    const textElements = container.querySelectorAll('span, div');
                    let visibleText = '';
                    textElements.forEach(el => {
                        if (el.textContent && el.textContent.trim().length > 10) {
                            visibleText += el.textContent.trim() + ' ';
                        }
                    });
                    reel.caption = visibleText.trim().substring(0, 200) || 'Not visible on profile';

                    if (reel.reelUrl) {
                        reels.push({
                            reelNumber: reels.length + 1,
                            reelUrl: reel.reelUrl,
                            imageUrl: reel.imageUrl || 'Not available',
                            caption: reel.caption,
                            likes: 'Not available on profile page',
                            comments: 'Not available on profile page',
                            postDate: 'Not available on profile page'
                        });
                    }
                }

                return reels;
            } catch (error) {
                console.error('Error extracting reels:', error);
                return [];
            }
        }, maxPosts);

        console.log(`✅ Found ${reelsData.length} reels from profile page`);
        return reelsData;

    } catch (error) {
        console.error('❌ Error in alternative approach:', error);
        return [];
    } finally {
        if (auth) {
            await auth.close();
        } else if (browser) {
            await browser.close();
        }
    }
}

// Main execution - COMMENTED OUT TO PREVENT AUTO-EXECUTION WHEN IMPORTED
// Uncomment this section if you want to run this file directly with: node insta_reels.js
/*
(async () => {
    try {
        // 🔧 CHANGE THESE PARAMETERS
        const username = 'virat.kohli'; // Replace with any Instagram username
        const maxPosts = 200; // Number of recent posts to scrape
        
        // 🔐 AUTHENTICATION OPTIONS (Choose one method or leave all null for guest access)
        const authOptions = {
            // Method 1: Session ID (Recommended - most reliable)
            sessionId: '77230796546%3AwieAbSVxQ9BjoP%3A21%3AAYh8U8dvo3TJ3loA48EbYEYpraBhs9n6bizTNG0GpQ', // Get this from your browser's Instagram cookies
        };
        
        console.log(`🚀 Starting Instagram reels scraping for @${username}...`);
        console.log(`📊 Will scrape up to ${maxPosts} recent reels`);
        
        if (authOptions.sessionId) {
            console.log(`🔐 Using session ID authentication`);
        }
        else {
            console.log(`⚠️ No authentication provided - scraping as guest (limited access)`);
        }
        
        // Try the main approach first
        let reelsData = await scrapeInstagramPosts(username, maxPosts, authOptions);
        
        // If that doesn't work well, try the alternative approach
        // if (reelsData.length === 0 || reelsData.every(reel => reel.imageUrl === 'Not available')) {
        //     console.log('\n🔄 Trying alternative approach...');
        //     reelsData = await scrapeProfilePosts(username, maxPosts, authOptions);
        // }
        
        const formattedData = formatReelsData(reelsData, username);
        
        console.log('\n📊 === INSTAGRAM REELS DATA ===');
        console.log(JSON.stringify(formattedData, null, 2));
        
        // Save to file
        const fs = require('fs');
        const filename = `instagram-reels-${username}-${new Date().toISOString().split('T')[0]}.json`;
        const folder = 'instagram-reels';
        const filepath = path.join(folder, filename);
        fs.writeFileSync(filepath, JSON.stringify(formattedData, null, 2));
        console.log(`\n💾 Reels data saved to: ${filename}`);
        
    } catch (error) {
        console.error('💥 Reels scraping failed:', error.message);
    }
})();
*/

module.exports = { scrapeInstagramPosts, scrapeProfilePosts, formatReelsData, InstagramAuth };

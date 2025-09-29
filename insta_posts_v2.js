const puppeteer = require('puppeteer');
const InstagramAuth = require('./instagram-auth');
const path = require('path');


/**
 * Instagram Posts Scraper V2 - Enhanced with Proper DOM Extraction
 * 
 * Note: Minimal edits from your original file:
 * - headless mode enabled ("new")
 * - reduced wait times for faster scraping
 * - preserved your function names and overall logic
 * - replaced page.waitForTimeout(...) with a compatible sleep helper
 */

// helper for waiting that works with any Node/Puppeteer version
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeInstagramPostsV2(username, maxPosts = 10, authOptions = {}) {
    let auth = null;
    let browser = null;
    let page = null;

    try {
        // Initialize authentication if provided
        if (authOptions.sessionId) {
            auth = new InstagramAuth();
            
            console.log('🔐 Using session ID authentication (headless)...');
            // changed to headless "new" for hidden running
            await auth.login(authOptions.sessionId, { headless: "new" });
            
            browser = auth.getBrowser();
            page = auth.getPage();
            // set reasonable timeouts
            page.setDefaultNavigationTimeout(20000);
            page.setDefaultTimeout(20000);
        } else {
            // No authentication - use regular browser (hidden)
            console.log('⚠️ No authentication provided - scraping as guest (headless)...');
            browser = await puppeteer.launch({
                headless: "new", // <---- changed: hidden
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
            // set reasonable timeouts
            page.setDefaultNavigationTimeout(20000);
            page.setDefaultTimeout(20000);
        }
        
        console.log(`🔍 Scraping Instagram posts for @${username}...`);
        await page.goto(`https://www.instagram.com/${username}/`, {
            waitUntil: 'networkidle2',
            timeout: 20000
        });

        // Wait for the profile to load (reduced)
        await sleep(1200);

        // Check if profile exists
        const pageContent = await page.content();
        if (pageContent.includes("Sorry, this page isn't available")) {
            throw new Error(`❌ Profile @${username} not found`);
        }
        
        if (pageContent.includes("This Account is Private")) {
            throw new Error(`🔒 Profile @${username} is private - cannot scrape posts`);
        }

        console.log(`📱 Loading posts for @${username}...`);

        // Smart incremental scroll logic to collect all posts
        console.log('📜 Starting smart incremental scroll to collect all posts...');
        
        let allPostLinks = new Set();
        let scrollAttempts = 0;
        const maxScrollAttempts = 100;
        let noNewLinksCount = 0;
        const maxNoNewLinksAttempts = 3;

        while (scrollAttempts < maxScrollAttempts && noNewLinksCount < maxNoNewLinksAttempts) {
            // Get current post links
            const currentPostLinks = await page.evaluate(() => {
                const links = [];
                const postElements = document.querySelectorAll('a[href*="/p/"]');
                
                postElements.forEach(element => {
                    const href = element.getAttribute('href');
                    if (href && href.includes('/p/')) {
                        const fullUrl = href.startsWith('http') ? href : `https://www.instagram.com${href}`;
                        links.push(fullUrl);
                    }
                });
                
                return links;
            });

            console.log(`📊 Found ${currentPostLinks.length} post links on page`);

            // Add new links to our collection
            const previousCount = allPostLinks.size;
            currentPostLinks.forEach(link => allPostLinks.add(link));
            const newLinksCount = allPostLinks.size - previousCount;

            if (newLinksCount > 0) {
                console.log(`✅ Added ${newLinksCount} new unique posts (Total: ${allPostLinks.size})`);
                noNewLinksCount = 0;
            } else {
                noNewLinksCount++;
                console.log(`⏳ No new unique posts found (attempt ${noNewLinksCount}/${maxNoNewLinksAttempts})`);
            }

            // Check if we have enough posts
            if (allPostLinks.size >= maxPosts) {
                console.log(`🎯 Target of ${maxPosts} posts reached! (Found: ${allPostLinks.size})`);
                break;
            }

            // Scroll down to load more content (simplified & faster)
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight * 1.5);
            });

            // Reduced wait/backoff for faster scraping
            const waitTime = Math.min(600 + (scrollAttempts * 50), 1500);
            await sleep(waitTime);

            scrollAttempts++;
        }

        console.log(`📊 Scroll complete! Total attempts: ${scrollAttempts}, Unique posts collected: ${allPostLinks.size}`);

        // Move back to top quickly
        await page.evaluate(() => {
            window.scrollTo(0, 0);
        });

        // Convert Set to Array
        const postUrls = Array.from(allPostLinks);
        console.log(`🎯 Final collection: ${postUrls.length} unique posts found`);

        if (postUrls.length === 0) {
            console.log('⚠️ No posts found. Profile might be empty or private.');
            return [];
        }

        // Limit to maxPosts if specified
        const finalPostUrls = maxPosts ? postUrls.slice(0, maxPosts) : postUrls;
        console.log(`🔍 Processing ${finalPostUrls.length} posts...`);

        const postsData = [];

        // Extract detailed data from each post
        for (let i = 0; i < finalPostUrls.length; i++) {
            const postUrl = finalPostUrls[i];
            console.log(`📱 Processing post ${i + 1}/${finalPostUrls.length}: ${postUrl}`);

            try {
                // Extract post data using the DOM structure you provided
                const postData = await page.evaluate((url) => {
                    const data = {
                        post_link: url,
                        post_thumb: null,
                        post_desc: null,
                        post_likes: null,
                        post_comments: null
                    };

                    try {
                        // Find the post container using the href
                        const postLink = document.querySelector(`a[href*="${url.split('/p/')[1]}"]`);
                        if (!postLink) {
                            // not found in grid; return placeholders
                            return data;
                        }

                        const container = postLink.closest('div');
                        if (!container) {
                            return data;
                        }

                        // Extract post thumbnail
                        const img = container.querySelector('img');
                        if (img) {
                            data.post_thumb = img.src || img.getAttribute('srcset')?.split(' ')[0];
                        }

                        // Extract post description from img alt attribute
                        if (img && img.alt) {
                            data.post_desc = img.alt;
                        }

                        // Try to find likes and comments (they might be in hover elements)
                        // NOTE: these selectors are best-effort in grid

                        const allText = container.textContent || '';
                        const likesMatch = allText.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s*(?:likes?|like)/i);
                        const commentsMatch = allText.match(/(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)\s*(?:comments?|comment)/i);

                        if (likesMatch) {
                            data.post_likes = likesMatch[1];
                        }
                        if (commentsMatch) {
                            data.post_comments = commentsMatch[1];
                        }

                        return data;
                    } catch (error) {
                        console.error('Error extracting post data:', error);
                        return data;
                    }
                }, postUrl);

                // If we didn't get likes/comments, try hovering over the post (reduced wait)
                if (!postData.post_likes || !postData.post_comments) {
                    console.log(`🔄 Trying hover simulation for post ${i + 1} (short wait)...`);
                    
                    try {
                        const selector = `a[href*="${postUrl.split('/p/')[1]}"]`;
                        const postElement = await page.$(selector);
                        if (postElement) {
                            await postElement.hover();
                            // reduced hover wait
                            await sleep(800);
                            
                            // Try to extract hover data using the specific DOM structure you provided
                            const hoverData = await page.evaluate(() => {
                                const data = {};
                                try {
                                    const hoverContainer = document.querySelector('div[style*="background: rgba(0, 0, 0, 0.7)"]');
                                    if (hoverContainer) {
                                        const ul = hoverContainer.querySelector('ul');
                                        if (ul) {
                                            const liElements = ul.querySelectorAll('li');
                                            
                                            if (liElements[0]) {
                                                const likesSpan = liElements[0].querySelector('span');
                                                if (likesSpan) data.post_likes = likesSpan.textContent.trim();
                                            }
                                            
                                            if (liElements[1]) {
                                                const commentsSpan = liElements[1].querySelector('span');
                                                if (commentsSpan) data.post_comments = commentsSpan.textContent.trim();
                                            }
                                        }
                                    }

                                    // Fallback scanning
                                    if (!data.post_likes || !data.post_comments) {
                                        const spans = Array.from(document.querySelectorAll('span')).map(s => s.textContent?.trim()).filter(Boolean);
                                        const numbers = spans.filter(t => /^\d+(?:\.\d+)?[KMB]?$/.test(t));
                                        if (numbers.length >= 2) {
                                            data.post_likes = data.post_likes || numbers[0];
                                            data.post_comments = data.post_comments || numbers[1];
                                        }
                                    }

                                    return data;
                                } catch (err) {
                                    return data;
                                }
                            });

                            if (hoverData.post_likes) postData.post_likes = hoverData.post_likes;
                            if (hoverData.post_comments) postData.post_comments = hoverData.post_comments;

                            console.log(`🎯 Hover data: Likes=${hoverData.post_likes || 'n/a'}, Comments=${hoverData.post_comments || 'n/a'}`);
                        }
                    } catch (hoverError) {
                        console.log(`⚠️ Hover simulation failed for post ${i + 1}:`, hoverError.message);
                    }
                }

                // Create final post data
                const finalPostData = {
                    postNumber: i + 1,
                    post_link: postData.post_link,
                    post_thumb: postData.post_thumb || 'Not available',
                    post_desc: postData.post_desc || 'Not available',
                    post_likes: postData.post_likes || 'Not available',
                    post_comments: postData.post_comments || 'Not available'
                };

                postsData.push(finalPostData);
                console.log(`✅ Post ${i + 1}: ${finalPostData.post_thumb !== 'Not available' ? 'Has thumbnail' : 'No thumbnail'} | ${finalPostData.post_likes} | ${finalPostData.post_comments}`);

            } catch (error) {
                console.error(`❌ Error processing post ${i + 1}:`, error.message);
                postsData.push({
                    postNumber: i + 1,
                    post_link: postUrl,
                    post_thumb: 'Error loading',
                    post_desc: 'Error loading',
                    post_likes: 'Error loading',
                    post_comments: 'Error loading'
                });
            }
        }

        console.log(`✅ Successfully scraped ${postsData.length} posts`);
        return postsData;

    } catch (error) {
        console.error('❌ Error scraping posts:', error);
        throw error;
    } finally {
        if (auth) {
            await auth.close();
        } else if (browser) {
            await browser.close();
        }
    }
}

// Function to format posts data nicely
function formatPostsDataV2(posts, username) {
    return {
        username: `@${username}`,
        totalPosts: posts.length,
        scrapingNote: 'Enhanced scraper with proper DOM extraction for post_link, post_thumb, post_desc, post_likes, post_comments',
        posts: posts.map(post => ({
            'Post #': post.postNumber,
            'Post Link': post.post_link,
            'Post Thumbnail': post.post_thumb,
            'Post Description': post.post_desc,
            'Post Likes': post.post_likes,
            'Post Comments': post.post_comments
        }))
    };
}

module.exports = { scrapeInstagramPostsV2, formatPostsDataV2 };

const puppeteer = require('puppeteer');

/**
 * Instagram Authentication Module
 * Handles login using session_id cookie for more reliable scraping
 */

class InstagramAuth {
    constructor() {
        this.browser = null;
        this.page = null;
        this.isLoggedIn = false;
    }

    /**
     * Initialize browser with authentication
     * @param {string} sessionId - Instagram session ID from browser cookies
     * @param {Object} options - Browser launch options
     */
    async login(sessionId, options = {}) {
        const defaultOptions = {
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
        };

        const browserOptions = { ...defaultOptions, ...options };
        
        try {
            console.log('🚀 Initializing browser with authentication...');
            this.browser = await puppeteer.launch(browserOptions);
            this.page = await this.browser.newPage();
            
            // Set user agent to avoid detection
            await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await this.page.setViewport({ width: 1366, height: 768 });

            // Set the session cookie
            await this.setSessionCookie(sessionId);
            
            // Verify login by visiting Instagram
            await this.verifyLogin();
            
            console.log('✅ Successfully authenticated with Instagram!');
            this.isLoggedIn = true;
            return true;

        } catch (error) {
            console.error('❌ Authentication failed:', error.message);
            await this.close();
            throw error;
        }
    }

    /**
     * Set Instagram session cookie
     * @param {string} sessionId - The session ID from browser cookies
     */
    async setSessionCookie(sessionId) {
        console.log('🍪 Setting session cookie...');
        
        // Navigate to Instagram first to set the domain
        await this.page.goto('https://www.instagram.com/', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Set the session cookie
        await this.page.setCookie({
            name: 'sessionid',
            value: sessionId,
            domain: '.instagram.com',
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        // Also set some additional cookies that might be needed
        await this.page.setCookie({
            name: 'csrftoken',
            value: 'dummy', // This will be updated by Instagram
            domain: '.instagram.com',
            path: '/',
            httpOnly: false,
            secure: true,
            sameSite: 'Lax'
        });
    }

    /**
     * Verify that login was successful
     */
    async verifyLogin() {
        console.log('🔍 Verifying authentication...');
        
        // Navigate to Instagram and check if we're logged in
        await this.page.goto('https://www.instagram.com/', {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        // Wait a bit for the page to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check for login indicators
        const isLoggedIn = await this.page.evaluate(() => {
            // Look for elements that indicate we're logged in
            const indicators = [
                'a[href="/direct/inbox/"]', // Direct messages link
                'a[href*="/accounts/edit/"]', // Profile edit link
                'button[aria-label="New post"]', // New post button
                '[data-testid="user-avatar"]' // User avatar
            ];
            
            return indicators.some(selector => document.querySelector(selector));
        });

        if (!isLoggedIn) {
            // Check if we're on login page
            const isOnLoginPage = await this.page.evaluate(() => {
                return document.querySelector('input[name="username"]') !== null ||
                       document.querySelector('input[type="password"]') !== null ||
                       window.location.href.includes('/accounts/login/');
            });

            if (isOnLoginPage) {
                throw new Error('❌ Session ID is invalid or expired. Please get a fresh session ID from your browser.');
            }
        }

        console.log('✅ Authentication verified successfully!');
    }

    /**
     * Get the authenticated page for scraping
     * @returns {Object} Puppeteer page object
     */
    getPage() {
        if (!this.isLoggedIn || !this.page) {
            throw new Error('❌ Not authenticated. Please call login() first.');
        }
        return this.page;
    }

    /**
     * Get the browser instance
     * @returns {Object} Puppeteer browser object
     */
    getBrowser() {
        if (!this.browser) {
            throw new Error('❌ Browser not initialized. Please call login() first.');
        }
        return this.browser;
    }

    /**
     * Check if currently logged in
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.isLoggedIn;
    }

    /**
     * Close browser and cleanup
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
            this.isLoggedIn = false;
            console.log('🔒 Browser closed and session ended');
        }
    }

    /**
     * Alternative method: Login with username and password
     * @param {string} username - Instagram username
     * @param {string} password - Instagram password
     * @param {Object} options - Browser launch options
     */
    async loginWithCredentials(username, password, options = {}) {
        const defaultOptions = {
            headless: false, // Set to false to see the browser for manual intervention
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        };

        const browserOptions = { ...defaultOptions, ...options };
        
        try {
            console.log('🚀 Initializing browser for credential login...');
            this.browser = await puppeteer.launch(browserOptions);
            this.page = await this.browser.newPage();
            
            await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
            await this.page.setViewport({ width: 1366, height: 768 });

            console.log('🔐 Navigating to Instagram login page...');
            await this.page.goto('https://www.instagram.com/accounts/login/', {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Wait for login form
            await this.page.waitForSelector('input[name="username"]', { timeout: 10000 });
            await this.page.waitForSelector('input[name="password"]', { timeout: 10000 });

            console.log('📝 Filling login credentials...');
            await this.page.type('input[name="username"]', username);
            await this.page.type('input[name="password"]', password);

            console.log('🔑 Submitting login form...');
            await this.page.click('button[type="submit"]');

            // Wait for navigation after login
            await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 });

            // Check if login was successful
            const currentUrl = this.page.url();
            if (currentUrl.includes('/accounts/login/') || currentUrl.includes('/challenge/')) {
                console.log('⚠️  Login may require additional verification (2FA, captcha, etc.)');
                console.log('Please complete verification manually in the browser window...');
                
                // Wait for user to complete verification
                await new Promise(resolve => {
                    const checkInterval = setInterval(async () => {
                        const url = await this.page.url();
                        if (!url.includes('/accounts/login/') && !url.includes('/challenge/')) {
                            clearInterval(checkInterval);
                            resolve();
                        }
                    }, 2000);
                });
            }

            console.log('✅ Successfully logged in with credentials!');
            this.isLoggedIn = true;
            return true;

        } catch (error) {
            console.error('❌ Credential login failed:', error.message);
            await this.close();
            throw error;
        }
    }
}

module.exports = InstagramAuth;

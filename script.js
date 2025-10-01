// Global variables
let currentTab = 'profile';
const API_BASE_URL = 'http://localhost:3000/api';

// DOM elements
const elements = {
    // Hero section elements (primary UI)
    heroUsername: document.getElementById('heroUsername'),
    heroSessionId: document.getElementById('heroSessionId'),
    heroMaxItems: document.getElementById('heroMaxItems'),
    heroScrapeBtn: document.getElementById('heroScrapeBtn'),
    heroLoadBtn: document.getElementById('heroLoadBtn'),
    heroScrapeAllBtn: document.getElementById('heroScrapeAllBtn'),
    
    // Legacy form elements (hidden but functional)
    username: document.getElementById('username'),
    sessionId: document.getElementById('sessionId'),
    maxItems: document.getElementById('maxItems'),
    scrapeBtn: document.getElementById('scrapeBtn'),
    loadBtn: document.getElementById('loadBtn'),
    scrapeAllBtn: document.getElementById('scrapeAllBtn'),
    
    // Status and result elements
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    success: document.getElementById('success'),
    maxItemsGroup: document.getElementById('maxItemsGroup'),
    profileCard: document.getElementById('profileCard'),
    postsGrid: document.getElementById('postsGrid'),
    reelsGrid: document.getElementById('reelsGrid')
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTabs();
    initializeButtons();
    
    // Auto-fill session ID (hardcoded) for both forms
    const hardcodedSessionId = '77230796546%3AwieAbSVxQ9BjoP%3A21%3AAYhoUfVg1BlYp7_CcoJTGx4FvrpcJoxq8VgSjnK9gQ';
    
    if (elements.sessionId) {
        elements.sessionId.value = hardcodedSessionId;
    }
    if (elements.heroSessionId) {
        elements.heroSessionId.value = hardcodedSessionId;
    }
    
    // Hide the session ID input groups
    const sessionIdGroup = elements.sessionId?.closest('.input-group');
    if (sessionIdGroup) {
        sessionIdGroup.style.display = 'none';
    }
    
    const heroSessionGroup = document.getElementById('heroSessionGroup');
    if (heroSessionGroup) {
        heroSessionGroup.style.display = 'none';
    }
});

// Navigation functionality
function initializeNavigation() {
    // Smooth scroll to sections
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = ['hero', 'dashboard'];
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
}

// Tab functionality
function initializeTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
}

function switchTab(tabName) {
    currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-content`).classList.add('active');

    // Show/hide max items for posts and reels
    if (elements.maxItemsGroup) {
        elements.maxItemsGroup.style.display = (tabName !== 'profile' && tabName !== 'analytics') ? 'block' : 'none';
    }

    // Update button text and visibility
    if (elements.scrapeBtn && elements.loadBtn) {
        if (tabName === 'analytics') {
            elements.scrapeBtn.style.display = 'none';
            elements.loadBtn.textContent = '📊 Load Analytics';
        } else {
            elements.scrapeBtn.style.display = 'inline-block';
            const action = tabName.charAt(0).toUpperCase() + tabName.slice(1);
            elements.scrapeBtn.textContent = `🔍 Scrape ${action}`;
            elements.loadBtn.textContent = `📂 Load ${action}`;
        }
    }

    // Auto-load data when switching tabs
    autoLoadDataForTab(tabName);
}

// Auto-load data for the current tab
async function autoLoadDataForTab(tabName) {
    // Get username from either hero form or legacy form
    const username = (elements.heroUsername?.value || elements.username?.value || '').trim();
    
    if (!username) {
        // Don't auto-load if no username is provided
        return;
    }
    
    // Add a small delay to prevent rapid tab switching from overwhelming the server
    setTimeout(async () => {
        // Check if user is still on the same tab after delay
        if (currentTab !== tabName) {
            return; // User switched tabs, don't load
        }
        
        try {
            showLoading();
            
            switch (tabName) {
                case 'profile':
                    await loadProfileData(username, true);
                    break;
                case 'posts':
                    await loadPostsData(username, true);
                    break;
                case 'reels':
                    await loadReelsData(username, true);
                    break;
                case 'analytics':
                    await loadAnalyticsData(username, true);
                    break;
            }
            
            hideLoading();
        } catch (error) {
            console.error(`Error auto-loading ${tabName} data:`, error);
            hideLoading();
            // Don't show error message for auto-loading to avoid spam
        }
    }, 300); // 300ms delay
}

// Individual load functions for each tab
async function loadProfileData(username, isAutoLoad = false) {
    const url = `${API_BASE_URL}/scrape/profile/${username}`;
    console.log('Loading profile from URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
        if (!isAutoLoad) {
            showSuccess('Profile loaded from database!');
        }
        displayData(data.data || data);
    } else {
        if (!isAutoLoad) {
            showError(data.message || 'No profile data found in database');
        }
    }
}

async function loadPostsData(username, isAutoLoad = false) {
    const maxItems = parseInt(elements.heroMaxItems?.value || elements.maxItems?.value || 20);
    const url = `${API_BASE_URL}/scrape/posts/${username}?limit=${maxItems}`;
    console.log('Loading posts from URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
        if (!isAutoLoad) {
            showSuccess('Posts loaded from database!');
        }
        displayData(data.data || data);
    } else {
        if (!isAutoLoad) {
            showError(data.message || 'No posts data found in database');
        }
    }
}

async function loadReelsData(username, isAutoLoad = false) {
    const maxItems = parseInt(elements.heroMaxItems?.value || elements.maxItems?.value || 20);
    const url = `${API_BASE_URL}/scrape/reels/${username}?limit=${maxItems}`;
    console.log('Loading reels from URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
        if (!isAutoLoad) {
            showSuccess('Reels loaded from database!');
        }
        displayData(data.data || data);
    } else {
        if (!isAutoLoad) {
            showError(data.message || 'No reels data found in database');
        }
    }
}

async function loadAnalyticsData(username, isAutoLoad = false) {
    const url = `${API_BASE_URL}/scrape/analytics/${username}`;
    console.log('Loading analytics from URL:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
        if (!isAutoLoad) {
            showSuccess('Analytics loaded from database!');
        }
        displayData(data.data || data);
        
        // Load vibe analysis as well
        loadVibeAnalysis(username);
    } else {
        if (!isAutoLoad) {
            showError(data.message || 'No analytics data found in database');
        }
    }
}

// Vibe Analysis Functions
async function loadVibeAnalysis(username) {
    try {
        const vibeContainer = document.getElementById('vibeAnalysis');
        if (!vibeContainer) return;
        
        // Show loading state
        vibeContainer.innerHTML = `
            <div class="vibe-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Analyzing content vibes...</span>
            </div>
        `;
        
        const response = await fetch(`${API_BASE_URL}/vibe/combined/${username}`);
        const data = await response.json();
        
        if (response.ok) {
            displayVibeAnalysis(data.data);
        } else {
            vibeContainer.innerHTML = `
                <div class="vibe-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Unable to analyze vibes: ${data.message}</span>
                </div>
            `;
        }
    } catch (error) {
        console.error('Vibe analysis error:', error);
        const vibeContainer = document.getElementById('vibeAnalysis');
        if (vibeContainer) {
            vibeContainer.innerHTML = `
                <div class="vibe-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <span>Failed to load vibe analysis</span>
                </div>
            `;
        }
    }
}

function displayVibeAnalysis(vibeData) {
    const vibeContainer = document.getElementById('vibeAnalysis');
    if (!vibeContainer) return;
    
    const overall = vibeData.overall;
    const posts = vibeData.posts;
    const reels = vibeData.reels;
    const summary = vibeData.summary;
    
    // Get dominant vibe info
    const getDominantVibeInfo = (vibeName) => {
        const vibeInfo = {
            positive: { color: '#10B981', icon: '😊', desc: 'Happy & Uplifting' },
            motivational: { color: '#F59E0B', icon: '💪', desc: 'Inspiring & Empowering' },
            emotional: { color: '#6366F1', icon: '💔', desc: 'Deep & Heartfelt' },
            energetic: { color: '#EF4444', icon: '🔥', desc: 'High Energy & Fun' },
            calm: { color: '#10B981', icon: '🧘', desc: 'Peaceful & Zen' },
            professional: { color: '#6B7280', icon: '💼', desc: 'Business Focused' },
            travel: { color: '#06B6D4', icon: '✈️', desc: 'Adventure & Exploration' },
            food: { color: '#F97316', icon: '🍕', desc: 'Food & Culinary' },
            neutral: { color: '#6B7280', icon: '😐', desc: 'Balanced Content' }
        };
        return vibeInfo[vibeName] || vibeInfo.neutral;
    };
    
    const dominantVibe = getDominantVibeInfo(summary.dominantVibe);
    
    vibeContainer.innerHTML = `
        <div class="vibe-analysis-container">
            <!-- Overall Vibe Summary -->
            <div class="vibe-summary-card">
                <div class="vibe-summary-header">
                    <div class="vibe-icon" style="background: ${dominantVibe.color}20; color: ${dominantVibe.color}">
                        ${dominantVibe.icon}
                    </div>
                    <div class="vibe-summary-info">
                        <h4>Overall Content Vibe</h4>
                        <p class="vibe-name" style="color: ${dominantVibe.color}">
                            ${summary.dominantVibe.charAt(0).toUpperCase() + summary.dominantVibe.slice(1)}
                        </p>
                        <span class="vibe-description">${dominantVibe.desc}</span>
                    </div>
                    <div class="vibe-stats">
                        <div class="vibe-stat">
                            <span class="stat-number">${summary.totalContent}</span>
                            <span class="stat-label">Content Pieces</span>
                        </div>
                        <div class="vibe-stat">
                            <span class="stat-number">${overall.postsWithVibe}</span>
                            <span class="stat-label">With Detected Vibe</span>
                        </div>
                    </div>
                </div>
                
                <!-- Vibe Distribution -->
                <div class="vibe-distribution">
                    <h5>Vibe Distribution</h5>
                    <div class="vibe-bars">
                        ${Object.entries(overall.vibeDistribution).map(([vibe, count]) => {
                            const vibeInfo = getDominantVibeInfo(vibe);
                            const percentage = (count / overall.postsWithVibe) * 100;
                            return `
                                <div class="vibe-bar-item">
                                    <div class="vibe-bar-header">
                                        <span class="vibe-bar-name">
                                            ${vibeInfo.icon} ${vibe.charAt(0).toUpperCase() + vibe.slice(1)}
                                        </span>
                                        <span class="vibe-bar-count">${count}</span>
                                    </div>
                                    <div class="vibe-bar">
                                        <div class="vibe-bar-fill" style="width: ${percentage}%; background: ${vibeInfo.color}"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Content Type Comparison -->
            <div class="vibe-comparison-grid">
                ${posts && posts.totalPosts > 0 ? `
                <div class="vibe-content-card">
                    <div class="content-type-header">
                        <i class="fas fa-images"></i>
                        <span>Posts Vibes</span>
                    </div>
                    <div class="content-vibe-summary">
                        <div class="content-dominant-vibe" style="color: ${getDominantVibeInfo(posts.overallVibe).color}">
                            ${getDominantVibeInfo(posts.overallVibe).icon} ${posts.overallVibe.charAt(0).toUpperCase() + posts.overallVibe.slice(1)}
                        </div>
                        <div class="content-stats">
                            <span>${posts.totalPosts} posts analyzed</span>
                            <span>${posts.postsWithVibe} with detected vibes</span>
                        </div>
                    </div>
                    <div class="mini-vibe-chart">
                        ${Object.entries(posts.vibeDistribution).slice(0, 3).map(([vibe, count]) => `
                            <div class="mini-vibe-item" style="background: ${getDominantVibeInfo(vibe).color}20; color: ${getDominantVibeInfo(vibe).color}">
                                ${getDominantVibeInfo(vibe).icon} ${count}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${reels && reels.totalPosts > 0 ? `
                <div class="vibe-content-card">
                    <div class="content-type-header">
                        <i class="fas fa-video"></i>
                        <span>Reels Vibes</span>
                    </div>
                    <div class="content-vibe-summary">
                        <div class="content-dominant-vibe" style="color: ${getDominantVibeInfo(reels.overallVibe).color}">
                            ${getDominantVibeInfo(reels.overallVibe).icon} ${reels.overallVibe.charAt(0).toUpperCase() + reels.overallVibe.slice(1)}
                        </div>
                        <div class="content-stats">
                            <span>${reels.totalPosts} reels analyzed</span>
                            <span>${reels.postsWithVibe} with detected vibes</span>
                        </div>
                    </div>
                    <div class="mini-vibe-chart">
                        ${Object.entries(reels.vibeDistribution).slice(0, 3).map(([vibe, count]) => `
                            <div class="mini-vibe-item" style="background: ${getDominantVibeInfo(vibe).color}20; color: ${getDominantVibeInfo(vibe).color}">
                                ${getDominantVibeInfo(vibe).icon} ${count}
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
            
            <!-- Vibe Insights -->
            <div class="vibe-insights-card">
                <h5><i class="fas fa-lightbulb"></i> Vibe Insights</h5>
                <div class="vibe-insights-list">
                    ${getVibeInsights(vibeData).map(insight => `
                        <div class="vibe-insight-item ${insight.type}">
                            <i class="fas fa-${insight.icon}"></i>
                            <div class="insight-content">
                                <strong>${insight.title}</strong>
                                <p>${insight.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function getVibeInsights(vibeData) {
    const insights = [];
    const overall = vibeData.overall;
    const posts = vibeData.posts;
    const reels = vibeData.reels;
    const summary = vibeData.summary;
    
    // Dominant vibe insight
    if (summary.dominantVibe !== 'neutral') {
        insights.push({
            type: 'positive',
            icon: 'chart-pie',
            title: 'Consistent Brand Voice',
            description: `Your content primarily reflects a ${summary.dominantVibe} vibe, showing consistent brand personality.`
        });
    }
    
    // Content mix insight
    if (posts && reels && posts.totalPosts > 0 && reels.totalPosts > 0) {
        const postsVibe = posts.overallVibe;
        const reelsVibe = reels.overallVibe;
        
        if (postsVibe === reelsVibe) {
            insights.push({
                type: 'neutral',
                icon: 'balance-scale',
                title: 'Consistent Cross-Format Vibes',
                description: 'Your posts and reels maintain the same vibe, showing strong brand consistency.'
            });
        } else {
            insights.push({
                type: 'warning',
                icon: 'exchange-alt',
                title: 'Different Vibes Across Formats',
                description: `Your posts lean ${postsVibe} while reels are more ${reelsVibe}. Consider aligning for better brand consistency.`
            });
        }
    }
    
    // Engagement vs vibe correlation
    const dominantVibeInfo = {
        'positive': 'Positive content typically drives high engagement',
        'motivational': 'Motivational content inspires action and sharing',
        'energetic': 'High-energy content often goes viral',
        'emotional': 'Emotional content creates deeper connections'
    };
    
    if (dominantVibeInfo[summary.dominantVibe]) {
        insights.push({
            type: 'positive',
            icon: 'rocket',
            title: 'Vibe-Engagement Alignment',
            description: dominantVibeInfo[summary.dominantVibe]
        });
    }
    
    // Content volume insight
    if (overall.postsWithVibe / overall.totalPosts < 0.3) {
        insights.push({
            type: 'warning',
            icon: 'exclamation-triangle',
            title: 'Low Vibe Detection',
            description: 'Consider adding more expressive captions and emojis to better convey your content personality.'
        });
    }
    
    return insights;
}

// Button functionality
function initializeButtons() {
    // Legacy form buttons
    if (elements.scrapeBtn) {
        elements.scrapeBtn.addEventListener('click', handleScrape);
    }
    if (elements.loadBtn) {
        elements.loadBtn.addEventListener('click', handleLoad);
    }
    if (elements.scrapeAllBtn) {
        elements.scrapeAllBtn.addEventListener('click', handleScrapeAll);
    }
    
    // Hero section buttons
    if (elements.heroScrapeBtn) {
        elements.heroScrapeBtn.addEventListener('click', () => {
            syncFormsFromHero();
            handleScrape();
        });
    }
    if (elements.heroLoadBtn) {
        elements.heroLoadBtn.addEventListener('click', () => {
            syncFormsFromHero();
            handleLoad();
        });
    }
    if (elements.heroScrapeAllBtn) {
        elements.heroScrapeAllBtn.addEventListener('click', () => {
            syncFormsFromHero();
            handleScrapeAll();
        });
    }
    
    // Get Started button functionality
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            document.getElementById('dashboard').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // Sync inputs between forms
    if (elements.heroUsername && elements.username) {
        elements.heroUsername.addEventListener('input', () => syncInputs('username'));
        elements.username.addEventListener('input', () => syncInputs('username'));
    }
    if (elements.heroMaxItems && elements.maxItems) {
        elements.heroMaxItems.addEventListener('input', () => syncInputs('maxItems'));
        elements.maxItems.addEventListener('input', () => syncInputs('maxItems'));
    }
}

// Synchronize form inputs
function syncInputs(field) {
    if (field === 'username') {
        if (elements.heroUsername && elements.username) {
            if (document.activeElement === elements.heroUsername) {
                elements.username.value = elements.heroUsername.value;
            } else if (document.activeElement === elements.username) {
                elements.heroUsername.value = elements.username.value;
            }
        }
    } else if (field === 'maxItems') {
        if (elements.heroMaxItems && elements.maxItems) {
            if (document.activeElement === elements.heroMaxItems) {
                elements.maxItems.value = elements.heroMaxItems.value;
            } else if (document.activeElement === elements.maxItems) {
                elements.heroMaxItems.value = elements.maxItems.value;
            }
        }
    }
}

// Sync hero form values to legacy form before API calls
function syncFormsFromHero() {
    if (elements.heroUsername && elements.username) {
        elements.username.value = elements.heroUsername.value;
    }
    if (elements.heroMaxItems && elements.maxItems) {
        elements.maxItems.value = elements.heroMaxItems.value;
    }
}

// API functions
async function handleScrape() {
    const username = elements.username.value.trim();
    const sessionId = elements.sessionId.value.trim();

    if (!username) {
        showError('Please enter a username');
        return;
    }

    if (!sessionId) {
        showError('Please enter your Instagram session ID');
        return;
    }

    const requestData = { username, sessionId };
    
    if (currentTab !== 'profile') {
        requestData[currentTab === 'posts' ? 'maxPosts' : 'maxReels'] = parseInt(elements.maxItems.value) || 20;
    }

    showLoading();
    
    try {
        const response = await fetch(`${API_BASE_URL}/scrape/${currentTab}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess(`${currentTab} scraped successfully!`);
            displayData(data.data || data);
        } else {
            showError(data.message || 'Failed to scrape data');
        }
    } catch (error) {
        showError('Network error. Please check if the server is running.');
    } finally {
        hideLoading();
    }
}

async function handleLoad() {
    // Get username from either form
    const username = (elements.username?.value || elements.heroUsername?.value || '').trim();

    if (!username) {
        showError('Please enter a username');
        return;
    }

    showLoading();
    
    try {
        // Use the new individual load functions for consistency
        switch (currentTab) {
            case 'profile':
                await loadProfileData(username);
                break;
            case 'posts':
                await loadPostsData(username);
                break;
            case 'reels':
                await loadReelsData(username);
                break;
            case 'analytics':
                await loadAnalyticsData(username);
                break;
            default:
                showError('Invalid tab selected');
        }
    } catch (error) {
        console.error('Load error:', error);
        showError('Network error. Please check if the server is running.');
    } finally {
        hideLoading();
    }
}

// Scrape All functionality
async function handleScrapeAll() {
    const username = elements.username.value.trim();
    const sessionId = elements.sessionId.value.trim();

    if (!username) {
        showError('Please enter a username');
        return;
    }

    if (!sessionId) {
        showError('Please enter your Instagram session ID');
        return;
    }

    const maxItems = parseInt(elements.maxItems.value) || 20;
    let completedCount = 0;
    const totalOperations = 3;
    
    showLoading();
    showSuccess('Starting to scrape all data...');
    
    // Disable all buttons during scraping
    elements.scrapeBtn.disabled = true;
    elements.loadBtn.disabled = true;
    elements.scrapeAllBtn.disabled = true;

    try {
        // 1. Scrape Profile
        try {
            showSuccess(`[1/3] Scraping profile for @${username}...`);
            const profileResponse = await fetch(`${API_BASE_URL}/scrape/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, sessionId })
            });
            
            if (profileResponse.ok) {
                completedCount++;
                showSuccess(`[1/3] ✅ Profile scraped successfully!`);
            } else {
                const errorData = await profileResponse.json();
                console.warn('Profile scraping failed:', errorData.message);
                showError(`Profile scraping failed: ${errorData.message}`);
            }
        } catch (error) {
            console.warn('Profile scraping error:', error);
            showError('Profile scraping failed due to network error');
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 2. Scrape Posts
        try {
            showSuccess(`[2/3] Scraping posts for @${username}...`);
            const postsResponse = await fetch(`${API_BASE_URL}/scrape/posts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, sessionId, maxPosts: maxItems })
            });
            
            if (postsResponse.ok) {
                completedCount++;
                showSuccess(`[2/3] ✅ Posts scraped successfully!`);
            } else {
                const errorData = await postsResponse.json();
                console.warn('Posts scraping failed:', errorData.message);
                showError(`Posts scraping failed: ${errorData.message}`);
            }
        } catch (error) {
            console.warn('Posts scraping error:', error);
            showError('Posts scraping failed due to network error');
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Scrape Reels
        try {
            showSuccess(`[3/3] Scraping reels for @${username}...`);
            const reelsResponse = await fetch(`${API_BASE_URL}/scrape/reels`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, sessionId, maxReels: maxItems })
            });
            
            if (reelsResponse.ok) {
                completedCount++;
                showSuccess(`[3/3] ✅ Reels scraped successfully!`);
            } else {
                const errorData = await reelsResponse.json();
                console.warn('Reels scraping failed:', errorData.message);
                showError(`Reels scraping failed: ${errorData.message}`);
            }
        } catch (error) {
            console.warn('Reels scraping error:', error);
            showError('Reels scraping failed due to network error');
        }

        // Final status message
        if (completedCount === totalOperations) {
            showSuccess(`🎉 All data scraped successfully! (${completedCount}/${totalOperations} operations completed)`);
        } else if (completedCount > 0) {
            showSuccess(`⚠️ Partial success: ${completedCount}/${totalOperations} operations completed`);
        } else {
            showError('❌ All scraping operations failed. Please check your session ID and try again.');
        }

    } catch (error) {
        console.error('Scrape all error:', error);
        showError('An unexpected error occurred during bulk scraping.');
    } finally {
        hideLoading();
        // Re-enable buttons
        elements.scrapeBtn.disabled = false;
        elements.loadBtn.disabled = false;
        elements.scrapeAllBtn.disabled = false;
    }
}

// Display functions
function displayData(data) {
    clearResults();
    
    console.log('Displaying data:', data); // Debug log

    switch (currentTab) {
        case 'profile':
            displayProfile(data);
            break;
        case 'posts':
            displayPosts(data.posts || data || []);
            break;
        case 'reels':
            displayReels(data.reels || data || []);
            break;
        case 'analytics':
            displayAnalytics(data);
            break;
    }
}

function displayProfile(data) {
    const profileImg = document.getElementById('profileAvatar');
    
    // Create fallback for profile picture
    if (data.profilePicture) {
        profileImg.src = getProxyImageUrl(data.profilePicture);
        profileImg.onerror = function() {
            this.style.display = 'none';
            // Create a styled placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = `
                width: 100px; 
                height: 100px; 
                border-radius: 50%; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                font-size: 2rem; 
                font-weight: bold;
                margin: 0 auto 15px;
                border: 3px solid #007bff;
            `;
            placeholder.textContent = (data.username || 'U').charAt(0).toUpperCase();
            this.parentNode.insertBefore(placeholder, this);
        };
    } else {
        // No profile picture available
        profileImg.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100px; 
            height: 100px; 
            border-radius: 50%; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            color: white; 
            font-size: 2rem; 
            font-weight: bold;
            margin: 0 auto 15px;
            border: 3px solid #007bff;
        `;
        placeholder.textContent = (data.username || 'U').charAt(0).toUpperCase();
        profileImg.parentNode.insertBefore(placeholder, profileImg);
    }
    
    document.getElementById('profileName').textContent = data.displayName || data.username || 'Unknown';
    document.getElementById('profileUsername').textContent = `@${data.username || 'unknown'}`;
    document.getElementById('profileBio').textContent = data.bio || 'No bio available';
    document.getElementById('followersCount').textContent = formatNumber(data.followersCount);
    document.getElementById('followingCount').textContent = formatNumber(data.followingCount);
    document.getElementById('postsCount').textContent = formatNumber(data.postsCount);
    
    elements.profileCard.style.display = 'block';
}

function displayPosts(posts) {
    if (!posts.length) {
        elements.postsGrid.innerHTML = '<p>No posts found</p>';
        return;
    }

    elements.postsGrid.innerHTML = posts.map((post, index) => `
        <div class="post-card">
            ${post.postThumbnail ? 
                `<img src="${getProxyImageUrl(post.postThumbnail)}" 
                     alt="Post ${post.postNumber || index + 1}" 
                     class="post-image" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     onload="this.nextElementSibling.style.display='none';">
                 <div class="post-image-placeholder" style="width: 100%; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: none; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                     📷 Post ${post.postNumber || index + 1}
                 </div>` 
                : 
                `<div class="post-image-placeholder" style="width: 100%; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                     📷 Post ${post.postNumber || index + 1}
                 </div>`
            }
            <div class="post-content">
                <div class="post-description">${escapeHtml(post.postDescription || 'No description')}</div>
                <div class="post-stats">
                    <span>❤️ ${post.postLikes || 'N/A'}</span>
                    <span>💬 ${post.postComments || 'N/A'}</span>
                </div>
                <div class="post-link">
                    <a href="${post.postUrl || '#'}" target="_blank" rel="noopener" style="color: #007bff; text-decoration: none; font-size: 0.9rem;">🔗 View on Instagram</a>
                </div>
            </div>
        </div>
    `).join('');
}

function displayReels(reels) {
    if (!reels.length) {
        elements.reelsGrid.innerHTML = '<p>No reels found</p>';
        return;
    }

    elements.reelsGrid.innerHTML = reels.map((reel, index) => `
        <div class="post-card">
            ${reel.reelThumbnail ? 
                `<img src="${getProxyImageUrl(reel.reelThumbnail)}" 
                     alt="Reel ${reel.reelNumber || index + 1}" 
                     class="post-image" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                     onload="this.nextElementSibling.style.display='none';">
                 <div class="post-image-placeholder" style="width: 100%; height: 200px; background: linear-gradient(135deg, #e09 0%, #d0e 100%); display: none; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                     🎬 Reel ${reel.reelNumber || index + 1}
                 </div>` 
                : 
                `<div class="post-image-placeholder" style="width: 100%; height: 200px; background: linear-gradient(135deg, #e09 0%, #d0e 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                     🎬 Reel ${reel.reelNumber || index + 1}
                 </div>`
            }
            <div class="post-content">
                <div class="post-description">${escapeHtml(reel.reelCaption || 'No caption available')}</div>
                <div class="post-stats">
                    <span>❤️ ${reel.reelLikes || 'N/A'}</span>
                    <span>💬 ${reel.reelComments || 'N/A'}</span>
                </div>
                <div class="post-link">
                    <a href="${reel.reelUrl || '#'}" target="_blank" rel="noopener" style="color: #007bff; text-decoration: none; font-size: 0.9rem;">🔗 View Reel</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Image proxy function
function getProxyImageUrl(originalUrl) {
    if (!originalUrl) return null;
    return `${API_BASE_URL}/proxy-image?url=${encodeURIComponent(originalUrl)}`;
}

// Utility functions
function showLoading() {
    if (elements.loading) {
        elements.loading.style.display = 'flex';
    }
    
    // Disable all buttons
    const buttonsToDisable = [
        elements.scrapeBtn, elements.loadBtn, elements.scrapeAllBtn,
        elements.heroScrapeBtn, elements.heroLoadBtn, elements.heroScrapeAllBtn
    ];
    
    buttonsToDisable.forEach(btn => {
        if (btn) btn.disabled = true;
    });
}

function hideLoading() {
    if (elements.loading) {
        elements.loading.style.display = 'none';
    }
    
    // Enable all buttons
    const buttonsToEnable = [
        elements.scrapeBtn, elements.loadBtn, elements.scrapeAllBtn,
        elements.heroScrapeBtn, elements.heroLoadBtn, elements.heroScrapeAllBtn
    ];
    
    buttonsToEnable.forEach(btn => {
        if (btn) btn.disabled = false;
    });
}

function showError(message) {
    hideMessages();
    elements.error.textContent = message;
    elements.error.style.display = 'block';
    setTimeout(hideMessages, 5000);
}

function showSuccess(message) {
    hideMessages();
    elements.success.textContent = message;
    elements.success.style.display = 'block';
    setTimeout(hideMessages, 3000);
}

function hideMessages() {
    elements.error.style.display = 'none';
    elements.success.style.display = 'none';
}

function clearResults() {
    elements.profileCard.style.display = 'none';
    elements.postsGrid.innerHTML = '';
    elements.reelsGrid.innerHTML = '';
    
    // Clear any existing profile picture placeholders
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
        const placeholders = profileInfo.querySelectorAll('div[style*="border-radius: 50%"]');
        placeholders.forEach(placeholder => placeholder.remove());
        
        // Reset profile avatar
        const profileImg = document.getElementById('profileAvatar');
        if (profileImg) {
            profileImg.style.display = 'block';
            profileImg.onerror = null;
        }
    }
}

function formatNumber(num) {
    if (!num) return '0';
    if (typeof num === 'string') return num;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

function displayAnalytics(data) {
    const analyticsCards = document.getElementById('analyticsCards');
    const performanceGrid = document.getElementById('performanceGrid');

    // Calculate advanced metrics
    const totalFollowers = data.profile?.followersCount || 0;
    const totalPosts = (data.posts?.totalPosts || 0) + (data.reels?.totalReels || 0);
    const overallEngagement = data.overall?.overallEngagementRate?.value || 0;
    const postsEngagement = data.posts?.engagementRate?.value || 0;
    const reelsEngagement = data.reels?.engagementRate?.value || 0;
    
    // Engagement quality assessment
    const getEngagementQuality = (rate) => {
        if (rate >= 5) return { label: 'Excellent', color: '#10B981', icon: '🔥' };
        if (rate >= 3) return { label: 'Good', color: '#F59E0B', icon: '👍' };
        if (rate >= 1) return { label: 'Average', color: '#EF4444', icon: '📊' };
        return { label: 'Low', color: '#6B7280', icon: '📉' };
    };
    
    const overallQuality = getEngagementQuality(overallEngagement);
    const postsQuality = getEngagementQuality(postsEngagement);
    const reelsQuality = getEngagementQuality(reelsEngagement);

    // Executive Summary KPIs
    analyticsCards.innerHTML = `
        <div class="analytics-hero-card">
            <div class="kpi-header">
                <h3><i class="fas fa-chart-line"></i> Executive Summary</h3>
                <span class="quality-badge" style="background: ${overallQuality.color}20; color: ${overallQuality.color}">
                    ${overallQuality.icon} ${overallQuality.label}
                </span>
            </div>
            <div class="kpi-grid">
                <div class="kpi-metric">
                    <span class="kpi-value">${data.overall?.overallEngagementRate?.formatted || '0%'}</span>
                    <span class="kpi-label">Overall Engagement Rate</span>
                    <div class="kpi-progress">
                        <div class="kpi-fill" style="width: ${Math.min(overallEngagement * 10, 100)}%; background: ${overallQuality.color}"></div>
                    </div>
                </div>
                <div class="kpi-metric">
                    <span class="kpi-value">${formatNumber(totalFollowers)}</span>
                    <span class="kpi-label">Total Followers</span>
                    <div class="kpi-trend ${totalFollowers > 100000 ? 'positive' : 'neutral'}">
                        <i class="fas fa-arrow-${totalFollowers > 100000 ? 'up' : 'right'}"></i>
                        ${totalFollowers > 1000000 ? 'Mega Influencer' : totalFollowers > 100000 ? 'Macro Influencer' : totalFollowers > 10000 ? 'Micro Influencer' : 'Nano Influencer'}
                    </div>
                </div>
                <div class="kpi-metric">
                    <span class="kpi-value">${data.overall?.totalEngagement?.formatted || '0'}</span>
                    <span class="kpi-label">Total Engagement</span>
                    <div class="engagement-breakdown-mini">
                        <div class="breakdown-item">
                            <span>${data.overall?.engagementBreakdown?.likes?.percentage || 0}%</span>
                            <span>Likes</span>
                        </div>
                        <div class="breakdown-item">
                            <span>${data.overall?.engagementBreakdown?.comments?.percentage || 0}%</span>
                            <span>Comments</span>
                        </div>
                    </div>
                </div>
                <div class="kpi-metric">
                    <span class="kpi-value">${totalPosts}</span>
                    <span class="kpi-label">Content Analyzed</span>
                    <div class="content-mix">
                        <div class="mix-item">
                            <span>${data.posts?.totalPosts || 0}</span> Posts
                        </div>
                        <div class="mix-item">
                            <span>${data.reels?.totalReels || 0}</span> Reels
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Professional Performance Analysis
    performanceGrid.innerHTML = `
        <div class="pro-analytics-grid">
            <!-- Content Performance Comparison -->
            <div class="analytics-chart-card">
                <div class="chart-header">
                    <h4><i class="fas fa-chart-bar"></i> Content Performance Analysis</h4>
                    <span class="chart-subtitle">Posts vs Reels Engagement Comparison</span>
                </div>
                <div class="comparison-chart">
                    <div class="comparison-item">
                        <div class="comparison-header">
                            <i class="fas fa-images"></i>
                            <span>Posts</span>
                            <span class="quality-indicator" style="color: ${postsQuality.color}">${postsQuality.icon}</span>
                        </div>
                        <div class="comparison-metrics">
                            <div class="metric-primary">${data.posts?.engagementRate?.formatted || '0%'}</div>
                            <div class="metric-secondary">Avg: ${data.posts?.averageLikes?.formatted || '0'} likes</div>
                            <div class="performance-bar">
                                <div class="performance-fill posts" style="width: ${Math.min(postsEngagement * 10, 100)}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="vs-divider">VS</div>
                    <div class="comparison-item">
                        <div class="comparison-header">
                            <i class="fas fa-video"></i>
                            <span>Reels</span>
                            <span class="quality-indicator" style="color: ${reelsQuality.color}">${reelsQuality.icon}</span>
                        </div>
                        <div class="comparison-metrics">
                            <div class="metric-primary">${data.reels?.engagementRate?.formatted || '0%'}</div>
                            <div class="metric-secondary">Avg: ${data.reels?.averageLikes?.formatted || '0'} likes</div>
                            <div class="performance-bar">
                                <div class="performance-fill reels" style="width: ${Math.min(reelsEngagement * 10, 100)}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="performance-insights">
                    <div class="insight-item ${reelsEngagement > postsEngagement ? 'winner' : 'neutral'}">
                        <i class="fas fa-lightbulb"></i>
                        <span>${reelsEngagement > postsEngagement ? 'Reels perform better than posts' : postsEngagement > reelsEngagement ? 'Posts perform better than reels' : 'Similar performance across content types'}</span>
                    </div>
                </div>
            </div>

            <!-- Audience Engagement Analysis -->
            <div class="analytics-detail-card">
                <div class="detail-header">
                    <h4><i class="fas fa-users"></i> Audience Engagement Insights</h4>
                </div>
                <div class="engagement-metrics">
                    <div class="engagement-circle">
                        <div class="circle-chart" data-percentage="${Math.min(overallEngagement * 10, 100)}">
                            <div class="circle-fill" style="--percentage: ${Math.min(overallEngagement * 10, 100)}"></div>
                            <div class="circle-content">
                                <span class="circle-value">${data.overall?.overallEngagementRate?.formatted || '0%'}</span>
                                <span class="circle-label">Engagement</span>
                            </div>
                        </div>
                    </div>
                    <div class="engagement-stats">
                        <div class="stat-row">
                            <span class="stat-icon">💜</span>
                            <span class="stat-label">Total Likes</span>
                            <span class="stat-value">${data.overall?.engagementBreakdown?.likes?.formatted || '0'}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-icon">💬</span>
                            <span class="stat-label">Total Comments</span>
                            <span class="stat-value">${data.overall?.engagementBreakdown?.comments?.formatted || '0'}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-icon">📊</span>
                            <span class="stat-label">Engagement per Follower</span>
                            <span class="stat-value">${totalFollowers > 0 ? ((data.overall?.totalEngagement?.value || 0) / totalFollowers * 100).toFixed(2) + '%' : '0%'}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-icon">🎯</span>
                            <span class="stat-label">Content Quality Score</span>
                            <span class="stat-value">${overallQuality.label}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Performance Benchmarks -->
            <div class="analytics-benchmark-card">
                <div class="benchmark-header">
                    <h4><i class="fas fa-trophy"></i> Industry Benchmarks</h4>
                    <span class="benchmark-subtitle">How you compare to industry standards</span>
                </div>
                <div class="benchmark-metrics">
                    <div class="benchmark-item">
                        <div class="benchmark-label">
                            <i class="fas fa-target"></i>
                            <span>Engagement Rate</span>
                        </div>
                        <div class="benchmark-comparison">
                            <div class="benchmark-bar">
                                <div class="benchmark-fill" style="width: ${Math.min(overallEngagement / 3 * 100, 100)}%"></div>
                                <div class="benchmark-marker" style="left: 33.33%"></div>
                            </div>
                            <div class="benchmark-labels">
                                <span>Poor (0-1%)</span>
                                <span>Good (1-3%)</span>
                                <span>Excellent (3%+)</span>
                            </div>
                        </div>
                    </div>
                    <div class="benchmark-item">
                        <div class="benchmark-label">
                            <i class="fas fa-chart-line"></i>
                            <span>Content Mix</span>
                        </div>
                        <div class="content-mix-analysis">
                            <div class="mix-recommendation">
                                ${(data.reels?.totalReels || 0) / totalPosts >= 0.3 ? 
                                    '<i class="fas fa-check-circle" style="color: #10B981"></i> Good reels-to-posts ratio' : 
                                    '<i class="fas fa-exclamation-circle" style="color: #F59E0B"></i> Consider more reels for better reach'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Data Quality & Recommendations -->
            <div class="analytics-insights-card">
                <div class="insights-header">
                    <h4><i class="fas fa-brain"></i> AI-Powered Insights</h4>
                </div>
                <div class="insights-list">
                    <div class="insight-item ${overallEngagement > 3 ? 'positive' : overallEngagement > 1 ? 'warning' : 'negative'}">
                        <i class="fas fa-${overallEngagement > 3 ? 'fire' : overallEngagement > 1 ? 'chart-line' : 'exclamation-triangle'}"></i>
                        <div class="insight-content">
                            <strong>${overallEngagement > 3 ? 'High Performance' : overallEngagement > 1 ? 'Moderate Performance' : 'Growth Opportunity'}</strong>
                            <p>${overallEngagement > 3 ? 'Your content consistently drives strong engagement' : overallEngagement > 1 ? 'Room for improvement in engagement strategies' : 'Focus on content quality and posting consistency'}</p>
                        </div>
                    </div>
                    <div class="insight-item ${reelsEngagement > postsEngagement ? 'positive' : 'neutral'}">
                        <i class="fas fa-video"></i>
                        <div class="insight-content">
                            <strong>Content Strategy</strong>
                            <p>${reelsEngagement > postsEngagement ? 'Reels are your strength - create more video content' : 'Balance your content mix between posts and reels'}</p>
                        </div>
                    </div>
                    <div class="insight-item ${data.posts?.dataQuality === 'Excellent' ? 'positive' : 'warning'}">
                        <i class="fas fa-database"></i>
                        <div class="insight-content">
                            <strong>Data Quality: ${data.posts?.dataQuality || 'Moderate'}</strong>
                            <p>Analysis based on ${data.posts?.postsWithEngagementData || 0} posts with complete engagement data</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
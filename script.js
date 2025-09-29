// Global variables
let currentTab = 'profile';
const API_BASE_URL = 'http://localhost:3000/api';

// DOM elements
const elements = {
    username: document.getElementById('username'),
    sessionId: document.getElementById('sessionId'),
    maxItems: document.getElementById('maxItems'),
    scrapeBtn: document.getElementById('scrapeBtn'),
    loadBtn: document.getElementById('loadBtn'),
    scrapeAllBtn: document.getElementById('scrapeAllBtn'),
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
    initializeTabs();
    initializeButtons();
    
    // Auto-fill session ID (hardcoded)
    const hardcodedSessionId = '55466061771%3AscBYubvUTY1oNC%3A4%3AAYjwp1HObXrl1llo7XXrHfTBCcsgyLMytEdNN_JfyQ';
    elements.sessionId.value = hardcodedSessionId;
    
    // Hide the session ID input group
    const sessionIdGroup = elements.sessionId.closest('.input-group');
    if (sessionIdGroup) {
        sessionIdGroup.style.display = 'none';
    }
});

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
    elements.maxItemsGroup.style.display = (tabName !== 'profile' && tabName !== 'analytics') ? 'block' : 'none';

    // Update button text and visibility
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

// Button functionality
function initializeButtons() {
    elements.scrapeBtn.addEventListener('click', handleScrape);
    elements.loadBtn.addEventListener('click', handleLoad);
    elements.scrapeAllBtn.addEventListener('click', handleScrapeAll);
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
    const username = elements.username.value.trim();

    if (!username) {
        showError('Please enter a username');
        return;
    }

    showLoading();
    
    try {
        let url;
        if (currentTab === 'analytics') {
            url = `${API_BASE_URL}/scrape/analytics/${username}`;
        } else {
            url = `${API_BASE_URL}/scrape/${currentTab}/${username}`;
            if (currentTab !== 'profile') {
                url += `?limit=${parseInt(elements.maxItems.value) || 50}`;
            }
        }

        console.log('Loading from URL:', url); // Debug log
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('API Response:', data); // Debug log

        if (response.ok) {
            showSuccess(`${currentTab} loaded from database!`);
            displayData(data.data || data);
        } else {
            showError(data.message || 'No data found in database');
        }
    } catch (error) {
        console.error('Load error:', error); // Debug log
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
    elements.loading.style.display = 'block';
    elements.scrapeBtn.disabled = true;
    elements.loadBtn.disabled = true;
    elements.scrapeAllBtn.disabled = true;
}

function hideLoading() {
    elements.loading.style.display = 'none';
    elements.scrapeBtn.disabled = false;
    elements.loadBtn.disabled = false;
    elements.scrapeAllBtn.disabled = false;
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

    // Main analytics cards
    analyticsCards.innerHTML = `
        <div class="analytics-card">
            <h4>Average Likes per Post</h4>
            <div class="value">${data.posts?.averageLikes?.formatted || '0'}</div>
            <div class="label">Posts analyzed: ${data.posts?.totalPosts || 0}</div>
        </div>
        <div class="analytics-card">
            <h4>Average Comments per Post</h4>
            <div class="value">${data.posts?.averageComments?.formatted || '0'}</div>
            <div class="label">With data: ${data.posts?.postsWithEngagementData || 0}</div>
        </div>
        <div class="analytics-card">
            <h4>Posts Engagement Rate</h4>
            <div class="value">${data.posts?.engagementRate?.formatted || '0%'}</div>
            <div class="label">Based on followers: ${formatNumber(data.profile?.followersCount)}</div>
        </div>
        <div class="analytics-card">
            <h4>Overall Engagement Rate</h4>
            <div class="value">${data.overall?.overallEngagementRate?.formatted || '0%'}</div>
            <div class="label">All content: ${data.overall?.totalContent || 0}</div>
        </div>
    `;

    // Performance breakdown
    performanceGrid.innerHTML = `
        <div class="performance-card">
            <h4>📷 Posts Performance</h4>
            <div class="metric-row">
                <span class="metric-label">Total Posts</span>
                <span class="metric-value">${data.posts?.totalPosts || 0}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Total Likes</span>
                <span class="metric-value">${data.posts?.totalLikes?.formatted || '0'}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Total Comments</span>
                <span class="metric-value">${data.posts?.totalComments?.formatted || '0'}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Data Quality</span>
                <span class="metric-value">${data.posts?.dataQuality || 'No data'}</span>
            </div>
            ${data.posts?.engagementRate?.value ? `
            <div class="engagement-bar">
                <div class="engagement-fill" style="width: ${Math.min(data.posts.engagementRate.value, 10) * 10}%"></div>
            </div>` : ''}
        </div>
        
        <div class="performance-card">
            <h4>🎬 Reels Performance</h4>
            <div class="metric-row">
                <span class="metric-label">Total Reels</span>
                <span class="metric-value">${data.reels?.totalReels || 0}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Average Likes</span>
                <span class="metric-value">${data.reels?.averageLikes?.formatted || '0'}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Average Comments</span>
                <span class="metric-value">${data.reels?.averageComments?.formatted || '0'}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Engagement Rate</span>
                <span class="metric-value">${data.reels?.engagementRate?.formatted || '0%'}</span>
            </div>
            ${data.reels?.engagementRate?.value ? `
            <div class="engagement-bar">
                <div class="engagement-fill" style="width: ${Math.min(data.reels.engagementRate.value, 10) * 10}%"></div>
            </div>` : ''}
        </div>

        <div class="performance-card">
            <h4>🎯 Engagement Breakdown</h4>
            <div class="metric-row">
                <span class="metric-label">Total Engagement</span>
                <span class="metric-value">${data.overall?.totalEngagement?.formatted || '0'}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Likes (${data.overall?.engagementBreakdown?.likes?.percentage || 0}%)</span>
                <span class="metric-value">${data.overall?.engagementBreakdown?.likes?.formatted || '0'}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Comments (${data.overall?.engagementBreakdown?.comments?.percentage || 0}%)</span>
                <span class="metric-value">${data.overall?.engagementBreakdown?.comments?.formatted || '0'}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Data Quality</span>
                <span class="metric-value">${data.summary?.dataQuality || 'No data'}</span>
            </div>
        </div>

        <div class="performance-card">
            <h4>📊 Summary</h4>
            <div class="metric-row">
                <span class="metric-label">Profile</span>
                <span class="metric-value">${data.profile?.username || 'N/A'}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Followers</span>
                <span class="metric-value">${formatNumber(data.profile?.followersCount) || '0'}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Content Analyzed</span>
                <span class="metric-value">${data.summary?.totalContentAnalyzed || 0}</span>
            </div>
            <div class="metric-row">
                <span class="metric-label">Last Updated</span>
                <span class="metric-value">${data.profile?.lastScraped ? new Date(data.profile.lastScraped).toLocaleDateString() : 'N/A'}</span>
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
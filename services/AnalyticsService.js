const { Profile, Post, Reel } = require('../models');

class AnalyticsService {
    static async getEngagementAnalytics(username) {
        try {
            console.log(`📊 Calculating analytics for @${username}`);
            
            // Get profile data
            const profile = await Profile.findOne({ username: username.toLowerCase() });
            if (!profile) {
                return {
                    success: false,
                    error: 'PROFILE_NOT_FOUND',
                    message: `Profile @${username} not found in database`
                };
            }

            // Get posts data
            const posts = await Post.find({ username: username.toLowerCase() }).sort({ scrapedAt: -1 });
            
            // Get reels data
            const reels = await Reel.find({ username: username.toLowerCase() }).sort({ scrapedAt: -1 });

            // Calculate posts analytics
            const postsAnalytics = this.calculatePostsAnalytics(posts, profile);
            
            // Calculate reels analytics
            const reelsAnalytics = this.calculateReelsAnalytics(reels, profile);
            
            // Calculate overall analytics
            const overallAnalytics = this.calculateOverallAnalytics(posts, reels, profile);

            return {
                success: true,
                data: {
                    profile: {
                        username: `@${username}`,
                        displayName: profile.displayName,
                        followersCount: profile.followersCount,
                        followingCount: profile.followingCount,
                        postsCount: profile.postsCount,
                        isVerified: profile.isVerified,
                        lastScraped: profile.lastScraped
                    },
                    posts: postsAnalytics,
                    reels: reelsAnalytics,
                    overall: overallAnalytics,
                    summary: {
                        totalContentAnalyzed: posts.length + reels.length,
                        postsAnalyzed: posts.length,
                        reelsAnalyzed: reels.length,
                        dataQuality: this.assessDataQuality(posts, reels)
                    }
                },
                message: `Analytics calculated for @${username}`
            };

        } catch (error) {
            console.error('❌ Analytics calculation error:', error);
            return {
                success: false,
                error: 'ANALYTICS_ERROR',
                message: 'Failed to calculate analytics'
            };
        }
    }

    static calculatePostsAnalytics(posts, profile) {
        if (!posts.length) {
            return {
                totalPosts: 0,
                averageLikes: 0,
                averageComments: 0,
                engagementRate: 0,
                message: 'No posts data available for analysis'
            };
        }

        // Filter posts with valid engagement data
        const postsWithLikes = posts.filter(post => post.postLikes && this.parseEngagementNumber(post.postLikes) > 0);
        const postsWithComments = posts.filter(post => post.postComments && this.parseEngagementNumber(post.postComments) > 0);

        // Calculate averages
        const totalLikes = postsWithLikes.reduce((sum, post) => sum + this.parseEngagementNumber(post.postLikes), 0);
        const totalComments = postsWithComments.reduce((sum, post) => sum + this.parseEngagementNumber(post.postComments), 0);

        const averageLikes = postsWithLikes.length > 0 ? Math.round(totalLikes / postsWithLikes.length) : 0;
        const averageComments = postsWithComments.length > 0 ? Math.round(totalComments / postsWithComments.length) : 0;

        // Calculate engagement rate (likes + comments) / followers * 100
        const totalEngagement = totalLikes + totalComments;
        const engagementRate = profile.followersCount > 0 && postsWithLikes.length > 0 
            ? ((totalEngagement / postsWithLikes.length) / profile.followersCount * 100).toFixed(2)
            : 0;

        return {
            totalPosts: posts.length,
            postsWithEngagementData: postsWithLikes.length,
            averageLikes: {
                value: averageLikes,
                formatted: this.formatNumber(averageLikes)
            },
            averageComments: {
                value: averageComments,
                formatted: this.formatNumber(averageComments)
            },
            engagementRate: {
                value: parseFloat(engagementRate),
                formatted: `${engagementRate}%`
            },
            totalLikes: {
                value: totalLikes,
                formatted: this.formatNumber(totalLikes)
            },
            totalComments: {
                value: totalComments,
                formatted: this.formatNumber(totalComments)
            },
            bestPerformingPost: this.getBestPost(postsWithLikes),
            dataQuality: `${Math.round((postsWithLikes.length / posts.length) * 100)}% of posts have engagement data`
        };
    }

    static calculateReelsAnalytics(reels, profile) {
        if (!reels.length) {
            return {
                totalReels: 0,
                averageLikes: 0,
                averageComments: 0,
                engagementRate: 0,
                message: 'No reels data available for analysis'
            };
        }

        // Filter reels with valid engagement data
        const reelsWithLikes = reels.filter(reel => reel.reelLikes && this.parseEngagementNumber(reel.reelLikes) > 0);
        const reelsWithComments = reels.filter(reel => reel.reelComments && this.parseEngagementNumber(reel.reelComments) > 0);

        // Calculate averages
        const totalLikes = reelsWithLikes.reduce((sum, reel) => sum + this.parseEngagementNumber(reel.reelLikes), 0);
        const totalComments = reelsWithComments.reduce((sum, reel) => sum + this.parseEngagementNumber(reel.reelComments), 0);

        const averageLikes = reelsWithLikes.length > 0 ? Math.round(totalLikes / reelsWithLikes.length) : 0;
        const averageComments = reelsWithComments.length > 0 ? Math.round(totalComments / reelsWithComments.length) : 0;

        // Calculate engagement rate
        const totalEngagement = totalLikes + totalComments;
        const engagementRate = profile.followersCount > 0 && reelsWithLikes.length > 0 
            ? ((totalEngagement / reelsWithLikes.length) / profile.followersCount * 100).toFixed(2)
            : 0;

        return {
            totalReels: reels.length,
            reelsWithEngagementData: reelsWithLikes.length,
            averageLikes: {
                value: averageLikes,
                formatted: this.formatNumber(averageLikes)
            },
            averageComments: {
                value: averageComments,
                formatted: this.formatNumber(averageComments)
            },
            engagementRate: {
                value: parseFloat(engagementRate),
                formatted: `${engagementRate}%`
            },
            totalLikes: {
                value: totalLikes,
                formatted: this.formatNumber(totalLikes)
            },
            totalComments: {
                value: totalComments,
                formatted: this.formatNumber(totalComments)
            },
            bestPerformingReel: this.getBestReel(reelsWithLikes),
            dataQuality: `${Math.round((reelsWithLikes.length / reels.length) * 100)}% of reels have engagement data`
        };
    }

    static calculateOverallAnalytics(posts, reels, profile) {
        const allContent = [...posts, ...reels];
        
        if (!allContent.length) {
            return {
                totalContent: 0,
                overallEngagementRate: 0,
                message: 'No content available for overall analytics'
            };
        }

        // Get all engagement data
        const allLikes = allContent
            .map(item => this.parseEngagementNumber(item.postLikes || item.reelLikes))
            .filter(likes => likes > 0);
            
        const allComments = allContent
            .map(item => this.parseEngagementNumber(item.postComments || item.reelComments))
            .filter(comments => comments > 0);

        const totalLikes = allLikes.reduce((sum, likes) => sum + likes, 0);
        const totalComments = allComments.reduce((sum, comments) => sum + comments, 0);
        const totalEngagement = totalLikes + totalComments;

        const averageEngagementPerPost = allLikes.length > 0 ? (totalEngagement / allLikes.length) : 0;
        const overallEngagementRate = profile.followersCount > 0 
            ? (averageEngagementPerPost / profile.followersCount * 100).toFixed(2)
            : 0;

        return {
            totalContent: allContent.length,
            contentWithEngagementData: allLikes.length,
            averageEngagementPerContent: {
                value: Math.round(averageEngagementPerPost),
                formatted: this.formatNumber(Math.round(averageEngagementPerPost))
            },
            overallEngagementRate: {
                value: parseFloat(overallEngagementRate),
                formatted: `${overallEngagementRate}%`
            },
            totalEngagement: {
                value: totalEngagement,
                formatted: this.formatNumber(totalEngagement)
            },
            engagementBreakdown: {
                likes: {
                    value: totalLikes,
                    formatted: this.formatNumber(totalLikes),
                    percentage: totalEngagement > 0 ? ((totalLikes / totalEngagement) * 100).toFixed(1) : 0
                },
                comments: {
                    value: totalComments,
                    formatted: this.formatNumber(totalComments),
                    percentage: totalEngagement > 0 ? ((totalComments / totalEngagement) * 100).toFixed(1) : 0
                }
            }
        };
    }

    static getBestPost(posts) {
        if (!posts.length) return null;
        
        return posts.reduce((best, current) => {
            const currentEngagement = this.parseEngagementNumber(current.postLikes) + this.parseEngagementNumber(current.postComments);
            const bestEngagement = this.parseEngagementNumber(best.postLikes) + this.parseEngagementNumber(best.postComments);
            
            return currentEngagement > bestEngagement ? current : best;
        });
    }

    static getBestReel(reels) {
        if (!reels.length) return null;
        
        return reels.reduce((best, current) => {
            const currentEngagement = this.parseEngagementNumber(current.reelLikes) + this.parseEngagementNumber(current.reelComments);
            const bestEngagement = this.parseEngagementNumber(best.reelLikes) + this.parseEngagementNumber(best.reelComments);
            
            return currentEngagement > bestEngagement ? current : best;
        });
    }

    static parseEngagementNumber(value) {
        if (!value || value === 'N/A' || value === 'Not available') return 0;
        
        const numStr = value.toString().toLowerCase();
        
        // Handle 'K' notation (e.g., "1.5K" = 1500)
        if (numStr.includes('k')) {
            return Math.round(parseFloat(numStr.replace('k', '')) * 1000);
        }
        
        // Handle 'M' notation (e.g., "2.1M" = 2100000)
        if (numStr.includes('m')) {
            return Math.round(parseFloat(numStr.replace('m', '')) * 1000000);
        }
        
        // Handle regular numbers
        const parsed = parseInt(numStr.replace(/,/g, ''));
        return isNaN(parsed) ? 0 : parsed;
    }

    static formatNumber(num) {
        if (!num || num === 0) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    static assessDataQuality(posts, reels) {
        const totalContent = posts.length + reels.length;
        if (totalContent === 0) return 'No data';

        const postsWithEngagement = posts.filter(p => 
            p.postLikes && this.parseEngagementNumber(p.postLikes) > 0
        ).length;
        
        const reelsWithEngagement = reels.filter(r => 
            r.reelLikes && this.parseEngagementNumber(r.reelLikes) > 0
        ).length;

        const qualityPercentage = Math.round(((postsWithEngagement + reelsWithEngagement) / totalContent) * 100);
        
        if (qualityPercentage >= 80) return 'Excellent';
        if (qualityPercentage >= 60) return 'Good';
        if (qualityPercentage >= 40) return 'Fair';
        return 'Limited';
    }
}

module.exports = AnalyticsService;
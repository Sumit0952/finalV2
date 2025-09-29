const mongoose = require('mongoose');

// Profile Schema
const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    displayName: {
        type: String,
        default: null
    },
    profilePicture: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    followersCount: {
        type: Number,
        default: null
    },
    followingCount: {
        type: Number,
        default: null
    },
    postsCount: {
        type: Number,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    lastScraped: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Post Schema
const postSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    postUrl: {
        type: String,
        required: true,
        unique: true
    },
    postThumbnail: {
        type: String,
        default: null
    },
    postDescription: {
        type: String,
        default: null
    },
    postLikes: {
        type: String, // Keep as string to handle "301K", "1.5M" format
        default: null
    },
    postComments: {
        type: String, // Keep as string to handle "301K", "1.5M" format
        default: null
    },
    postNumber: {
        type: Number,
        required: true
    },
    scrapedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Reel Schema
const reelSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    reelUrl: {
        type: String,
        required: true,
        unique: true
    },
    reelThumbnail: {
        type: String,
        default: null
    },
    reelCaption: {
        type: String,
        default: null
    },
    reelLikes: {
        type: String, // Keep as string to handle "301K", "1.5M" format
        default: null
    },
    reelComments: {
        type: String, // Keep as string to handle "301K", "1.5M" format
        default: null
    },
    reelNumber: {
        type: Number,
        required: true
    },
    scrapedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create compound indexes for better performance
postSchema.index({ username: 1, scrapedAt: -1 });
reelSchema.index({ username: 1, scrapedAt: -1 });

// Export models
const Profile = mongoose.model('Profile', profileSchema);
const Post = mongoose.model('Post', postSchema);
const Reel = mongoose.model('Reel', reelSchema);

module.exports = {
    Profile,
    Post,
    Reel
};
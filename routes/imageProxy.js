const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Image proxy endpoint
router.get('/proxy-image', async (req, res) => {
    try {
        const imageUrl = req.query.url;
        
        if (!imageUrl) {
            return res.status(400).json({ error: 'Image URL is required' });
        }

        // Validate that it's an Instagram image URL
        if (!imageUrl.includes('cdninstagram.com') && !imageUrl.includes('fbcdn.net')) {
            return res.status(400).json({ error: 'Only Instagram images are allowed' });
        }

        console.log('🖼️ Proxying image:', imageUrl);

        // Fetch the image with proper headers
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://www.instagram.com/',
                'Sec-Fetch-Dest': 'image',
                'Sec-Fetch-Mode': 'no-cors',
                'Sec-Fetch-Site': 'cross-site'
            }
        });

        if (!response.ok) {
            console.log('❌ Failed to fetch image:', response.status, response.statusText);
            return res.status(404).json({ error: 'Image not found' });
        }

        // Get the image buffer
        const imageBuffer = await response.buffer();
        
        // Set appropriate headers
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        res.set({
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        });

        // Send the image
        res.send(imageBuffer);

    } catch (error) {
        console.error('❌ Image proxy error:', error);
        res.status(500).json({ error: 'Failed to proxy image' });
    }
});

module.exports = router;
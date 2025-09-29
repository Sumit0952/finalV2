const fetch = require('node-fetch');

async function testAPI() {
    try {
        console.log('🧪 Testing API endpoints...\n');

        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await fetch('http://localhost:3000/api/health');
        const healthData = await healthResponse.json();
        console.log('Health:', healthData);

        // Test getting profile from database
        console.log('\n2. Testing GET profile endpoint...');
        const profileResponse = await fetch('http://localhost:3000/api/scrape/profile/pritamofficial');
        const profileData = await profileResponse.json();
        console.log('Profile Response Status:', profileResponse.status);
        console.log('Profile Data:', JSON.stringify(profileData, null, 2));

        // Test getting posts from database  
        console.log('\n3. Testing GET posts endpoint...');
        const postsResponse = await fetch('http://localhost:3000/api/scrape/posts/pritamofficial');
        const postsData = await postsResponse.json();
        console.log('Posts Response Status:', postsResponse.status);
        console.log('Posts Data:', JSON.stringify(postsData, null, 2));

        // Test getting reels from database
        console.log('\n4. Testing GET reels endpoint...');
        const reelsResponse = await fetch('http://localhost:3000/api/scrape/reels/pritamofficial');
        const reelsData = await reelsResponse.json();
        console.log('Reels Response Status:', reelsResponse.status);
        console.log('Reels Data:', JSON.stringify(reelsData, null, 2));

    } catch (error) {
        console.error('❌ API Test failed:', error.message);
    }
}

testAPI();
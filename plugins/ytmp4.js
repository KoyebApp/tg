const fetch = require('node-fetch');
const Qasim = require('api-qasim');

// Retry function to handle download with retries
const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        const response = await fetch(url, options);
        if (response.ok) return response;
        console.log(`Retrying... (${i + 1})`);
    }
    throw new Error('Failed to fetch media content after retries');
};

const handler = async (m, { query, bot }) => {
    // Check if a URL was provided
    if (!query) {
        await bot.sendMessage(m.chat.id, '❌ Please provide a YouTube URL.');
        return;
    }

    const url = query.trim(); // Trim any whitespace from the query
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

    // Validate the URL format
    if (!youtubeRegex.test(url)) {
        await bot.sendMessage(m.chat.id, '❌ Invalid YouTube URL. Please provide a valid URL.');
        return;
    }

    await bot.sendMessage(m.chat.id, '⏳ Fetching the video, please wait...');

    try {
        // Fetch video details with ytmp4
        const response = await Qasim.ytmp4(url);
        
        // Check if response is valid and contains 'video' field
        if (!response || !response.video) {
            console.error('Invalid response structure:', response); // Log invalid response for better debugging
            throw new Error('Invalid response from the downloader.');
        }

        const videoUrl = response.video; // Use the 'video' key for the URL
        if (!videoUrl) {
            throw new Error('Video URL not found.');
        }

        const title = response.title || 'video';
        const author = response.author || 'Unknown Author';
        const duration = response.duration || 'N/A';
        const views = response.views || '0';
        const uploadDate = response.upload || 'Unknown Date';
        const thumbnail = response.thumbnail || '';
        
        const caption = `*𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝙼𝙴𝙶𝙰-𝙰𝙸*\n\n` +
                        `*Title:* ${title}\n` +
                        `*Author:* ${author}\n` +
                        `*Duration:* ${duration}\n` +
                        `*Views:* ${views}\n` +
                        `*Uploaded on:* ${uploadDate}`;

        // Fetch the video file with retry
        const mediaResponse = await fetchWithRetry(videoUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            }
        });

        const contentType = mediaResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('video')) {
            throw new Error('Invalid content type received');
        }

        const arrayBuffer = await mediaResponse.arrayBuffer();
        const mediaBuffer = Buffer.from(arrayBuffer);
        if (mediaBuffer.length === 0) throw new Error('Downloaded file is empty');

        // Send the video file along with the caption
        await bot.sendDocument(m.chat.id, mediaBuffer, { caption }, { filename: `${title}.mp4`, mimetype: 'video/mp4' });

        await bot.sendMessage(m.chat.id, '✅ Video sent successfully!'); // Confirmation message after sending the video
    } catch (error) {
        console.error('Error fetching video:', error.message, error.stack);
        await bot.sendMessage(m.chat.id, '❌ An error occurred while fetching the video. Please try again later.');
    }
};

module.exports = handler;

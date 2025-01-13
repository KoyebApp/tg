const fetch = require('node-fetch');  // Ensure node-fetch is available to make the API request

const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
  const chatId = m.chat.id;

  // Ensure a URL is provided
  if (!query) {
    await bot.sendMessage(m.chat.id, 'Please provide the URL of the video. Example: .ytmp4 https://youtube.com/video-url');
    return;
  }

  const videoUrl = query.trim();

  // Construct the API request URL with the provided URL and your API key
  const apiUrl = `https://api.giftedtech.web.id/api/download/dlmp4?url=${encodeURIComponent(videoUrl)}&apikey=gifted-md`;

  try {
    // Make the API request
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Log the API response for debugging
    console.log('API Response:', data);  // Log the response to the console

    // Check if the API request was successful
    if (data.status === 'success' && data.result && data.result.download) {
      const downloadUrl = data.result.download;

      // Send the download link to the user
      await bot.sendMessage(m.chat.id, `🎬 Your video is ready! Download it from here: ${downloadUrl}`);
    } else {
      // If the API returns an error or doesn't contain the download URL
      await bot.sendMessage(m.chat.id, '❌ Failed to fetch the video. Please ensure the URL is correct and try again.');
    }
  } catch (e) {
    console.error('Error:', e);
    await bot.sendMessage(m.chat.id, '❌ An error occurred while processing your request. Please try again later.');
  }
};

// Export the handler
module.exports = handler;

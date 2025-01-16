const fetch = require('node-fetch');  // Ensure node-fetch is available to make the API request
const fs = require('fs');
const path = require('path');

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
    
    // Check if the API request was successful
    if (data.success && data.result && data.result.download_url) {
      const downloadUrl = data.result.download_url;
      const videoTitle = data.result.title;

      // Create a temporary file path to download the video
      const videoFilePath = path.join(__dirname, 'downloads', `${videoTitle}.mp4`);

      // Download the video file
      const videoResponse = await fetch(downloadUrl);
      const videoBuffer = await videoResponse.buffer();

      // Save the video to the local file system
      fs.mkdirSync(path.dirname(videoFilePath), { recursive: true });
      fs.writeFileSync(videoFilePath, videoBuffer);

      // Send the video file to the user
      await bot.sendDocument(m.chat.id, videoFilePath, { caption: `Here is your video: ${videoTitle}` });

      // Optionally, delete the video file after sending it to the user
      fs.unlinkSync(videoFilePath);  // Remove the file after sending it to the user
    } else {
      // If the API returns an error or doesn't contain the download URL
      await bot.sendMessage(m.chat.id, '❌ Failed to fetch the video. Please ensure the URL is correct and try again.');
    }
  } catch (e) {
    console.error('Error:', e);
    await bot.sendMessage(m.chat.id, '❌ An error occurred while processing your request. Please try again later.');
  }
};

handler.command = ['video', 'mp4'];  // Command list
handler.help = ['video', 'mp4'];
handler.tags = ['downloader'];

// Export the handler
module.exports = handler;

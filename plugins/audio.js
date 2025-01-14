const fetch = require('node-fetch');  // Ensure node-fetch is available to make the API request
const fs = require('fs');
const path = require('path');

const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
  const chatId = m.chat.id;

  // Ensure a URL is provided
  if (!query) {
    await bot.sendMessage(m.chat.id, 'Please provide the URL of the video.');
    return;
  }

  const videoUrl = query.trim();

  // Construct the API request URL with the provided URL and your API key
  const apiUrl = `https://api.giftedtech.web.id/api/download/dlmp3?apikey=gifted-md&url=${encodeURIComponent(videoUrl)}`;

  try {
    // Make the API request
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if the API request was successful
    if (data.success && data.result && data.result.download_url) {
      const downloadUrl = data.result.download_url;
      const audioTitle = data.result.title;

      // Create a temporary file path to download the audio
      const audioFilePath = path.join(__dirname, 'downloads', `${audioTitle}.mp3`);

      // Download the audio file
      const audioResponse = await fetch(downloadUrl);
      const audioBuffer = await audioResponse.buffer();

      // Save the audio to the local file system
      fs.mkdirSync(path.dirname(audioFilePath), { recursive: true });
      fs.writeFileSync(audioFilePath, audioBuffer);

      // Send the audio file to the user
      await bot.sendDocument(m.chat.id, audioFilePath, { caption: `𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝙼𝙴𝙶𝙰-𝙰𝙸: ${audioTitle}` });

      // Optionally, delete the audio file after sending it to the user
      fs.unlinkSync(audioFilePath);  // Remove the file after sending it to the user
    } else {
      // If the API returns an error or doesn't contain the download URL
      await bot.sendMessage(m.chat.id, '❌ Failed to fetch the audio. Please ensure the URL is correct and try again.');
    }
  } catch (e) {
    console.error('Error:', e);
    await bot.sendMessage(m.chat.id, '❌ An error occurred while processing your request. Please try again later.');
  }
};

// Export the handler
module.exports = handler;

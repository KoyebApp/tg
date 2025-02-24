const Qasim = require('api-qasim');

let handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
  // Ensure query (URL) is provided
  if (!query) {
    await bot.sendMessage(m.chat.id, '❌ You need to provide the URL of the Facebook video.');
    return;
  }

  // Send a message indicating the bot is processing the request
  await bot.sendMessage(m.chat.id, '⌛ Processing your request, please wait...');

  let res;
  try {
    // Use the query (URL) directly in the API call
    res = await Qasim.fbdl(query);

    // Check if res is valid and contains the expected data
    if (!res || !res.data) {
      throw new Error('No data field found in API response.');
    }

    // Check if res.data is an array and contains valid video data
    if (!Array.isArray(res.data) || res.data.length === 0) {
      throw new Error('API response does not contain an array of video data.');
    }

    // Find the first valid video URL from the response data
    const validVideo = res.data.find(item => item.url);

    if (!validVideo) {
      throw new Error('No valid video URL found in the API response.');
    }

    const videoURL = validVideo.url;  // Get the video URL from the first valid item

    // Send the video URL to the user
    const cap = 'Here is the video you requested:';
    await bot.sendVideo(m.chat.id, videoURL, { caption: cap });

  } catch (error) {
    console.error("Error:", error.message || error);
    await bot.sendMessage(m.chat.id, `❌ An error occurred while processing the request: ${error.message || error}`);
  }
};

handler.command = ['fb', 'fbdl', 'facebook'];  // Command list
handler.help = ['fb', 'fbdl', 'facebook'];
handler.tags = ['main'];

module.exports = handler;

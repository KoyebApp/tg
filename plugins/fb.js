const Qasim = require('api-qasim');

const handler = async ({ bot, m, text, db, usedPrefix, command, query }) => {
  if (!query) {
    await bot.sendMessage(m.chat.id, '❌ You need to provide the URL of the Facebook video.');
    return;
  }

  // Send a message indicating the bot is processing the request
  await bot.sendMessage(m.chat.id, '⌛ Processing your request, please wait...');

  let res;
  try {
    // Fetch the video data using fbdl with the provided query (URL)
    res = await Qasim.fbdl(query);

    // Log the response to inspect its structure
    console.log("API Response:", res);

    // Check if res.data exists and is an array
    if (!res || !res.data || !Array.isArray(res.data)) {
      throw '❌ No video data found or the response structure is incorrect.';
    }

    let data = res.data; // Extract video data from the response

    // Check if there is any valid video URL (find the first valid item with 'url')
    const validVideo = data.find(item => item.url);

    if (!validVideo) {
      throw '❌ No valid video URL found in the response.';
    }

    const videoURL = validVideo.url;  // Get the video URL from the first valid item
    console.log("Found Video URL:", videoURL); // Log the video URL for debugging

    // Send the video to the user
    const cap = 'Here is the video you requested:';
    await bot.sendVideo(m.chat.id, videoURL, { caption: cap });

    // Send a message indicating the request was processed successfully
    await bot.sendMessage(m.chat.id, '✅ Video sent successfully!');

  } catch (error) {
    console.error("Error:", error);
    await bot.sendMessage(m.chat.id, `❌ An error occurred while processing the request: ${error.message || error}`);
  }
};

module.exports = handler;

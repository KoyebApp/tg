import pkg from 'api-qasim';
const { fbdl } = pkg;

let handler = async (m, { bot, usedPrefix, args, command, text }) => {
  if (!text) {
    await bot.sendMessage(m.chat.id, '❌ You need to provide the URL of the Facebook video.');
    return;
  }

  await m.react('⌛'); // Indicating that the bot is processing the request

  let res;
  try {
    // Fetch the video data using fbdl
    res = await fbdl(text);
    
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

    // If a video URL is found, send the video
    await m.react('✅'); // Indicating that the video is ready to be sent

    const cap = 'Here is the video you requested:';
    await bot.sendVideo(m.chat.id, videoURL, { caption: cap });

  } catch (error) {
    console.error("Error:", error);
    await bot.sendMessage(m.chat.id, `❌ An error occurred while processing the request: ${error.message}`);
  }
};

handler.help = ['Facebook', 'fb', 'fbdl'];
handler.tags = ['downloader'];
handler.command = /^(facebook|fb|fbdl)$/i;

export default handler;

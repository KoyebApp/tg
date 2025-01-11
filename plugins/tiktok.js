import fetch from 'node-fetch';
import pkg from 'nayan-videos-downloader';
const { tikdown } = pkg;

const handler = async (message, { bot, args }) => {
  // Check if the URL is provided in the command arguments
  if (!args[0]) {
    await bot.sendMessage(message.chat.id, '✳️ Please enter the TikTok link after the command.');
    return;
  }

  // Validate the URL format for TikTok, including shortened URLs like vm.tiktok.com
  const urlPattern = /(?:https?:\/\/(?:www\.)?)?(tiktok\.com\/(?:[^\/]+\/v\/\d+|[^\/]+\/post\/\d+)|vm\.tiktok\.com\/[\w\d]+)/gi;
  if (!args[0].match(urlPattern)) {
    await bot.sendMessage(message.chat.id, '❌ Invalid TikTok link. Please provide a valid TikTok video URL.');
    return;
  }

  // React with a loading emoji to show the process has started
  await bot.sendMessage(message.chat.id, '⏳ Processing your TikTok download request...');

  try {
    // The URL of the TikTok video
    const url = args[0];

    // Fetch media data using the nayan-video-downloader package
    let mediaData = await tikdown(url);

    // Check if the media data has a valid video URL
    if (!mediaData.data || !mediaData.data.video) {
      throw new Error('Could not fetch the video URL');
    }

    const videoUrl = mediaData.data.video;

    // Fetch the media content from the download URL
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch the media content');
    }

    // Convert the response to an array buffer
    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    // Send the video file to the user
    await bot.sendDocument(message.chat.id, mediaBuffer, {
      caption: '*𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 © 𝚄𝙻𝚃𝚁𝙰-𝙼𝙳*',
      filename: 'tiktok.mp4',
      parse_mode: 'Markdown'
    });

    // React with a success emoji
    await bot.sendMessage(message.chat.id, '✅ The video has been sent successfully!');

  } catch (error) {
    // Log and handle any errors
    console.error('Error downloading from TikTok:', error.message, error.stack);
    await bot.sendMessage(message.chat.id, '⚠️ An error occurred while processing the request. Please try again later.');
  }
};

// Define command metadata
handler.help = ['tiktok', 'tt', 'tikdown', 'ttdl'];
handler.tags = ['downloader'];
handler.command = ['tiktok', 'tt', 'tikdown', 'ttdl'];

export default handler;

import fetch from 'node-fetch';
import pkg from 'nayan-videos-downloader';
const { instagram } = pkg;

const fetchWithRetry = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.ok) return response;
    console.log(`Retrying... (${i + 1})`);
  }
  throw new Error('Failed to fetch media content after retries');
};

let handler = async (m, { bot, text }) => {
  if (!text) {
    return bot.sendMessage(m.chat.id, "✳️ Enter the Instagram link next to the command");
  }

  // Updated regex to capture various Instagram link formats
  const instagramRegex = /^(https?:\/\/)?(www\.)?(instagram\.com\/(reel|p|tv)\/[A-Za-z0-9._%+-]+(\/)?(\?igsh=[A-Za-z0-9=]+)?)$/;

  if (!text.match(instagramRegex)) {
    return bot.sendMessage(m.chat.id, "❌ Link incorrect. Please ensure it is a valid Instagram post or reel link.");
  }

  // Simulate "waiting" action with a message (Telegram doesn't support reactions like WhatsApp)
  await bot.sendMessage(m.chat.id, "⏳ Fetching the media... please wait.");

  try {
    const url = text.trim();
    console.log('Checking link:', url);

    const mediaData = await instagram(url);
    console.log('Media Data:', mediaData);

    if (!mediaData.status) {
      throw new Error(`Error: ${mediaData.msg || 'Failed to retrieve media data'}`);
    }

    let downloadUrl;
    if (mediaData.data.video && mediaData.data.video.length > 0) {
      downloadUrl = mediaData.data.video[0]; // Use the first video URL
    } else if (mediaData.data.images && mediaData.data.images.length > 0) {
      downloadUrl = mediaData.data.images[0]; // Use the first image URL
    } else {
      throw new Error('Could not fetch the download URL');
    }

    console.log('Download URL:', downloadUrl);

    const response = await fetchWithRetry(downloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || 
        (!contentType.includes('image') && 
        !contentType.includes('octet-stream') && 
        !contentType.includes('video'))) {
      throw new Error('Invalid content type received');
    }

    const arrayBuffer = await response.arrayBuffer();
    const mediaBuffer = Buffer.from(arrayBuffer);

    if (mediaBuffer.length === 0) throw new Error('Downloaded file is empty');

    const fileName = mediaData.data.title ? `${mediaData.data.title}.jpg` : 'media.jpg';
    const mimetype = mediaData.data.video.length > 0 ? 'video/mp4' : 'image/jpeg';

    await bot.sendDocument(m.chat.id, mediaBuffer, { caption: '*Powered by Ultra-MD*' }, { filename: fileName, mimetype });
    await bot.sendMessage(m.chat.id, "✅ Media fetched and sent successfully.");

  } catch (error) {
    console.error('Error downloading from Instagram:', error.message, error.stack);
    await bot.sendMessage(m.chat.id, '⚠️ An error occurred while processing the request. Please try again later.');
  }
};

handler.help = ['instagram', 'ig', 'igdl', 'instagramdl', 'insta', 'igdownload'];
handler.tags = ['downloader'];
handler.command = ['instagram', 'ig', 'igdl', 'instagramdl', 'insta', 'igdownload'];

export default handler;

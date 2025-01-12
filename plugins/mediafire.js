const fetch = require('node-fetch');  // Importing fetch to handle file download
const { URLSearchParams } = require('url'); // To work with query parameters
const Qasim = require('api-qasim');  // Import the API package for MediaFire functionality

let handler = async ({ bot, m, text, db, query, usedPrefix, command }) => {
  // Ensure that a valid query (URL) is provided
  if (!query) {
    await bot.sendMessage(m.chat.id, "❌ Please provide a valid MediaFire URL.");
    return;
  }

  // Log the query (URL) into the database for tracking
  if (db) {
    await db.save({
      query: query,
      timestamp: Date.now(),
      user: m.from
    });
    console.log(`Logged query from user: ${m.from}`);
  }

  try {
    // Send message indicating bot is processing
    await bot.sendMessage(m.chat.id, "⏳ Fetching the MediaFire file, please wait...");

    const mediafireUrl = query.trim();  // Extract MediaFire URL

    // Fetch data from MediaFire using Qasim API
    let mediafireResponse = await Qasim.mediafire(mediafireUrl);
    let mediafireData = mediafireResponse;

    // Log the response for debugging
    console.log('MediaFire Data:', mediafireData);

    // Validate if valid data is returned
    if (!mediafireData || !mediafireData.name || !mediafireData.link) {
      return bot.sendMessage(m.chat.id, "❌ No valid data found for the provided URL.");
    }

    // Format the caption to display file information
    let caption = `≡ *MEDIAFIRE DOWNLOADER*:\n`;
    caption += `
▢ *File:* ${mediafireData.name}
▢ *Size:* ${mediafireData.size}
▢ *Type:* ${mediafireData.filetype}

*Download In Progress....Please Wait ⌛*\n\n*Powered by Ultra-MD*`;

    await bot.sendMessage(m.chat.id, caption);

    // Check for file size limit (100MB) for Telegram
    if (mediafireData.size > 100 * 1024 * 1024) {
      return bot.sendMessage(m.chat.id, "❌ The file is too large to be sent via Telegram (limit is 100MB).");
    }

    // Get the direct download URL from the response
    let directDownloadUrl = mediafireData.link;

    // If the URL contains Google Translate redirection, extract the actual MediaFire URL
    if (directDownloadUrl.includes('translate.google.com')) {
      // Extract the actual URL from the translate redirect using URLSearchParams
      const urlParams = new URLSearchParams(directDownloadUrl.split('?')[1]);
      const actualUrl = decodeURIComponent(urlParams.get('u'));
      directDownloadUrl = actualUrl;
    }

    // Fetch the file from MediaFire
    const response = await fetch(directDownloadUrl);

    // Check if the response is valid
    if (!response.ok) {
      console.error('Failed to fetch the file:', response.statusText);
      return bot.sendMessage(m.chat.id, "❌ Failed to download the file from MediaFire.");
    }

    // Check the content length of the file
    const contentLength = response.headers.get('content-length');

    // If content length is suspiciously small (less than 1KB), abort
    if (parseInt(contentLength) < 1000) {
      return bot.sendMessage(m.chat.id, "❌ The file seems too small to be the actual download. Something went wrong.");
    }

    // Buffer the response (file data)
    const buffer = await response.buffer();

    // Check if the buffer is empty or corrupt
    if (!buffer || buffer.length === 0) {
      return bot.sendMessage(m.chat.id, "❌ Failed to download the file properly.");
    }

    // Determine the MIME type based on the file extension
    let mimeType = '';
    switch (mediafireData.ext.toLowerCase()) {
      case 'zip':
        mimeType = 'application/zip';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'apk':
        mimeType = 'application/vnd.android.package-archive';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
      case 'mp4':
        mimeType = 'video/mp4';
        break;
      case 'mkv':
        mimeType = 'video/x-matroska';
        break;
      case 'webm':
        mimeType = 'video/webm';
        break;
      default:
        mimeType = `application/${mediafireData.ext.toLowerCase()}`;
    }

    // Send the file to the chat
    await bot.sendDocument(m.chat.id, buffer, { caption: mediafireData.name, mimetype: mimeType });

  } catch (error) {
    console.error('Error:', error);
    await bot.sendMessage(m.chat.id, "❌ An error occurred while fetching or downloading the file from MediaFire.");
  }
};

module.exports = handler;

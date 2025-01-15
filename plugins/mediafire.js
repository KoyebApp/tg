const Qasim = require('api-qasim');
const fetch = require('node-fetch');  // Import fetch to handle file download
const { URLSearchParams } = require('url'); // To work with query parameters

let handler = async ({ bot, m, text, query }) => {
  // Ensure query (URL) is provided
  if (!query) {
    await bot.sendMessage(m.chat.id, 'You need to provide a MediaFire URL.');
    return;
  }

  try {
    // Send a message indicating the bot is processing the request
    await bot.sendMessage(m.chat.id, '⏳ Fetching the MediaFire file, please wait...');

    const mediafireUrl = query.trim();  // Extract MediaFire URL

    // Fetch data from MediaFire using the API
    let mediafireResponse = await Qasim.mediafire(mediafireUrl);
    let mediafireData = mediafireResponse;


    // Validate the response to ensure valid data
    if (!mediafireData || !mediafireData.name || !mediafireData.link) {
      return bot.sendMessage(m.chat.id, "No valid data found for the provided URL.");
    }

    // Format the caption to display file information
    let caption = `≡ MEDIAFIRE DOWNLOADER:\n`;
    caption += `
▢ File: ${mediafireData.name}
▢ Size: ${mediafireData.size}
▢ Type: ${mediafireData.filetype}

Download In Progress....Please Wait ⌛\n\nPowered by MEGA-AI`;

    await bot.sendMessage(m.chat.id, caption);

    // Check for file size limit (100MB) for Telegram
    if (mediafireData.size > 100 * 1024 * 1024) {
      return bot.sendMessage(m.chat.id, "The file is too large to be sent via Telegram (limit is 100MB).");
    }

    // Get the direct download URL from the response
    let directDownloadUrl = mediafireData.link;

    // If the URL contains Google Translate redirection, extract the actual MediaFire URL
    if (directDownloadUrl.includes('translate.google.com')) {
      const urlParams = new URLSearchParams(directDownloadUrl.split('?')[1]);
      const actualUrl = decodeURIComponent(urlParams.get('u'));
      directDownloadUrl = actualUrl;
    }

    // Fetch the file from MediaFire
    const response = await fetch(directDownloadUrl);

    // Check if the response is valid
    if (!response.ok) {
      console.error('Failed to fetch the file:', response.statusText);
      return bot.sendMessage(m.chat.id, "Failed to download the file from MediaFire.");
    }

    // Check the content length of the file
    const contentLength = response.headers.get('content-length');

    // If content length is suspiciously small (less than 1KB), abort
    if (parseInt(contentLength) < 1000) {
      return bot.sendMessage(m.chat.id, "The file seems too small to be the actual download. Something went wrong.");
    }

    // Buffer the response (file data)
    const buffer = await response.buffer();

    // Check if the buffer is empty or corrupt
    if (!buffer || buffer.length === 0) {
      return bot.sendMessage(m.chat.id, "Failed to download the file properly.");
    }

    // Determine the MIME type based on the file extension
    let mimeType = '';
    const fileExtension = mediafireData.ext.toLowerCase();
    switch (fileExtension) {
      case 'zip':
        mimeType = 'application/zip';
        break;
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'apk':
        mimeType = 'application/vnd.android.package-archive';  // MIME type for APK files
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';  // MIME type for JPEG images
        break;
      case 'png':
        mimeType = 'image/png';   // MIME type for PNG images
        break;
      case 'gif':
        mimeType = 'image/gif';   // MIME type for GIF images
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
        mimeType = `application/${fileExtension}`;  // Fallback MIME type
    }

    // Send the file to the chat
    await bot.sendDocument(m.chat.id, buffer, { caption: mediafireData.name, mimetype: mimeType });

  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(m.chat.id, "An error occurred while fetching or downloading the file from MediaFire.");
  }
};
module.exports = handler;

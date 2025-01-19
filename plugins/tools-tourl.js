const uploadtoimgur = require('../lib/imgur');  // Import imgur upload function
const fs = require('fs');  // File system module
const path = require('path');  // Path module
const os = require('os');  // For platform-independent temp directories

let handler = async ({ bot, m }) => {
  try {
    // Get quoted message or current message
    let q = m.quoted ? m.quoted : m;

    // Ensure message has mime type (for media)
    let mime = (q.msg || q).mimetype || '';
    console.log('Mime Type Detected:', mime);  // Add logging to check mime type

    if (!mime) {
      throw '✳️ Respond to an image/video';
    }

    // Download the media file (make sure it's an image/video)
    let mediaBuffer = await q.download();
    if (!mediaBuffer || mediaBuffer.length === 0) {
      throw '❌ Failed to download the media file. Please try again.';
    }
    console.log('Media downloaded successfully, buffer size:', mediaBuffer.length);

    // Check if media size exceeds 10 MB
    if (mediaBuffer.length > 10 * 1024 * 1024) {
      throw '✴️ Media size exceeds 10 MB. Please upload a smaller file.';
    }

    // Prepare temporary directory for storing the file
    let tmpDir = path.join(os.tmpdir(), 'telegram_media');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });  // Ensure the directory is created if it doesn't exist
    }

    // Generate a path for the media file
    let mediaPath = path.join(tmpDir, `media_${Date.now()}.${mime.split('/')[1]}`);
    fs.writeFileSync(mediaPath, mediaBuffer);
    console.log('Media saved to temp file:', mediaPath);

    // Check if the file is a valid image/video (basic check for png/jpg/gif/mp4)
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
    if (!isTele) {
      throw '❌ Unsupported media type. Please upload an image or video.';
    }

    // Upload the media to imgur and get the URL
    let link = await uploadtoimgur(mediaPath);
    if (!link) {
      throw '❌ Failed to upload to imgur. Please try again later.';
    }

    // Calculate the file size in MB
    const fileSizeMB = (mediaBuffer.length / (1024 * 1024)).toFixed(2);

    // Send success message with the URL using bot.sendMessage
    await bot.sendMessage(m.chat.id, `✅ *Media Upload Successful*\n☆ *File Size:* ${fileSizeMB} MB\n☆ *URL:* ${link}`);

    // Clean up the temporary media file
    fs.unlinkSync(mediaPath);
    console.log('Temporary file cleaned up.');

  } catch (error) {
    // Handle any errors and send an error message
    console.error('Error processing media:', error);
    await bot.sendMessage(m.chat.id, `❌ Error: ${error}`);
  }
};

// Command and help configuration
handler.help = ['tourl'];
handler.tags = ['tools'];
handler.command = ['url', 'tourl'];

// Export the handler for use in the bot
module.exports = handler;

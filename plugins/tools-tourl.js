const uploadtoimgur = require('../lib/imgur');  // Import imgur upload function
const fs = require('fs');  // File system module
const path = require('path');  // Path module

let handler = async ({ bot, m }) => {
  try {
    let q = m.quoted ? m.quoted : m;  // Get quoted message if any, else the current message
    let mime = (q.msg || q).mimetype || '';  // Get the mime type of the message media

    // Ensure mime type exists
    if (!mime) {
      throw '✳️ Respond to an image/video';
    }

    // Download media file
    let mediaBuffer = await q.download();

    // Check if the media size exceeds 10 MB
    if (mediaBuffer.length > 10 * 1024 * 1024) {
      throw '✴️ Media size exceeds 10 MB. Please upload a smaller file.';
    }

    // Get the current module directory
    let currentModuleDirectory = path.dirname(__filename);  // Use __filename to get the current file path

    // Create a temporary directory for storing the downloaded file
    let tmpDir = path.join(currentModuleDirectory, '../tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);  // Create tmp directory if it doesn't exist
    }

    // Generate a path for the media file
    let mediaPath = path.join(tmpDir, `media_${Date.now()}.${mime.split('/')[1]}`);
    fs.writeFileSync(mediaPath, mediaBuffer);  // Write media to file

    // Check if the mime type is valid for uploading
    let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);

    if (isTele) {
      // Upload the media to imgur and get the URL
      let link = await uploadtoimgur(mediaPath);

      // Calculate the file size in MB
      const fileSizeMB = (mediaBuffer.length / (1024 * 1024)).toFixed(2);

      // Send success message with the URL using bot.sendMessage
      await bot.sendMessage(m.chat.id, `✅ *Media Upload Successful*\n☆ *File Size:* ${fileSizeMB} MB\n☆ *URL:* ${link}`);
    } else {
      // If not an image/video, send a document instead of a photo
      await bot.sendDocument(m.chat.id, mediaPath, { caption: `☆ ${mediaBuffer.length} Byte(s)\n☆ (Unknown)` });
    }

    // Clean up by deleting the temporary media file
    fs.unlinkSync(mediaPath);

  } catch (error) {
    // Handle any errors and send an error message
    console.error(error);
    await bot.sendMessage(m.chat.id, `❌ Error: ${error}`);
  }
};

// Command and help configuration
handler.help = ['tourl'];
handler.tags = ['tools'];
handler.command = ['url', 'tourl'];

// Export the handler for use in the bot
module.exports = handler;

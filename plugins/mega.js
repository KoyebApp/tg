const mega = require('megajs');
const path = require('path');

let handler = async ({ bot, m, query, command }) => {
  try {
    // Ensure query (URL) is provided
    if (!query || !query.trim().startsWith('https://mega.nz/')) {
      return bot.sendMessage(m.chat.id, `Please provide a valid MEGA URL. Example: /${command} https://mega.nz/file/yourFileLink`);
    }

    // Parse the file from the provided URL
    const file = mega.File.fromURL(query.trim());
    await file.loadAttributes();

    // Check if file size exceeds the limit (300MB)
    if (file.size >= 300 * 1024 * 1024) {
      return bot.sendMessage(m.chat.id, 'File size is too large (Maximum Size: 300MB).');
    }

    // Notify the user that the file is being downloaded
    const downloadingMessage = '🌩️ Downloading file... Please wait.';
    await bot.sendMessage(m.chat.id, downloadingMessage);

    // Prepare caption and file info
    const caption = `Download Complete!\nFile: ${file.name}\nSize: ${formatBytes(file.size)}`;

    // Download the file as a buffer
    const data = await file.downloadBuffer();

    // Determine the MIME type based on file extension
    const fileExtension = path.extname(file.name).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.pdf': 'application/pdf',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed',
      '.7z': 'application/x-7z-compressed',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
    };

    const mimetype = mimeTypes[fileExtension] || 'application/octet-stream';

    // Send the file to the user
    await bot.sendDocument(m.chat.id, data, { caption, filename: file.name, mimetype });

  } catch (error) {
    // Handle errors gracefully
    console.error('Error:', error);
    return bot.sendMessage(m.chat.id, `❌ Error: ${error.message}`);
  }
};

handler.command = ['mega', 'megadl', 'dlmega'];  // Command list
handler.help = ['mega', 'megadl', 'dlmega'];
handler.tags = ['downloader'];

module.exports = handler;

// Function to format bytes into a human-readable string
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

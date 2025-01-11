const mega = require('megajs');
const path = require('path');

let handler = async (m, { bot, text, command }) => {
  try {
    // Ask the user to provide the link if no link is provided
    if (!text)
      return bot.sendMessage(m.chat.id, `Please provide the MEGA link. Example: /${command} https://mega.nz/file/yourFileLink`);

    // Parse the file from the provided URL
    const file = mega.File.fromURL(text);
    await file.loadAttributes();

    // Check file size limit
    if (file.size >= 300000000)
      return bot.sendMessage(m.chat.id, 'Error: File size is too large (Maximum Size: 300MB)');

    // Notify the user that the file is being downloaded
    const downloadingMessage = `🌩️ Downloading file... Please wait.`;
    await bot.sendMessage(m.chat.id, downloadingMessage);

    // Format the download completion message
    const caption = `*_Successfully downloaded..._*\nFile: ${file.name}\nSize: ${formatBytes(file.size)}`;

    // Download the file data
    const data = await file.downloadBuffer();

    // Determine the file extension and MIME type
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

    let mimetype = mimeTypes[fileExtension] || 'application/octet-stream';

    // Send the file to the user
    await bot.sendDocument(m.chat.id, data, { caption }, { filename: file.name, mimetype });

  } catch (error) {
    // Handle errors gracefully
    console.error(error);
    return bot.sendMessage(m.chat.id, `Error: ${error.message}`);
  }
};

handler.help = ['mega'];
handler.tags = ['downloader'];
handler.command = /^(mega)$/i;

module.exports = handler;

// Function to format bytes into a human-readable string
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat(
    (bytes / Math.pow(k, i)).toFixed(2)
  ) + ' ' + sizes[i];
}

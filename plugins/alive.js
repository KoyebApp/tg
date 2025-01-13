const path = require('path');  // Import the 'path' module to handle file paths
const fs = require('fs');  // Import 'fs' to check file existence

const handler = async ({ bot, m, db }) => {
  // Correct the path to the photo relative to the current file's location
  const photoPath = path.join(__dirname, '../assets/A.jpg');  // Going up one level from ./plugins to ./assets

  // Check if the file exists at the given path
  if (!fs.existsSync(photoPath)) {
    console.error('Photo file not found at path:', photoPath);
    return;  // Exit the function if the file doesn't exist
  }

  // Send a photo with a caption
  try {
    await bot.sendPhoto(m.chat.id, { source: photoPath }, { caption: 'Bot Is Alive And Running!' });
    console.log('Photo sent successfully!');
  } catch (error) {
    console.error('Error sending photo:', error);
  }
};

module.exports = handler;

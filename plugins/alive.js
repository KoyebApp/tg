const path = require('path');  // Import 'path' module to handle file paths
const fs = require('fs');  // Import 'fs' module to check file existence

const handler = async ({ bot, m, db, text }) => {
  // Correct the path to the photo relative to the current file's location
  const photoPath = path.join(__dirname, '../assets/A.jpg');  // Going up one level from ./plugins to ./assets

  // Check if the file exists at the given path
  if (!fs.existsSync(photoPath)) {
    return;  // Exit the function if the file doesn't exist
  }

  // Send a photo with a caption
  try {
    // Send the photo directly by passing the file path
    await bot.sendPhoto(m.chat.id, photoPath, { caption: 'Bot Is Alive And Running!' });
  } catch (error) {
    console.error('Error sending photo:', error);
  }
};

module.exports = handler;

const path = require('path');  // Import the 'path' module to handle file paths

const handler = async ({ bot, m, db }) => {
  const photoPath = path.join(__dirname, '../assets/A.jpg');  // Ensure the path is correct

  // Send a photo with a caption
  try {
    await bot.sendPhoto(m.chat.id, { source: photoPath }, { caption: 'Bot Is Alive And Running!' });
  } catch (error) {
    console.error('Error sending photo:', error);
  }
};

module.exports = handler;

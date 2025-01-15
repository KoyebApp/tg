const path = require('path');  // Import 'path' module to handle file paths
const fs = require('fs');  // Import 'fs' module to check file existence

const handler = async ({ bot, m, db, text }) => {
  console.log('Alive command triggered');  // Debugging log to check if it's called
  const photoPath = path.join(__dirname, '../assets/A.jpg');

  if (!fs.existsSync(photoPath)) {
    console.log('Photo not found');  // Debugging log for photo path
    return;
  }

  try {
    await bot.sendPhoto(m.chat.id, photoPath, { caption: 'Bot Is Alive And Running!' });
  } catch (error) {
    console.error('Error sending photo:', error);
  }
};

handler.help = ['alive', 'awake'];
handler.tags = ['main'];
handler.command = ['alive', 'awake'];

module.exports = handler;

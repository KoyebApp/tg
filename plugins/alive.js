const path = require('path');  // Import 'path' module to handle file paths
const fs = require('fs');  // Import 'fs' module to check file existence

const handler = async ({ bot, m }) => {
  const photoPath = path.join(__dirname, '../assets/C.jpg');

  if (!fs.existsSync(photoPath)) {
    return;
  }

  try {
    await bot.sendPhoto(m.chat.id, photoPath, { caption: 'Bot Is Alive And Running!\n\nSupport By Subscribe youtube.com/@GlobalTechInfo\n' });
  } catch (error) {
    console.error('Error sending photo:', error);
  }
};

handler.command = ['alive', 'awake'];  // Command list
handler.help = ['alive', 'awake'];
handler.tags = ['main'];

module.exports = handler;

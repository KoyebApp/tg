const fs = require('fs');
const path = require('path');

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;

    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner (for security)
    if (chatId.toString() === process.env.OWNER_ID) {
      const sanitizedQuery = (query && query.trim().toLowerCase()) || 'info';  // Default to 'info' if query is empty
      console.log(`Received query: "${sanitizedQuery}"`);

      if (sanitizedQuery === 'info') {
        // Fetch bot information (e.g., version, uptime)
        const botInfo = {
          version: '0.0.1',   // Example version, change based on your version
          uptime: process.uptime(), // Uptime in seconds
        };
        const uptime = new Date(botInfo.uptime * 1000).toISOString().substr(11, 8); // Format uptime as hh:mm:ss
        const botMessage = `
        
➠ Bot Name : 𝙼𝙴𝙶𝙰-𝙰𝙸

➠ Version : ${botInfo.version}

➠ Structure: Plugins

➠ Runtime: ${uptime}

➠ Platform: Linux
        `;
        
        // Define the correct path for the image
        const imagePath = path.join(__dirname, '..', 'assets', 'A.jpg');
        
        // Check if the image file exists
        if (!fs.existsSync(imagePath)) {
          throw new Error('Image file not found');
        }

        // Send bot info with the photo (content type inferred automatically)
        await bot.sendPhoto(chatId, imagePath, { caption: botMessage });
      } else {
        await bot.sendMessage(chatId, "Invalid command. Please use 'info' to get bot information.");
      }
    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    console.error('Error occurred during info command:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while processing the info command. Please try again later.");
    }
  }
};

handler.command = ['info', 'ping', 'test', 'details'];
handler.help = ['info', 'ping', 'test', 'details'];
handler.tags = ['owner'];

module.exports = handler;

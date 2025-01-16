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
          Bot Information:
          
          Developer: Qasim Ali
          Bot Name: MEGA-AI
          Structure: [Plugins]
          Version: ${botInfo.version}
          Uptime: ${uptime}
        `;
        await bot.sendMessage(chatId, botMessage, { parse_mode: 'Markdown' });
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

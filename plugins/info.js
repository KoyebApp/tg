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
          version: '1.0.0',   // Example version, change based on your version
          uptime: process.uptime(), // Uptime in seconds
        };
        const uptime = new Date(botInfo.uptime * 1000).toISOString().substr(11, 8); // Format uptime as hh:mm:ss
        const botMessage = `
          *Bot Information:*
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

handler.command = ['info'];  // Add info command
handler.help = ['info'];  // Help message for the info command
handler.tags = ['owner'];  // Only allow the owner to use this command

module.exports = handler;

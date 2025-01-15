let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;

    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner (for security)
    if (chatId.toString() === process.env.OWNER_ID) {
      const sanitizedQuery = (query && query.trim().toLowerCase()) || 'shutdown';  // Default to 'shutdown' if query is empty
      console.log(`Received query: "${sanitizedQuery}"`);

      // Check if the query is 'shutdown'
      if (sanitizedQuery === 'shutdown') {
        bot.sendMessage(chatId, "Bot is shutting down...");

        // Log the shutdown and stop the process
        console.log('Bot shutdown initiated...');
        process.exit();  // This will terminate the bot process
      } else {
        bot.sendMessage(chatId, "Invalid command. Please use 'shutdown' to shut down the bot.");
      }
    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    console.error('Error occurred during shutdown:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while shutting down the bot. Please try again later.");
    }
  }
};

handler.command = ['shutdown'];  // Add shutdown command
handler.help = ['shutdown'];  // Help message for the shutdown command
handler.tags = ['owner'];  // Only allow the owner to use this command

module.exports = handler;

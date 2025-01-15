let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;

    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    const sanitizedQuery = query && query.trim();

    // If no query is given, notify the user
    if (!sanitizedQuery) {
      await bot.sendMessage(chatId, "Please provide a message to echo.");
    } else {
      // Echo the user's message
      await bot.sendMessage(chatId, sanitizedQuery);
    }
  } catch (error) {
    console.error('Error occurred during echo command:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while processing the echo command. Please try again later.");
    }
  }
};

handler.command = ['echo'];  // Add echo command
handler.help = ['echo <message>'];  // Help message for the echo command
handler.tags = ['general'];  // Available to all users

module.exports = handler;

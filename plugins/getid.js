let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    const userId = m.from.id;  // User ID who sent the message

    if (m.chat.type === 'private') {
      // This is a private chat, showing user's chat ID
      bot.sendMessage(chatId, `Your chat ID is: ${userId}`);
    } else if (m.chat.type === 'group' || m.chat.type === 'supergroup') {
      // This is a group chat, showing group's chat ID
      bot.sendMessage(chatId, `The chat ID for this group is: ${chatId}`);
      
      // If you want the bot's ID (bot's user ID), it can be fetched like so:
      const botInfo = await bot.getMe();  // Get the bot's info
      bot.sendMessage(chatId, `The bot's ID (username): @${botInfo.username}, bot chat ID: ${botInfo.id}`);
    } else {
      bot.sendMessage(chatId, 'This command only works in group or private chats.');
    }
  } catch (error) {
    console.error('Error fetching chatId:', error);
    bot.sendMessage(m.chat.id, 'An error occurred while fetching the chat ID.');
  }
};

handler.command = ['getchatid'];  // Command to get the chat ID
handler.help = ['getchatid'];  // Help for the command
handler.tags = ['info'];  // Tags for categorization

module.exports = handler;

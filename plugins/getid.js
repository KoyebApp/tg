let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    const userId = m.from.id;  // The user who sent the message
    const chatType = m.chat.type;  // To check if it is a group or private chat

    // Check if it's a private chat
    if (chatType === 'private') {
      bot.sendMessage(chatId, `Your chat ID is: ${userId}`);
    }
    // Check if it's a group or supergroup
    else if (chatType === 'group' || chatType === 'supergroup') {
      bot.sendMessage(chatId, `This group's chat ID is: ${chatId}`);
      
      // To fetch the bot's ID (bot's user ID) and other details
      const botInfo = await bot.getMe();
      bot.sendMessage(chatId, `The bot's ID (username): @${botInfo.username}, bot user ID: ${botInfo.id}`);
    }
    // For other chat types like channels (it could also show an error)
    else {
      bot.sendMessage(chatId, 'This command only works in private or group chats.');
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

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    const messageFrom = m.from.id;  // User ID who sent the message

    if (m.chat.type === 'private') {
      // This is a private chat with the bot, so it's the user's chat ID
      bot.sendMessage(chatId, `Your chat ID is: ${messageFrom}`);
    } else if (m.chat.type === 'group' || m.chat.type === 'supergroup') {
      // This is a group chat, so it's the group's chat ID
      bot.sendMessage(chatId, `The chat ID for this group is: ${chatId}`);
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

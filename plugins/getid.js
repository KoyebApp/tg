let handler = async ({ m, bot }) => {
  try {
    const chatId = m.chat.id;
    const chatType = m.chat.type; // Get the type of chat

    // Log chat type to see what it is
    console.log('Chat Type:', chatType);
    console.log('Chat ID:', chatId);

    if (chatType === 'private') {
      // If the message is from a private chat
      bot.sendMessage(m.chat.id, `Your private chat ID is: ${chatId}`);
    } else if (chatType === 'group' || chatType === 'supergroup') {
      // If the message is from a group chat
      bot.sendMessage(m.chat.id, `This group chat ID is: ${chatId}`);
    } else {
      // In case it's a different type of chat (e.g., channel, bot)
      bot.sendMessage(m.chat.id, `Chat ID: ${chatId}`);
    }
  } catch (error) {
    console.error('Error occurred while fetching chatId:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while fetching the chat ID.");
    }
  }
};

handler.command = ['/getchatid']; // Command to trigger chat ID fetch
handler.help = ['/getchatid'];  // Help for the command
handler.tags = ['utility'];  // Tag for categorization

module.exports = handler;

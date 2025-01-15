let handler = async ({ m, bot }) => {
  try {
    const chatId = m.chat.id;

    // Ensure the bot is in a group chat
    if (m.chat.type !== 'private') {
      bot.sendMessage(m.chat.id, `The chat ID of this group is: ${chatId}`);
    } else {
      bot.sendMessage(m.chat.id, `The chat ID of your private chat is: ${chatId}`);
    }
  } catch (error) {
    console.error('Error occurred while fetching chatId:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while fetching the chat ID.");
    }
  }
};

handler.command = ['/getchatid']; // Add the command for fetch chat ID
handler.help = ['/getchatid'];  // Help for the command
handler.tags = ['utility'];  // Tags for easy categorization

module.exports = handler;

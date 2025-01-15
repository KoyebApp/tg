let handler = async ({ callbackQuery, bot }) => {
  try {
    const chatId = callbackQuery.message.chat.id;
    const callbackData = callbackQuery.data;

    if (callbackData === 'help') {
      await bot.sendMessage(chatId, "You clicked the help button!");
    } else {
      await bot.sendMessage(chatId, "You clicked a button!");
    }

  } catch (error) {
    console.error('Error occurred during callback query handling:', error);
  }
};

handler.command = [];  // Not a command but an event handler
handler.help = [];     // No help for event handlers
handler.tags = ['inline'];  // Inline event

module.exports = handler;

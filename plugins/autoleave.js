let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;

    // Check if the command is from the owner and if it's the 'leave' command
    if (query === 'leave' && m.chat.id.toString() === process.env.OWNER_ID) {
      await bot.sendMessage(chatId, "Bot is leaving the group now...");
      console.log('Bot leaving the group...');

      // Make the bot leave the group
      await bot.leaveChat(chatId);
    } else if (query !== 'leave' && m.chat.id.toString() === process.env.OWNER_ID) {
      await bot.sendMessage(chatId, "You can use 'leave' to make the bot leave the group.");
    }
  } catch (error) {
    console.error('Error in auto-leave plugin:', error);
  }
};

handler.command = ['leave'];  // Command to make the bot leave the group
handler.help = ['leave'];  // Help for the command
handler.tags = ['owner'];  // Only the owner can use this command
module.exports = handler;

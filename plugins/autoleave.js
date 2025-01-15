let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;

    // Ensure the owner is issuing the 'leave' command
    if (m.chat.id.toString() === process.env.OWNER_ID && query === 'leave') {
      // Sending a confirmation message before leaving
      await bot.sendMessage(chatId, "Bot is leaving the group now...");

      // Ensure that bot is in a group before attempting to leave
      if (m.chat.type === 'group' || m.chat.type === 'supergroup') {
        // Make the bot leave the group
        await bot.leaveChat(chatId);
        console.log(`Bot left the group: ${chatId}`);
      } else {
        // If the bot is not in a group, send an error message
        await bot.sendMessage(chatId, "Bot is not in a group chat, so it cannot leave.");
        console.log('Bot is not in a group chat.');
      }
    } else if (query !== 'leave' && m.chat.id.toString() === process.env.OWNER_ID) {
      // Only allow the owner to use the leave command
      await bot.sendMessage(chatId, "You can use 'leave' to make the bot leave the group.");
    }
  } catch (error) {
    console.error('Error in auto-leave plugin:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while trying to leave the group. Please try again later.");
    }
  }
};

handler.command = ['leave'];  // Command to make the bot leave the group
handler.help = ['leave'];  // Help message for the command
handler.tags = ['owner'];  // Only allow the owner to use this command

module.exports = handler;

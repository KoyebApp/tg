let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;

    // Check if the command is from the owner
    if (m.chat.id.toString() === process.env.OWNER_ID) {
      
      // If 'leave' command is provided and the group chat ID is supplied
      if (query && query.trim()) {
        const groupChatId = query.trim();  // Extract the group chatId from the query

        // Attempt to make the bot leave the specified group
        await bot.sendMessage(chatId, `Bot is leaving the group with chatId: ${groupChatId}...`);
        console.log(`Bot leaving group with chatId: ${groupChatId}...`);
        
        // Bot leaves the specific group by chatId
        await bot.leaveChat(groupChatId);

      } else {
        await bot.sendMessage(chatId, "Please provide a group chat ID after the 'leave' command. Example: /leave <group_chat_id>");
      }

    } else {
      // If the command isn't from the owner
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }

  } catch (error) {
    console.error('Error in auto-leave plugin:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while trying to leave the group.");
    }
  }
};

handler.command = ['leave'];  // Command to make the bot leave the group
handler.help = ['leave <group_chat_id>'];  // Help for the command
handler.tags = ['owner'];  // Only the owner can use this command
module.exports = handler;

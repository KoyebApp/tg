let autoReactEnabled = false; // Variable to track if auto-react is enabled

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;

    // Check if the command is from the owner and if it's an 'on' or 'off' query
    if (query === 'on' && m.chat.id.toString() === process.env.OWNER_ID) {
      autoReactEnabled = true;
      await bot.sendMessage(chatId, "Auto-react has been enabled.");
      console.log('Auto-react enabled');
      return;
    } else if (query === 'off' && m.chat.id.toString() === process.env.OWNER_ID) {
      autoReactEnabled = false;
      await bot.sendMessage(chatId, "Auto-react has been disabled.");
      console.log('Auto-react disabled');
      return;
    }
  } catch (error) {
    console.error('Error in auto-react plugin:', error);
  }
};

handler.command = ['autoreact'];  // Command to toggle auto-react
handler.help = ['autoreact on', 'autoreact off'];  // Help for the command
handler.tags = ['owner'];  // Only the owner can use this command
module.exports = handler;

// Event listener for all messages in all chats
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // If auto-react is enabled and it's not the bot's own message
  if (autoReactEnabled && msg.from.id !== bot.botInfo.id) {
    try {
      // React to the message with a thumbs-up emoji
      await bot.reactToMessage(chatId, msg.message_id, '👍');
      console.log(`Auto-reacted to message in chatId: ${chatId}`);
    } catch (error) {
      console.error('Error reacting to message:', error);
    }
  }
});

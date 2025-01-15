const muteThreshold = process.env.MUTE_THRESHOLD ? parseInt(process.env.MUTE_THRESHOLD) : 20;  // Default to 5 if not set in .env file

let autoMuteEnabled = false;  // Variable to track if auto-mute is enabled

let handler = async ({ m, bot, query, db }) => {
  try {
    const chatId = m.chat.id;
    const userId = m.from.id;

    // Check if the command is from the owner and if it's an 'on' or 'off' query
    if (query === 'on' && m.chat.id.toString() === process.env.OWNER_ID) {
      autoMuteEnabled = true;
      await bot.sendMessage(chatId, "Auto-mute after X messages has been enabled.");
      console.log('Auto-mute enabled');
      return;
    } else if (query === 'off' && m.chat.id.toString() === process.env.OWNER_ID) {
      autoMuteEnabled = false;
      await bot.sendMessage(chatId, "Auto-mute after X messages has been disabled.");
      console.log('Auto-mute disabled');
      return;
    }

    // Track user message frequency in a chat (using a simple counter in db or memory)
    const userMessages = db.get('userMessages') || {};

    // Initialize the message count if it doesn't exist
    if (!userMessages[userId]) {
      userMessages[userId] = { count: 0, lastMessageTime: Date.now() };
    }

    const user = userMessages[userId];

    // Reset the message count if more than 30 seconds have passed
    if (Date.now() - user.lastMessageTime > 30000) {
      user.count = 0;  // Reset count if no messages within the last 30 seconds
    }

    // Increment the message count
    user.count++;
    user.lastMessageTime = Date.now();  // Update the last message timestamp

    // If auto-mute is enabled and user sends more than the defined threshold, mute them
    if (autoMuteEnabled && user.count > muteThreshold) {
      await bot.restrictChatMember(chatId, userId, { can_send_messages: false });
      await bot.sendMessage(chatId, `User ${userId} has been muted for spamming.`);
      console.log(`User ${userId} muted for sending too many messages.`);
    }

    // Save the updated user messages count
    db.set('userMessages', userMessages);
  } catch (error) {
    console.error('Error in auto-mute plugin:', error);
  }
};

handler.command = ['automute'];  // Command to toggle auto-mute
handler.help = ['automute on', 'automute off'];  // Help for the command
handler.tags = ['owner'];  // Only the owner can use this command
module.exports = handler;

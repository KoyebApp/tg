let autoWelcomeEnabled = false; // Variable to track if auto-welcome is enabled

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;

    // Check if the command is from the owner and if it's an 'on' or 'off' query
    if (query === 'on' && m.chat.id.toString() === process.env.OWNER_ID) {
      autoWelcomeEnabled = true;
      await bot.sendMessage(chatId, "Auto-welcome new members has been enabled.");
      console.log('Auto-welcome enabled');
      return;
    } else if (query === 'off' && m.chat.id.toString() === process.env.OWNER_ID) {
      autoWelcomeEnabled = false;
      await bot.sendMessage(chatId, "Auto-welcome new members has been disabled.");
      console.log('Auto-welcome disabled');
      return;
    }

    // If auto-welcome is enabled, welcome new members
    if (autoWelcomeEnabled && m.new_chat_members) {
      m.new_chat_members.forEach(async (newMember) => {
        const welcomeMessage = `Welcome ${newMember.first_name} to the group!`;
        await bot.sendMessage(chatId, welcomeMessage);
        console.log(`Sent welcome message to ${newMember.first_name}`);
      });
    }
  } catch (error) {
    console.error('Error in auto-welcome plugin:', error);
  }
};

handler.command = ['autowelcome'];  // Command to toggle auto-welcome
handler.help = ['autowelcome on', 'autowelcome off'];  // Help for the command
handler.tags = ['owner'];  // Only the owner can use this command
module.exports = handler;

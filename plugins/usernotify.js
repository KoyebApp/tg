let handler = async ({ m, bot }) => {
  try {
    const chatId = m.chat.id;

    // If there are new members in the group, send a welcome message
    if (m.new_chat_members) {
      m.new_chat_members.forEach(async (newMember) => {
        const welcomeMessage = `Welcome to the group, ${newMember.first_name}! 🎉`;
        await bot.sendMessage(chatId, welcomeMessage);
      });
    }

  } catch (error) {
    console.error('Error occurred during new member join notification:', error);
  }
};

handler.command = [];  // Not a command but an event handler
handler.help = [];     // No help for event handlers
handler.tags = ['group'];  // Group event

module.exports = handler;

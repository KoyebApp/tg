let handler = async ({ m, bot }) => {
  try {
    const chatId = m.chat.id;

    // Ensure that the event is related to new chat members
    if (m.new_chat_members) {
      for (const newMember of m.new_chat_members) {
        // Send a personalized welcome message
        const welcomeMessage = `Welcome to the group, ${newMember.first_name}! 🎉`;
        await bot.sendMessage(chatId, welcomeMessage);
      }
    }
  } catch (error) {
    console.error('Error occurred during new member greeting:', error);
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while sending the welcome message.");
    }
  }
};

handler.command = ['newmember'];  // Not a command but an event handler
handler.help = ['newmember'];  // Help message for the new member event
handler.tags = ['group'];  // Only group chats

module.exports = handler;

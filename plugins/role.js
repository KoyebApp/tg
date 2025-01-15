let handler = async ({ m, bot }) => {
  try {
    const chatId = m.chat.id;
    const chatMember = m.chat_member;

    if (!chatMember) {
      return;
    }

    const userId = chatMember.user.id;
    const status = chatMember.status;

    // Notify owner when someone's role is changed
    if (process.env.OWNER_ID) {
      const ownerChatId = process.env.OWNER_ID;
      const message = `User with ID ${userId} has changed status to: ${status}`;
      await bot.sendMessage(ownerChatId, message);
    }

    console.log(`User ${userId} changed their status to: ${status}`);
  } catch (error) {
    console.error('Error occurred during chat member status update:', error);
  }
};

handler.command = [];  // Not a command but an event handler
handler.help = [];     // No help for event handlers
handler.tags = ['admin', 'group'];  // Group event

module.exports = handler;

let handler = async ({ m, bot }) => {
  try {
    const chatId = m.chat.id;

    // If someone leaves the group, notify the chat
    if (m.left_chat_member) {
      const leftUserName = m.left_chat_member.first_name;
      const leaveMessage = `${leftUserName} has left the group. 👋`;
      await bot.sendMessage(chatId, leaveMessage);
    }

  } catch (error) {
    console.error('Error occurred during left member notification:', error);
  }
};

handler.command = [];  // Not a command but an event handler
handler.help = [];     // No help for event handlers
handler.tags = ['group'];  // Group event

module.exports = handler;

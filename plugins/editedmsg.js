let handler = async ({ m, bot }) => {
  try {
    const chatId = m.chat.id;

    if (!m.edit_date) {
      // If the message wasn't edited, skip
      return;
    }

    const originalMessage = m.text || "No text";
    const editedMessage = m.caption || "No caption";

    console.log(`Message edited in chat ${chatId}: Original: "${originalMessage}" -> Edited: "${editedMessage}"`);

    // Notify the owner about the edited message
    if (process.env.OWNER_ID) {
      const ownerChatId = process.env.OWNER_ID;
      await bot.sendMessage(ownerChatId, `Message in chat ${chatId} was edited: \n\nOriginal: "${originalMessage}"\nEdited: "${editedMessage}"`);
    }

  } catch (error) {
    console.error('Error occurred during edited message handler:', error);
  }
};

handler.command = [];  // Not a command but an event handler
handler.help = [];     // No help for event handlers
handler.tags = ['admin', 'group'];  // Group event

module.exports = handler;

let handler = async ({ m, bot }) => {
  try {
    const chatId = m.chat.id;

    // Check if the command is from the owner
    if (m.chat.id.toString() === process.env.OWNER_ID) {
      // Send the chatId of the current chat (either group or individual)
      await bot.sendMessage(chatId, `The chatId for this ${m.chat.type === 'private' ? 'user' : 'group'} is: ${chatId}`);
    } else {
      // If not from the owner, deny access to the command
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    console.error('Error fetching chatId:', error);
    await bot.sendMessage(m.chat.id, "An error occurred while fetching the chatId.");
  }
};

handler.command = ['getchatid'];  // Command to fetch the chatId
handler.help = ['getchatid'];  // Help for the getchatid command
handler.tags = ['owner'];  // Only the owner can use this command

module.exports = handler;

let handler = async ({ m, bot }) => {
  try {
    const chatId = m.chat.id;
    const pollAnswer = m.poll_answer;

    if (pollAnswer) {
      const userId = pollAnswer.user.id;
      const pollId = pollAnswer.poll_id;
      const optionIds = pollAnswer.option_ids;

      // Notify the bot owner about the changed poll answer
      if (process.env.OWNER_ID) {
        const ownerChatId = process.env.OWNER_ID;
        const message = `User with ID ${userId} changed their answer in poll ${pollId}: \nOption IDs: ${optionIds.join(', ')}`;
        await bot.sendMessage(ownerChatId, message);
      }

      console.log(`Poll answer updated: User ${userId} in poll ${pollId} selected options: ${optionIds.join(', ')}`);
    }
  } catch (error) {
    console.error('Error occurred during poll answer handler:', error);
  }
};

handler.command = [];  // Not a command but an event handler
handler.help = [];     // No help for event handlers
handler.tags = ['poll', 'group'];  // Poll event

module.exports = handler;

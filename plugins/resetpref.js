let handler = async (message, { bot, isOwner }) => {
  if (!isOwner) {
    return bot.sendMessage(message.chat.id, 'You do not have permission to use this command.');
  }

  // Resetting the bot's prefix logic (based on the original code)
  global.prefix = new RegExp(
    '^[' +
      (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(
        /[|\\{}()[\]^$+*?.\-\^]/g,
        '\\$&'
      ) +
      ']'
  );

  // Sending a confirmation message
  await bot.sendMessage(message.chat.id, 'PREFIX RESET SUCCESS');
};

handler.help = ['resetprefix'];
handler.tags = ['owner'];
handler.command = ['resetprefix'];

export default handler;

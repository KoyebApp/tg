let handler = async (m, { bot, text }) => {
  if (!text) {
    await bot.sendMessage(m.chat.id, '❌ No symbol detected. Please provide a symbol to set as the prefix.');
    return;
  }

  // Update the global prefix
  global.prefix = new RegExp('^[' + (text || global.opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

  // Notify the user
  await bot.sendMessage(m.chat.id, `✅ The prefix has been changed to *${text}*`);
}

// Metadata for the handler
handler.help = ['setprefix [prefix]'];
handler.tags = ['owner'];
handler.command = /^(setprefix)$/i;
handler.rowner = true;  // Restrict to bot owner

// Export the handler
export default handler;

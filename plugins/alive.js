// alive.js plugin example
const handler = async ({ bot, m, db }) => {
  await bot.sendMessage(m.chat.id, "Bot is alive and running!");
};

handler.command = ['alive', 'help'];  // List commands handled by this plugin
module.exports = handler;

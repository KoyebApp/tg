// Example plugin: alive.js
const handler = async ({ bot, m, db }) => {
  await bot.sendMessage(m.chat.id, "Bot is alive and running!");
};

handler.command = ['alive', 'help'];

module.exports = handler;

const { execSync } = require('child_process');

let handler = async ({ m, bot, text }) => {
  try {
    const chatId = m.chat.id;
    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Notify user that the update is starting
      await bot.sendMessage(chatId, "Updating the bot... Please wait...");

      // Run git pull to update the repo
      execSync('git pull', { stdio: 'inherit' });

      // Run npm start to restart the bot
      execSync('npm start', { stdio: 'inherit' });

      // Notify user about the successful update
      await bot.sendMessage(chatId, "Bot updated and restarted successfully.");
    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    // Handle errors
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred while updating the bot. Please try again later.");
    }
  }
};

module.exports = handler;

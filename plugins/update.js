const { exec } = require('child_process');

let handler = async ({ m, bot, query }) => {
  try {
    const chatId = m.chat.id;
    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    // Ensure the command is executed by the owner
    if (chatId.toString() === process.env.OWNER_ID) {
      // Extract query from the text
      const query = query.trim().toLowerCase();

      if (query === 'git pull') {
        // Run git pull command
        exec('git pull', { cwd: process.cwd() }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing git pull: ${error}`);
            bot.sendMessage(chatId, "An error occurred while executing git pull. Please try again later.");
            return;
          }
          console.log(stdout);
          bot.sendMessage(chatId, "Git pull completed successfully!");
        });
      } else if (query === 'npm start') {
        // Run npm start command
        exec('npm start', { cwd: process.cwd() }, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing npm start: ${error}`);
            bot.sendMessage(chatId, "Failed to start the bot. Please check the server logs.");
            return;
          }
          console.log(stdout);
          bot.sendMessage(chatId, "Npm start completed successfully!");
        });
      } else {
        bot.sendMessage(chatId, "Invalid command. Please use 'git pull' or 'npm start'.");
      }
    } else {
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    // Provide feedback to user
    if (m.chat && m.chat.id) {
      await bot.sendMessage(m.chat.id, "An error occurred. Please try again later.");
    }
  }
};

module.exports = handler;

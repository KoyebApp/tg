const { execSync } = require('child_process');
const fs = require('fs');

// Get the owner's chat ID from the environment variables
const OWNER_ID = process.env.OWNER_ID;

let handler = async ({ msg, bot, chatId, text }) => {
  try {
    // Ensure the command is executed by the owner
    if (chatId.toString() === OWNER_ID) {
      // Notify the user that the bot is updating
      bot.sendMessage(chatId, "Updating the bot... Please wait...");

      // Execute the git pull command
      let stdout = execSync('git pull' + (text ? ' ' + text : ''));

      // Reload all plugins (ensure the reload function exists or modify to fit your code)
      fs.readdirSync('plugins').forEach(v => global.reload('', v));

      // Send the output of the git pull command
      bot.sendMessage(chatId, stdout.toString());
    } else {
      // Send a message if the user is not authorized
      bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    console.error("Error during update:", error);
    bot.sendMessage(chatId, "An error occurred while updating the bot. Please try again later.");
  }
};

module.exports = handler;

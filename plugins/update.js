const { execSync } = require('child_process');
const fs = require('fs');
const simpleGit = require('simple-git');
const path = require('path');

// Get the owner's chat ID from the environment variables
const OWNER_ID = process.env.OWNER_ID;

let handler = async (msg, { bot }) => {
  // Ensure the command is executed by the owner
  if (msg.chat.id.toString() === OWNER_ID) {
    try {
      // Notify the user that the bot is updating
      bot.sendMessage(msg.chat.id, "Updating the bot... Please wait...");

      // Execute the git pull command
      let stdout = execSync('git pull' + (msg.text ? ' ' + msg.text : ''));

      // Reload all plugins (ensure the reload function exists or modify to fit your code)
      fs.readdirSync('plugins').forEach(v => global.reload('', v));

      // Send the output of the git pull command
      bot.sendMessage(msg.chat.id, stdout.toString());

    } catch (error) {
      console.error("Error during update:", error);
      bot.sendMessage(msg.chat.id, "An error occurred while updating the bot. Please try again later.");
    }
  } else {
    bot.sendMessage(msg.chat.id, "You are not authorized to use this command.");
  }
};

module.exports = handler;

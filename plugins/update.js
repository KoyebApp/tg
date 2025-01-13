const { execSync } = require('child_process');
const fs = require('fs');

// Fetch the owner ID from environment variables
const OWNER_ID = process.env.OWNER_ID;

let handler = async ({ m, bot, text }) => {
  try {
    // Extract chatId from m.chat.id
    const chatId = m.chat.id; // Correctly access the chatId from m

    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    console.log('Received chatId:', chatId);  // Debug log for chatId

    // Ensure the command is executed by the owner
    if (chatId.toString() === OWNER_ID) {
      // Notify the user that the bot is updating
      await bot.sendMessage(chatId, "Updating the bot... Please wait...");

      // Execute the git pull command
      let stdout = execSync('git pull' + (text ? ' ' + text : ''));

      // Reload all plugins (ensure the reload function exists or modify to fit your code)
      fs.readdirSync('plugins').forEach(v => global.reload && global.reload('', v));

      // Send the output of the git pull command
      await bot.sendMessage(chatId, stdout.toString());
    } else {
      // Send a message if the user is not authorized
      await bot.sendMessage(chatId, "You are not authorized to use this command.");
    }
  } catch (error) {
    console.error("Error during update:", error);
    if (error.message.includes("chatId is undefined")) {
      console.error("The chatId is not being passed correctly. Check your message format.");
    }
    await bot.sendMessage(chatId, "An error occurred while updating the bot. Please try again later.");
  }
};

module.exports = handler;

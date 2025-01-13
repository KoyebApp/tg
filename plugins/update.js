const { execSync } = require('child_process');
const fs = require('fs');

// Fetch the owner ID from environment variables
const OWNER_ID = process.env.OWNER_ID;

let handler = async ({ m, bot, text }) => {
  try {
    // Extract chatId from m.chat.id
    const chatId = m.chat.id;

    if (!chatId) {
      throw new Error('chatId is undefined');
    }

    console.log('Received chatId:', chatId);  // Debug log for chatId

    // Ensure the command is executed by the owner
    if (chatId.toString() === OWNER_ID) {
      // Notify the user that the bot is updating
      await bot.sendMessage(chatId, "Updating the bot... Please wait...");

      // Define the directory where the git repository exists
      const gitDirectory = '/path/to/your/git/repository';  // Change this to your actual directory

      // Execute the git pull command from the correct directory
      let stdout = execSync('git pull', { cwd: gitDirectory });

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
    // Ensure chatId is still defined before sending error message
    if (chatId) {
      await bot.sendMessage(chatId, "An error occurred while updating the bot. Please try again later.");
    } else {
      console.error("chatId is not available to send error message.");
    }
  }
};

module.exports = handler;
